// Analytics tracking for proposal events

interface EventData {
  proposalId?: string
  proposalToken?: string
  optionSelected?: 'A' | 'B' | 'C'
  timestamp?: string
  [key: string]: any
}

interface TrackOptions {
  userAgent?: string
  ipAddress?: string
}

/**
 * Track analytics events for proposals
 * Sends events to the proposal_events table via API
 */
export async function trackEvent(
  eventType: 'proposal_opened' | 'option_viewed' | 'option_selected' | 'cta_clicked' | 'contact_requested',
  data: EventData,
  options?: TrackOptions
) {
  try {
    // Don't track in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_ENABLE_ANALYTICS) {
      console.log('[Analytics Dev]', eventType, data)
      return
    }

    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: eventType,
        event_data: {
          ...data,
          timestamp: data.timestamp || new Date().toISOString(),
          page_url: typeof window !== 'undefined' ? window.location.href : undefined,
          referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        },
        user_agent: options?.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : undefined),
        client_ip: options?.ipAddress,
      }),
    })

    if (!response.ok) {
      console.warn('Failed to track event:', eventType, await response.text())
    }
  } catch (error) {
    // Silently fail - analytics should never break the app
    console.warn('Analytics error:', error)
  }
}

/**
 * Track proposal view with debouncing to avoid duplicate events
 */
let viewDebounceTimer: NodeJS.Timeout | null = null
export function trackProposalView(proposalToken: string) {
  if (viewDebounceTimer) {
    clearTimeout(viewDebounceTimer)
  }
  
  viewDebounceTimer = setTimeout(() => {
    trackEvent('proposal_opened', { proposalToken })
  }, 1000) // Debounce for 1 second
}

/**
 * Track option selection
 */
export function trackOptionSelection(proposalToken: string, option: 'A' | 'B' | 'C') {
  trackEvent('option_selected', {
    proposalToken,
    optionSelected: option,
  })
}

/**
 * Track CTA clicks
 */
export function trackCTAClick(proposalToken: string, ctaType: string) {
  trackEvent('cta_clicked', {
    proposalToken,
    ctaType,
  })
}

/**
 * Get analytics summary for a proposal (server-side only)
 */
export async function getProposalAnalytics(proposalId: string) {
  try {
    const response = await fetch(`/api/analytics/proposals/${proposalId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch analytics')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return null
  }
}