'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { Send, Copy, ExternalLink, CheckCircle } from 'lucide-react'
import { CalcInput, CalculationResults } from '@/lib/types'

interface ProposalExportProps {
  projectData: CalcInput
  results: CalculationResults
  clientName: string
  clientEmail: string
  projectName?: string
}

export function ProposalExport({ 
  projectData, 
  results, 
  clientName, 
  clientEmail,
  projectName = 'Casa Vista Residential Remodel'
}: ProposalExportProps) {
  const [generating, setGenerating] = useState(false)
  const [proposalUrl, setProposalUrl] = useState('')
  const [proposalToken, setProposalToken] = useState('')

  const generateProposal = async () => {
    setGenerating(true)
    
    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectData,
          results,
          clientName,
          clientEmail,
          projectName,
          notes: `Generated on ${new Date().toLocaleDateString()}`
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate proposal')
      }
      
      const data = await response.json()
      
      if (data.success && data.data) {
        const fullUrl = `${window.location.origin}/proposal/${data.data.token}`
        setProposalUrl(fullUrl)
        setProposalToken(data.data.token)
        toast.success('Proposal generated successfully!')
      } else if (data.token) {
        // Fallback response format
        const fullUrl = `${window.location.origin}/proposal/${data.token}`
        setProposalUrl(fullUrl)
        setProposalToken(data.token)
        toast.success('Proposal generated successfully!')
      } else {
        throw new Error(data.error || 'Failed to generate proposal')
      }
    } catch (error) {
      console.error('Error generating proposal:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to generate proposal')
    } finally {
      setGenerating(false)
    }
  }

  const copyProposalUrl = () => {
    if (proposalUrl) {
      navigator.clipboard.writeText(proposalUrl)
      toast.success('Proposal link copied to clipboard!')
    }
  }

  const openProposal = () => {
    if (proposalUrl) {
      window.open(proposalUrl, '_blank')
    }
  }

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Export Proposal
        </CardTitle>
        <CardDescription>
          Generate a secure, client-safe proposal link
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Client Info Summary */}
        <div className="p-3 bg-white/80 rounded-lg space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Client:</span>
            <span className="font-medium">{clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Project:</span>
            <span className="font-medium">{projectName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Budget:</span>
            <span className="font-medium">${results.budgets.totalBudget.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Contract Price:</span>
            <span className="font-bold text-lg">${results.fees.contractPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Options Preview */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-white/60 rounded">
            <div className="text-xs text-muted-foreground">Option A</div>
            <div className="font-semibold">${results.options.A.investment.toLocaleString()}</div>
          </div>
          <div className="text-center p-2 bg-white/60 rounded">
            <div className="text-xs text-muted-foreground">Option B</div>
            <div className="font-semibold">${results.options.B.investment.toLocaleString()}</div>
          </div>
          <div className="text-center p-2 bg-white/60 rounded">
            <div className="text-xs text-muted-foreground">Option C</div>
            <div className="font-semibold">${results.options.C.investment.toLocaleString()}</div>
          </div>
        </div>

        {/* Generate Button */}
        {!proposalUrl ? (
          <Button 
            onClick={generateProposal}
            disabled={generating}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating Secure Link...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Generate Client Proposal
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            {/* Success Message */}
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Proposal Ready!</span>
            </div>
            
            {/* URL Display */}
            <div className="p-2 bg-white rounded border text-xs font-mono break-all">
              {proposalUrl}
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={copyProposalUrl}
                className="w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button 
                onClick={openProposal}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Proposal
              </Button>
            </div>
            
            {/* Regenerate Option */}
            <Button 
              variant="ghost" 
              onClick={generateProposal}
              disabled={generating}
              className="w-full text-xs"
            >
              Generate New Link
            </Button>
          </div>
        )}
        
        {/* Security Note */}
        <div className="text-xs text-muted-foreground p-2 bg-gray-50 rounded">
          <strong>Secure:</strong> Each proposal has a unique token. Clients see only value-based pricing, no internal calculations.
        </div>
      </CardContent>
    </Card>
  )
}