const domain = process.env.SHOPIFY_STORE_DOMAIN!
const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!

async function ShopifyFetch({
  query,
  variables,
}: {
  query: string
  variables?: any
}) {
  if (!domain) {
    throw new Error('SHOPIFY_STORE_DOMAIN is not set')
  }
  if (!adminAccessToken) {
    throw new Error('SHOPIFY_ADMIN_ACCESS_TOKEN is not set')
  }

  const url = `https://${domain}/admin/api/2024-01/graphql.json`
  console.log('Fetching from:', url)
  
  try {
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminAccessToken,
        "Accept": "application/json"
      },
      body: JSON.stringify({
        query,
        variables: variables || undefined
      }),
      cache: 'no-store'
    })

    if (!result.ok) {
      console.error('HTTP Error:', result.status, result.statusText)
      const text = await result.text()
      console.error('Response text:', text)
      throw new Error(`HTTP error! status: ${result.status}`)
    }

    const json = await result.json()
    console.log('API Response:', json)
    
    if (json.errors) {
      console.error('Shopify API Errors:', json.errors)
      throw new Error(json.errors[0].message)
    }

    if (!json.data) {
      console.error('No data in response:', json)
      throw new Error('No data received from Shopify API')
    }

    return {
      status: result.status,
      body: json,
    }
  } catch (error) {
    console.error("Shopify API Error:", error)
    throw error
  }
}

export async function getProducts() {
  const query = `
    query {
      products(first: 50, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            title
            handle
            description
            status
            publishedAt
            onlineStoreUrl
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  inventoryQuantity
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const { data } = await shopifyFetch({ 
    query,
    next: { revalidate: 60 }
  })

  if (!data?.products?.edges) {
    console.log('Raw API response:', data)
    throw new Error('No products found')
  }

  console.log('Found products:', data.products.edges.length)
  data.products.edges.forEach((edge: any) => {
    const node = edge.node
    console.log('Product:', {
      id: node.id,
      title: node.title,
      handle: node.handle,
      status: node.status,
      publishedAt: node.publishedAt,
      onlineStoreUrl: node.onlineStoreUrl,
      price: node.variants?.edges[0]?.node?.price,
      variantCount: node.variants?.edges?.length || 0
    })
  })

  return data.products.edges.map((edge: any) => {
    const node = edge.node
    return {
      id: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description,
      images: {
        edges: node.images.edges
      },
      priceRange: {
        minVariantPrice: node.priceRange.minVariantPrice
      },
      variants: {
        edges: node.variants.edges
      },
      status: node.status,
      publishedAt: node.publishedAt,
      onlineStoreUrl: node.onlineStoreUrl
    }
  })
}

export async function shopifyFetch({
  query,
  variables = {},
  headers = {},
  next
}: {
  query: string
  variables?: any
  headers?: HeadersInit
  next?: { revalidate: number }
}) {
  try {
    const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`
    const key = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

    if (!key) {
      throw new Error('SHOPIFY_ADMIN_ACCESS_TOKEN is not set')
    }

    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": key,
        "Accept": "application/json",
        ...headers
      },
      body: JSON.stringify({ query, variables }),
      next
    })

    if (!result.ok) {
      const text = await result.text()
      console.error('Admin API Error Response:', text)
      throw new Error(`HTTP error! status: ${result.status}`)
    }

    const body = await result.json()

    if (body.errors) {
      console.error('Admin API Errors:', body.errors)
      throw new Error(body.errors[0].message)
    }

    return {
      status: result.status,
      data: body.data
    }
  } catch (error) {
    console.error("Admin API Error:", error)
    throw {
      status: 500,
      message: error instanceof Error ? error.message : "Error fetching from Shopify"
    }
  }
}

