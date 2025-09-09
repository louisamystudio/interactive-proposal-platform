'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Send, Copy, ExternalLink, CheckCircle, FileText, AlertCircle } from 'lucide-react'
import { ProjectResults } from '@/lib/types'

interface ProposalExportProps {
  results: ProjectResults
  projectData: any
}

export function ProposalExport({ results, projectData }: ProposalExportProps) {
  const [clientName, setClientName] = useState('Dr. Luis De Jesús')
  const [clientEmail, setClientEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [generating, setGenerating] = useState(false)
  const [proposalUrl, setProposalUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerateProposal = async () => {
    try {
      setGenerating(true)
      
      // Create client-safe data (no hours, rates, internal calculations)
      const clientSafeData = {
        clientName,
        projectData: {
          classification: projectData.classification,
          areas: projectData.areas,
          multipliers: projectData.multipliers
        },
        results: {
          budgets: results.budgets,
          disciplines: results.disciplines,
          options: results.options,
          // Explicitly exclude: hours, fees (internal calculations)
        }
      }

      const response = await fetch('/api/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...clientSafeData,
          clientEmail,
          notes
        })
      })

      if (!response.ok) throw new Error('Failed to generate proposal')

      const { token } = await response.json()
      const url = `${window.location.origin}/proposal/${token}`
      setProposalUrl(url)
    } catch (error) {
      console.error('Error generating proposal:', error)
      alert('Failed to generate proposal. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(proposalUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Export Client Proposal
            </CardTitle>
            <CardDescription>
              Generate a client-safe proposal with value-based pricing
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm text-amber-600">
            <AlertCircle className="h-4 w-4" />
            No internal data exposed
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!proposalUrl ? (
          <>
            {/* Client Information */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Client Name</label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter client name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Client Email (optional)</label>
                <Input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Internal Notes (optional)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any internal notes about this proposal..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* Summary of what will be included */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Proposal will include:</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Three investment options (A/B/C) with Option A featured
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Total construction budget: ${results.budgets.totalBudget.toLocaleString()}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Discipline allocations and service breakdown
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Interactive 3D model viewer
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Value-based messaging (no hourly rates)
                </li>
              </ul>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateProposal}
              disabled={!clientName || generating}
              className="w-full"
              size="lg"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating Proposal...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Generate Client Proposal
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Proposal Generated!</h3>
              <p className="text-gray-600 mb-6">
                Your client proposal has been created and is ready to share.
              </p>

              {/* Proposal URL */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Proposal URL</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyUrl}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="font-mono text-sm text-blue-600 break-all">
                  {proposalUrl}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => window.open(proposalUrl, '_blank')}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Proposal
                </Button>
                <Button
                  onClick={() => {
                    setProposalUrl('')
                    setClientEmail('')
                    setNotes('')
                  }}
                  className="flex-1"
                >
                  Create Another
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="text-sm text-gray-500 text-center">
              This proposal link is unique and secure. It will remain active for 30 days.
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
