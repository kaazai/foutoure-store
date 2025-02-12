const domain = process.env.SHOPIFY_STORE_DOMAIN!
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!

async function ShopifyFetch({
  query,
  variables,
}: {
  query: string
  variables?: any
}) {
  try {
    const result = await fetch(
      `https://${domain}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
        },
        body: JSON.stringify({ query, variables }),
      }
    )

    return {
      status: result.status,
      body: await result.json(),
    }
  } catch (error) {
    console.error("Error:", error)
    return {
      status: 500,
      error: "Error receiving data",
    }
  }
}

export async function getProducts() {
  const query = `
    query Products {
      products(first: 12) {
        edges {
          node {
            id
            title
            handle
            description
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
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `

  const { body } = await ShopifyFetch({ query })

  if (!body?.data?.products?.edges) {
    throw new Error('No products found')
  }

  const products = body.data.products.edges.map(({ node }: any) => {
    const { id, title, handle, description, priceRange, images, variants } = node

    const product = {
      id,
      title,
      handle,
      description,
      price: priceRange.minVariantPrice.amount,
      currencyCode: priceRange.minVariantPrice.currencyCode,
      image: images.edges[0]?.node,
      variant: variants.edges[0]?.node,
    }

    return product
  })

  return products
}

export async function shopifyFetch({
  query,
  variables = {},
  headers = {},
  cache = "force-cache"
}: {
  query: string
  variables?: any
  headers?: HeadersInit
  cache?: RequestCache
}) {
  try {
    const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`
    const key = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": key || "",
        ...headers
      },
      body: JSON.stringify({ query, variables }),
      cache
    })

    const body = await result.json()

    if (body.errors) {
      throw new Error(body.errors[0].message)
    }

    return {
      status: result.status,
      data: body.data
    }
  } catch (error) {
    throw {
      status: 500,
      message: error instanceof Error ? error.message : "Error fetching from Shopify"
    }
  }
} 