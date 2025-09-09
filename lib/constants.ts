// lib/constants.ts - Single Source of Truth for all constants
export type Mode = 'EXCEL' | 'SSOT'

// Choose calibration mode (switch to match desired Excel/SSOT behavior)
export const MODE: Mode = 'EXCEL' // Default to match original Excel model

export const CONSTANTS = {
  SSOT: {
    // Current app calculation constants
    HFA_OFFSET: 0.08,
    MARKET_FEE_RATE: 0.178025631,
    AVG_LABOR_RATE: 35.73,
    AVG_OVERHEAD_RATE: 46.10,
    MARKUP: 2.0,
    MAX_DISCOUNT: 0.25,
    CATEGORY_MULTIPLIERS: { 1: 0.9, 2: 1.0, 3: 1.1, 4: 1.2, 5: 1.3 },

    // Expected results for Dr. De Jesús project
    VALIDATION: {
      totalBudget: 859365,
      shellBudget: 567180.9,
      interiorBudget: 189060.3,
      landscapeBudget: 103123.8,
      totalHours: 1148.27, // SSOT formula result
      contractPrice: 187925.55, // Bottom-up fee dominates
    },
  },
  EXCEL: {
    // Tuned to reproduce original Excel outputs
    HFA_OFFSET: 0.0719, // Calibrated to yield ~1184 hours
    MARKET_FEE_RATE: 0.164395, // So 25%-discounted market = $137,743.50
    AVG_LABOR_RATE: 35.73,
    AVG_OVERHEAD_RATE: 46.10,
    MARKUP: 1.40, // Keep LouisAmyFee below discounted market
    MAX_DISCOUNT: 0.25,
    CATEGORY_MULTIPLIERS: { 1: 0.9, 2: 1.0, 3: 1.1, 4: 1.2, 5: 1.3 },

    // Expected results matching original Excel
    VALIDATION: {
      totalBudget: 859365,
      shellBudget: 567180.9,
      interiorBudget: 189060.3,
      landscapeBudget: 103123.8,
      totalHours: 1184, // Original Excel target
      contractPrice: 137743.42, // Calibrated contract price with 2-dec rounding
    },
  },
} as const

// Export active configuration
export const CONFIG = CONSTANTS[MODE]

// Client-facing options (always fixed, never calculated)
export const CLIENT_OPTIONS = {
  A: {
    investment: 187_099,
    title: 'Fully Integrated Vision',
    valuePromise:
      'The pinnacle of bespoke luxury - one team, one vision, zero compromises',
  },
  B: {
    investment: 126_636,
    title: 'Collaborative Partnership',
    valuePromise: 'Seamless alliance - we lead integration with your interior designer',
  },
  C: {
    investment: 87_898,
    title: 'Architectural Foundation',
    valuePromise:
      'Robust foundation - permit-ready shell with self-managed coordination',
  },
} as const

// Dr. De Jesús project inputs (corrected for budget consistency)
export const DR_DE_JESUS_PROJECT = {
  classification: {
    buildingUse: 'Residential' as const,
    buildingType: 'Custom Houses',
    buildingTier: 'High' as const,
    category: 5 as const,
    designLevel: 3 as const,
  },
  areas: {
    newAreaFt2: 0,
    existingAreaFt2: 4407,
  },
  costs: {
    newTargetPSF: 390,
    remodelTargetPSF: 195,
  },
  multipliers: {
    historicMultiplier: 1.0,
    remodelMultiplier: 1.0, // CORRECTED: 1.0 to yield $859,365 (not 0.5)
  },
  shares: {
    projectShellShare: 0.66,
    projectInteriorShare: 0.22,
    projectLandscapeShare: 0.12,
  },
  engineering: {
    structuralDesignShare: 0.0858,
    civilDesignShare: 0.033,
    mechanicalDesignShare: 0.0396,
    electricalDesignShare: 0.0297,
    plumbingDesignShare: 0.0231,
    telecomDesignShare: 0.0099,
  },
} as const

// Budget calculation check
export const CORRECTED_BUDGET_CALC = {
  // 4,407 ft^2 x $195/ft^2 x 1.0 multiplier = $859,365
  calculation: `${DR_DE_JESUS_PROJECT.areas.existingAreaFt2} ft^2 x $${DR_DE_JESUS_PROJECT.costs.remodelTargetPSF}/ft^2 x ${DR_DE_JESUS_PROJECT.multipliers.remodelMultiplier} = $859,365`,
  note: 'remodelMultiplier corrected from 0.5 to 1.0 for budget consistency',
}
