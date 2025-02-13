'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"

export default function CreateProductsPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const createProducts = async () => {
    try {
      setStatus('loading')
      const response = await fetch('/api/test/create-products', {
        method: 'POST',
      })
      const data = await response.json()
      
      if (data.success) {
        setStatus('success')
        setMessage('Products created successfully!')
      } else {
        setStatus('error')
        setMessage(data.message || 'Failed to create products')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred while creating products')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create Sample Products</h1>
      <div className="space-y-4">
        <Button 
          onClick={createProducts}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Creating...' : 'Create Sample Products'}
        </Button>

        {status !== 'idle' && (
          <div className={`p-4 rounded ${
            status === 'success' ? 'bg-green-100 text-green-800' : 
            status === 'error' ? 'bg-red-100 text-red-800' : 
            'bg-gray-100'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
} 