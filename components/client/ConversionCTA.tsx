'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Phone, CheckCircle, MessageSquare, Clock, Shield } from 'lucide-react'

interface ConversionCTAProps {
  onAccept?: () => void
  onScheduleCall?: () => void
  onAskQuestion?: () => void
}

export function ConversionCTA({ onAccept, onScheduleCall, onAskQuestion }: ConversionCTAProps) {
  return (
    <div className="space-y-6">
      {/* Main CTA Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Ready to Transform Your Vision into Reality?</h2>
              <p className="text-blue-100 text-lg">
                Join hundreds of satisfied clients who trust Louis Amy AE Studio with their most important projects
              </p>
            </div>
            
            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
              <Button 
                size="lg"
                variant="secondary"
                className="flex-1 bg-white text-blue-700 hover:bg-blue-50"
                onClick={onAccept}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Accept & Reserve Your Spot
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="flex-1 bg-transparent text-white border-white hover:bg-white/10"
                onClick={onScheduleCall}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Consultation
              </Button>
            </div>
            
            {/* Secondary Action */}
            <div>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={onAskQuestion}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Have Questions? Let's Talk
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Trust Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold">Limited Availability</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  We accept only 3 new projects per quarter to ensure dedicated attention
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold">Risk-Free Guarantee</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  100% satisfaction guaranteed or we'll revise until you're completely happy
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-purple-600 mt-1" />
              <div>
                <h4 className="font-semibold">Direct Access</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Work directly with principals, not junior staff or outsourced teams
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Urgency/Scarcity */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
              <p className="text-sm font-medium text-orange-900">
                This proposal is valid for 14 days • Pricing subject to change after expiration
              </p>
            </div>
            <p className="text-sm text-orange-700 font-semibold">
              Expires in 13 days
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Contact Information */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Questions? Contact us directly:</p>
        <p className="font-semibold mt-1">
          <a href="tel:+17875555555" className="hover:underline">+1 (787) 555-5555</a> • 
          <a href="mailto:projects@louisamy.com" className="hover:underline ml-2">projects@louisamy.com</a>
        </p>
        <p className="mt-2">
          Louis Amy AE Studio • San Juan, Puerto Rico • Since 1998
        </p>
      </div>
    </div>
  )
}