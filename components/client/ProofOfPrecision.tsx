'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Play, Maximize2, Building } from 'lucide-react'

interface ProofOfPrecisionProps {
  modelUrl?: string
  projectImages?: string[]
}

export function ProofOfPrecision({ modelUrl, projectImages }: ProofOfPrecisionProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Experience Your Project in 3D</CardTitle>
          <Badge variant="secondary">
            <Building className="h-3 w-3 mr-1" />
            Interactive Model
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 3D Model Viewer */}
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {modelUrl ? (
            <iframe
              src={modelUrl}
              className="w-full h-full"
              title="3D Building Model"
              allow="fullscreen; autoplay; xr-spatial-tracking"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Building className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                3D Model Coming Soon
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your interactive 3D building model will be available here once the preliminary design phase begins
              </p>
              <Button variant="outline" disabled>
                <Play className="mr-2 h-4 w-4" />
                Preview Unavailable
              </Button>
            </div>
          )}
        </div>
        
        {/* Model Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">360°</div>
            <p className="text-sm text-gray-600 mt-1">Full Rotation View</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">4K</div>
            <p className="text-sm text-gray-600 mt-1">Ultra HD Quality</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">VR</div>
            <p className="text-sm text-gray-600 mt-1">Virtual Reality Ready</p>
          </div>
        </div>
        
        {/* View Options */}
        <div className="flex gap-3 justify-center">
          <Button 
            variant="outline" 
            onClick={() => modelUrl && window.open(modelUrl, '_blank')}
            disabled={!modelUrl}
          >
            <Maximize2 className="mr-2 h-4 w-4" />
            Fullscreen View
          </Button>
          <Button 
            variant="outline"
            onClick={() => modelUrl && window.open(modelUrl, '_blank')}
            disabled={!modelUrl}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in New Tab
          </Button>
        </div>
        
        {/* Technology Note */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-sm text-blue-900 mb-1">
            Powered by Advanced BIM Technology
          </h4>
          <p className="text-xs text-blue-800">
            Our 3D models use cutting-edge Building Information Modeling (BIM) technology, 
            ensuring precise measurements, accurate material specifications, and seamless 
            coordination between all design disciplines. This digital twin of your project 
            helps identify and resolve potential issues before construction begins.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}