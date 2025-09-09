'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ExternalLink, Eye, QrCode, AlertCircle } from 'lucide-react'

interface ThreeDModelViewerProps {
  modelUrl?: string
  title?: string
  className?: string
  showQRCode?: boolean
}

// QR Code component for 3D model links
function QRCodeDisplay({ url, title }: { url: string; title: string }) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  useEffect(() => {
    // Generate QR code using a service (in production, use your own service)
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&format=svg`
    setQrCodeUrl(qrApiUrl)
  }, [url])

  return (
    <div className="flex flex-col items-center space-y-2 p-4 bg-gray-50 rounded-lg">
      <div className="w-32 h-32 bg-white rounded border flex items-center justify-center">
        {qrCodeUrl ? (
          <Image 
            src={qrCodeUrl} 
            alt={`QR code for ${title}`} 
            width={128}
            height={128}
            className="w-full h-full object-contain" 
          />
        ) : (
          <QrCode className="h-8 w-8 text-gray-400" />
        )}
      </div>
      <p className="text-xs text-gray-600 text-center">
        Scan to explore<br />in 3D on your device
      </p>
    </div>
  )
}

export function ThreeDModelViewer({ 
  modelUrl, 
  title = "3D Model",
  className = '',
  showQRCode = true
}: ThreeDModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Use environment variable for model URL if not provided
  const finalModelUrl = modelUrl || process.env.NEXT_PUBLIC_NIRA_MODEL_URL

  const handleModelLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleModelError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Check if 3D models are enabled
  const modelsEnabled = process.env.NEXT_PUBLIC_ENABLE_3D_MODELS === 'true'

  if (!modelsEnabled || !finalModelUrl) {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 ${className}`}>
        <div className="text-center space-y-4">
          <div className="w-full h-48 bg-blue-200/50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Eye className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <p className="text-blue-700 font-medium">{title}</p>
              <p className="text-sm text-blue-600">3D Model Coming Soon</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button variant="outline" className="w-full" disabled>
              <Eye className="h-4 w-4 mr-2" />
              Experience in VR
            </Button>
            <p className="text-xs text-gray-500">
              Immersive visualization available in production
            </p>
          </div>

          {showQRCode && finalModelUrl && (
            <QRCodeDisplay url={finalModelUrl} title={title} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-lg ${className}`}>
      {/* 3D Model Container */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading 3D model...</p>
            </div>
          </div>
        )}

        {hasError ? (
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Unable to load 3D model</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.open(finalModelUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        ) : (
          <iframe
            src={finalModelUrl}
            className="w-full h-64 border-0"
            title={title}
            onLoad={handleModelLoad}
            onError={handleModelError}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">Interactive 3D Experience</p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(finalModelUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Full Screen
            </Button>
          </div>
        </div>

        {/* QR Code for mobile access */}
        {showQRCode && (
          <div className="mt-4 pt-4 border-t">
            <QRCodeDisplay url={finalModelUrl} title={title} />
          </div>
        )}
      </div>
    </div>
  )
}