export async function createSampleProducts() {
  const getIdsQuery = `
    query {
      locations(first: 1) {
        edges {
          node {
            id
          }
        }
      }
      publications(first: 1) {
        edges {
          node {
            id
            name
          }
        }
      }
      channels(first: 10) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `

  const idsResult = await shopifyFetch({ query: getIdsQuery })
  const locationId = idsResult.data?.locations?.edges[0]?.node?.id
  const publicationId = idsResult.data?.publications?.edges[0]?.node?.id
  const channelId = idsResult.data?.channels?.edges?.find(
    (edge: any) => edge.node.name === "Online Store"
  )?.node?.id

  if (!locationId) {
    throw new Error('No location found in the store')
  }
  if (!publicationId) {
    throw new Error('No publication found')
  }
  if (!channelId) {
    throw new Error('Online Store channel not found')
  }

  const createProductMutation = `
    mutation productCreate($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          status
          variants(first: 10) {
            edges {
              node {
                id
                price
                sku
                inventoryQuantity
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const publishProductMutation = `
    mutation publishProduct($input: ProductPublishInput!) {
      productPublish(input: $input) {
        product {
          id
          title
          handle
          publishedAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const addToChannelMutation = `
    mutation publishToChannel($id: ID!) {
      publishablePublishToCurrentChannel(id: $id) {
        publishable {
          ... on Product {
            id
            title
            status
            publishedAt
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const sampleProducts = [
    {
      title: "FOUTOURE Essential Hoodie",
      descriptionHtml: "<p>Premium cotton blend hoodie with minimalist design. Features a comfortable fit and durable construction.</p>",
      vendor: "FOUTOURE",
      productType: "Hoodie",
      tags: ["Essentials", "Hoodie", "Streetwear"],
      status: "ACTIVE",
      options: ["Color", "Size"],
      variants: [
        { 
          price: "129.00",
          sku: "ESS-HOOD-BLK-S",
          inventoryQuantities: [{ 
            availableQuantity: 10,
            locationId: locationId
          }],
          options: ["Black", "S"],
          requiresShipping: true,
          taxable: true,
          inventoryManagement: "SHOPIFY"
        },
        { 
          price: "129.00",
          sku: "ESS-HOOD-BLK-M",
          inventoryQuantities: [{ 
            availableQuantity: 15,
            locationId: locationId
          }],
          options: ["Black", "M"],
          requiresShipping: true,
          taxable: true,
          inventoryManagement: "SHOPIFY"
        },
        { 
          price: "129.00",
          sku: "ESS-HOOD-BLK-L",
          inventoryQuantities: [{ 
            availableQuantity: 15,
            locationId: locationId
          }],
          options: ["Black", "L"],
          requiresShipping: true,
          taxable: true,
          inventoryManagement: "SHOPIFY"
        }
      ]
    },
    {
      title: "FOUTOURE Graphic Tee",
      descriptionHtml: "<p>100% organic cotton t-shirt featuring original artwork. Relaxed fit with premium quality print.</p>",
      vendor: "FOUTOURE",
      productType: "T-Shirt",
      tags: ["T-Shirt", "Graphic", "Streetwear"],
      status: "ACTIVE",
      options: ["Color", "Size"],
      variants: [
        { 
          price: "49.00",
          sku: "GRAPH-TEE-WHT-S",
          inventoryQuantities: [{ 
            availableQuantity: 20,
            locationId: locationId
          }],
          options: ["White", "S"],
          requiresShipping: true,
          taxable: true,
          inventoryManagement: "SHOPIFY"
        },
        { 
          price: "49.00",
          sku: "GRAPH-TEE-WHT-M",
          inventoryQuantities: [{ 
            availableQuantity: 25,
            locationId: locationId
          }],
          options: ["White", "M"],
          requiresShipping: true,
          taxable: true,
          inventoryManagement: "SHOPIFY"
        },
        { 
          price: "49.00",
          sku: "GRAPH-TEE-WHT-L",
          inventoryQuantities: [{ 
            availableQuantity: 25,
            locationId: locationId
          }],
          options: ["White", "L"],
          requiresShipping: true,
          taxable: true,
          inventoryManagement: "SHOPIFY"
        }
      ]
    },
    {
      title: "FOUTOURE Cargo Pants",
      descriptionHtml: "<p>Technical cargo pants with multiple pockets. Made from durable ripstop fabric with water-resistant coating.</p>",
      vendor: "FOUTOURE",
      productType: "Pants",
      tags: ["Pants", "Cargo", "Streetwear"],
      status: "ACTIVE",
      options: ["Color", "Size"],
      variants: [
        { 
          price: "149.00",
          sku: "CARGO-PNT-BLK-S",
          inventoryQuantities: [{ 
            availableQuantity: 10,
            locationId: locationId
          }],
          options: ["Black", "S"],
          requiresShipping: true,
          taxable: true,
          inventoryManagement: "SHOPIFY"
        },
        { 
          price: "149.00",
          sku: "CARGO-PNT-BLK-M",
          inventoryQuantities: [{ 
            availableQuantity: 15,
            locationId: locationId
          }],
          options: ["Black", "M"],
          requiresShipping: true,
          taxable: true,
          inventoryManagement: "SHOPIFY"
        },
        { 
          price: "149.00",
          sku: "CARGO-PNT-BLK-L",
          inventoryQuantities: [{ 
            availableQuantity: 15,
            locationId: locationId
          }],
          options: ["Black", "L"],
          requiresShipping: true,
          taxable: true,
          inventoryManagement: "SHOPIFY"
        }
      ]
    }
  ]

  const results = []

  for (const product of sampleProducts) {
    try {
      // Create the product
      const result = await shopifyFetch({
        query: createProductMutation,
        variables: {
          input: {
            title: product.title,
            descriptionHtml: product.descriptionHtml,
            vendor: product.vendor,
            productType: product.productType,
            tags: product.tags,
            status: "ACTIVE",
            options: product.options,
            variants: product.variants.map(variant => ({
              price: variant.price,
              sku: variant.sku,
              inventoryQuantities: variant.inventoryQuantities,
              options: variant.options,
              requiresShipping: variant.requiresShipping,
              taxable: variant.taxable,
              inventoryManagement: variant.inventoryManagement
            }))
          }
        }
      })

      if (result.data?.productCreate?.userErrors?.length > 0) {
        console.error(`Error creating ${product.title}:`, result.data.productCreate.userErrors)
        continue
      }

      console.log(`Created product: ${product.title}`)
      const createdProduct = result.data.productCreate.product

      // Publish the product to Online Store
      const publishResult = await shopifyFetch({
        query: publishProductMutation,
        variables: {
          input: {
            id: createdProduct.id,
            productPublications: [{
              publicationId: publicationId,
              channelId: channelId,
              publishDate: new Date().toISOString()
            }]
          }
        }
      })

      if (publishResult.data?.productPublish?.userErrors?.length > 0) {
        console.error(`Error publishing ${product.title}:`, publishResult.data.productPublish.userErrors)
      } else {
        console.log(`Published product: ${product.title}`)
      }

      // Wait a bit for the publish to take effect
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Add to Online Store channel
      const channelResult = await shopifyFetch({
        query: addToChannelMutation,
        variables: {
          id: createdProduct.id
        }
      })

      if (channelResult.data?.publishablePublishToCurrentChannel?.userErrors?.length > 0) {
        console.error(`Error adding ${product.title} to channel:`, channelResult.data.publishablePublishToCurrentChannel.userErrors)
      } else {
        console.log(`Added ${product.title} to Online Store channel`)
      }

      // Wait longer for indexing
      console.log(`Waiting for ${product.title} to be indexed...`)
      await new Promise(resolve => setTimeout(resolve, 3000))

      results.push(createdProduct)
    } catch (error) {
      console.error(`Failed to create/publish ${product.title}:`, error)
    }
  }

  return results
}

export async function updateProductImages(productId: string) {
  const createMediaMutation = `
    mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
      productCreateMedia(media: $media, productId: $productId) {
        media {
          ... on MediaImage {
            id
            image {
              url
            }
          }
        }
        mediaUserErrors {
          field
          message
        }
      }
    }
  `

  const sampleImages = {
    hoodie: "https://cdn.shopify.com/s/files/1/0784/6040/3577/files/hoodie-sample.jpg",
    tee: "https://cdn.shopify.com/s/files/1/0784/6040/3577/files/tee-sample.jpg",
    pants: "https://cdn.shopify.com/s/files/1/0784/6040/3577/files/pants-sample.jpg"
  }

  try {
    const result = await shopifyFetch({
      query: createMediaMutation,
      variables: {
        productId: productId,
        media: [{
          mediaContentType: "IMAGE",
          originalSource: sampleImages.hoodie
        }]
      }
    })

    if (result.data?.productCreateMedia?.mediaUserErrors?.length > 0) {
      console.error(`Error updating product images:`, result.data.productCreateMedia.mediaUserErrors)
      throw new Error(result.data.productCreateMedia.mediaUserErrors[0].message)
    } else {
      console.log(`Updated product images for product ${productId}`)
    }

    return result.data?.productCreateMedia?.media
  } catch (error) {
    console.error(`Failed to update product images:`, error)
    throw error
  }
}

export async function getProductByHandle(handle: string) {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        status
        publishedAt
        onlineStoreUrl
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              price
              inventoryQuantity
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `

  const { data } = await shopifyFetch({ 
    query,
    variables: { handle },
    next: { revalidate: 60 }
  })

  if (!data?.productByHandle) {
    throw new Error('Product not found')
  }

  const product = data.productByHandle
  const images = product.images?.edges.map((edge: any) => edge.node) || []
  const variants = product.variants?.edges.map((edge: any) => edge.node) || []

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    images,
    variants,
    price: variants[0]?.price || "0.00",
    currencyCode: product.priceRange?.minVariantPrice?.currencyCode || "USD",
    status: product.status,
    publishedAt: product.publishedAt,
    onlineStoreUrl: product.onlineStoreUrl
  }
}

export async function setupMetafieldDefinitions() {
  const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}T${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}:${String(endDate.getSeconds()).padStart(2, '0')}`

  const definitions = [
    {
      namespace: "announcements",
      key: "announcement_enabled",
      type: "boolean",
      value: true
    },
    {
      namespace: "announcements",
      key: "announcement_text",
      type: "single_line_text_field",
      value: "Welcome to FOUTOURE - Premium Streetwear"
    },
    {
      namespace: "announcements",
      key: "announcement_end_date",
      type: "date_time",
      value: formattedEndDate
    },
    {
      namespace: "announcements",
      key: "announcement_promo_code",
      type: "single_line_text_field",
      value: "WELCOME20"
    },
    {
      namespace: "announcements",
      key: "announcement_gradient_from",
      type: "single_line_text_field",
      value: "purple-600"
    },
    {
      namespace: "announcements",
      key: "announcement_gradient_to",
      type: "single_line_text_field",
      value: "pink-600"
    }
  ]

  try {
    const results = []
    
    // Set all metafield values at once
    const mutation = `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
            type
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const response = await ShopifyFetch({
      query: mutation,
      variables: {
        metafields: definitions.map(def => ({
          namespace: def.namespace,
          key: def.key,
          type: def.type,
          value: typeof def.value === 'string' ? def.value : JSON.stringify(def.value),
          ownerId: "gid://shopify/Shop/93125181765"
        }))
      }
    })

    if (response.body.data?.metafieldsSet?.userErrors?.length > 0) {
      console.error('Error setting metafields:', response.body.data.metafieldsSet.userErrors)
      throw new Error(response.body.data.metafieldsSet.userErrors[0].message)
    }

    const updatedMetafields = response.body.data?.metafieldsSet?.metafields
    if (updatedMetafields) {
      console.log('Updated metafields:', updatedMetafields)
      results.push(...updatedMetafields)
    }

    return results
  } catch (error) {
    console.error('Error setting up metafields:', error)
    throw error
  }
}