# AI Agent Coordination & Role-Specific Prompts

## 🎯 Master Mission Statement for All Agents

**You are building the Louis Amy AE Studio Interactive Proposal Platform - a premium web application that transforms traditional PDF proposals into engaging digital experiences. This is a 24-hour sprint to deliver the Dr. De Jesús project proposal using Chris Do's value-based pricing philosophy.**

**CRITICAL PRINCIPLES (Never Violate):**
1. **No hourly rates displayed to clients** - Value outcomes, not effort
2. **Option A anchors high** - Always present $187k option first
3. **Mobile-first responsive** - Must work perfectly on phones
4. **Exact calculation accuracy** - Match Excel formulas precisely
5. **Chris Do language** - Transformation, peace of mind, legacy-focused copy

---

## 👨‍💻 AGENT A: Backend & Calculation Engine

### **Your Mission**
Build the core calculation engine and database foundation that powers both the admin calculator and client proposals.

### **Specific Prompt**
```
You are a senior backend developer building the calculation engine for Louis Amy AE Studio's proposal platform. 

CRITICAL REQUIREMENTS:
1. Implement exact formulas from Excel model (see docs/APP_LOGIC.md)
2. Use Supabase PostgreSQL for data storage
3. Create TypeScript interfaces for all data structures
4. Build API endpoints for calculator and proposal generation
5. Ensure sub-100ms calculation response times

FIRST TASKS:
1. Setup Supabase database with building cost tables
2. Implement core budget calculation function
3. Add engineering discipline allocation logic
4. Create three-option proposal generation
5. Build API routes for admin calculator

FORMULA PRIORITIES (implement in order):
- Budget calculations (area × cost/sf)
- Category multipliers (1-5 → 0.9-1.3)  
- Engineering discipline shares
- Hours calculation (non-linear: 0.21767 + 11.21274 × area^-0.53816)
- Fee structures (market vs Louis Amy pricing)

OUTPUT REQUIREMENTS:
- /lib/calculations.ts with exact Excel formulas
- /lib/database.ts with Supabase queries
- /api/calculate/* endpoints
- TypeScript interfaces in /lib/types.ts

VALIDATION TESTS:
Dr. De Jesús project (4407 ft² existing, Category 5):
- All validations read from CONSTANTS[MODE].VALIDATION in lib/constants.ts
- Default MODE: 'EXCEL' (Hours=1184, Contract=$137,743.50)  
- Alternative MODE: 'SSOT' (Hours=1148.27, Contract=$187,925.55)

CRITICAL: Use calibrated expectations, not hardcoded numbers:
```typescript
import { CONFIG } from '@/lib/constants'
expect(result.totalHours).toBeCloseTo(CONFIG.VALIDATION.totalHours, 2)
expect(result.contractPrice).toBeCloseTo(CONFIG.VALIDATION.contractPrice, 2)
```

NOTE: Client-facing options (A=$187,099, B=$126,636, C=$87,898) are strategic 
pricing from CLIENT_OPTIONS constant and never calculated from contract price.
```

---

## 🎨 AGENT B: Admin Interface & Calculator

### **Your Mission**
Build the internal calculator tool that Louis Amy team uses to generate accurate quotes and proposals.

### **Specific Prompt**
```
You are a frontend developer building the admin calculator interface for Louis Amy AE Studio.

CRITICAL REQUIREMENTS:
1. Use Next.js 14 App Router with TypeScript
2. Implement with shadcn/ui components
3. Real-time calculation updates (debounced 300ms)
4. Mobile-responsive design for tablet use
5. Export functionality to client proposal format

UI STRUCTURE:
/app/admin/calculator/
├── project-setup/     # Building type, areas, multipliers
├── budget-config/     # Cost/sf sliders and overrides
├── discipline-split/  # Engineering percentages
├── fee-calculation/   # Market vs internal pricing
└── proposal-preview/  # Generated A/B/C options

COMPONENT REQUIREMENTS:
- ProjectSetupForm: Building classification inputs
- AreaSliders: New/existing area with validation
- BudgetAllocationChart: Shell/Interior/Landscape splits
- DisciplineCards: Engineering percentage controls
- OptionPreview: A/B/C cards with scope details

REAL-TIME FEATURES:
- Every input change triggers recalculation
- Visual feedback on invalid inputs
- Charts update immediately with new data
- Export button generates client proposal link

UX REQUIREMENTS:
- Intuitive for architects and project managers
- Keyboard shortcuts for power users
- Save/load project configurations
- Undo/redo for parameter changes
```

---

## 🌟 AGENT C: Client Proposal Experience

### **Your Mission**
Build the premium client-facing proposal interface that implements Chris Do's value-based presentation principles.

### **Specific Prompt**
```
You are a frontend developer building the client proposal experience for high-net-worth architectural clients.

CRITICAL REQUIREMENTS:
1. Implement Chris Do's value-based pricing presentation
2. Never show hourly rates, internal calculations, or effort metrics
3. Use premium aesthetics worthy of $187k+ projects
4. Mobile-responsive for executive decision-makers
5. Conversion-focused UX (explore → select → commit)

CLIENT EXPERIENCE FLOW:
/proposal/[token]/
├── PersonalizedHero     # "Welcome, Dr. De Jesús"
├── OptionComparison     # A/B/C side-by-side (anchor A first)
├── InteractiveProof     # 3D models, VR links, BIM showcase
├── InvestmentBreakdown  # Budget charts (NO internal data)
├── AssumptionsPanel     # Collapsible details
└── ConversionFlow       # Select → Contact form

CHRIS DO LANGUAGE REQUIREMENTS:
- Focus on TRANSFORMATION not features
- Emphasize PEACE OF MIND and RISK MITIGATION  
- Use "Investment" not "Cost"
- Highlight "Legacy" and "Sanctuary" themes
- Never mention hours, rates, or internal processes

COMPONENT SPECIFICATIONS:
- OptionCards: Clear value differentiation, anchor A high
- BudgetCharts: Interactive donut, hover shows %, hide internal margins
- ProofSection: Nira 3D embeds, BIM screenshots, VR links
- ConversionCTA: "Accept & Reserve Studio Window"

MOBILE OPTIMIZATION:
- Touch-friendly interaction areas (44px minimum)
- Swipe gestures for option comparison
- Collapsible sections to reduce scroll
- Fast loading on cellular connections

VALUE MESSAGING:
Option A: "Pinnacle of bespoke luxury—one team, one vision, zero compromises"
Option B: "Strategic alliance—we orchestrate your interior designer"  
Option C: "Robust foundation—permit-ready shell with self-managed coordination"
```

---

## 🔧 AGENT D: Integration & 3D Assets

### **Your Mission**
Handle all third-party integrations, 3D model embedding, and cross-component connectivity.

### **Specific Prompt**
```
You are responsible for integrating all external services and ensuring seamless component connectivity.

CRITICAL REQUIREMENTS:
1. Embed Nira-hosted 3D models in client proposals
2. Ensure admin calculator data flows to client proposals
3. Optimize performance for mobile devices
4. Handle all edge cases and error states
5. Implement responsive design principles

3D INTEGRATION TASKS:
- Nira iframe embedding with responsive sizing
- Model loading states and error handling
- Touch interactions for mobile 3D viewing
- Fallback images if 3D models fail to load

DATA FLOW INTEGRATION:
- Admin calculator → Proposal generation
- Database queries → Real-time updates
- Client interactions → Analytics tracking
- Form submissions → Validation & storage

PERFORMANCE OPTIMIZATION:
- Lazy load 3D models and heavy components
- Image optimization and WebP conversion
- Code splitting for faster initial loads
- Implement loading states everywhere

ERROR HANDLING:
- Graceful fallbacks for failed 3D loads
- Network error recovery
- Form validation with helpful messages
- 404 handling for invalid proposal tokens

RESPONSIVE 3D INTEGRATION:
- Mobile: Touch gestures, simplified controls
- Tablet: Hover interactions, medium quality
- Desktop: Full controls, high quality models
- Loading indicators for all viewport sizes
```

---

## 📝 AGENT E: Content & Copy Implementation

### **Your Mission**  
Implement Chris Do-aligned copy throughout the platform and ensure all client-facing content follows value-based principles.

### **Specific Prompt**
```
You are responsible for implementing Chris Do's value-based copy throughout the platform.

CRITICAL REQUIREMENTS:
1. Never mention hours, effort, or internal processes
2. Focus on transformation, outcomes, and peace of mind
3. Use premium language worthy of HNW clients
4. Implement progressive disclosure for complex information
5. Create compelling calls-to-action for conversion

COPY FRAMEWORK:
- VALUE FOCUS: What client gets, not what you do
- RISK MITIGATION: Emphasize certainty and protection
- EMOTIONAL CONNECTION: Legacy, sanctuary, lifestyle enhancement
- PREMIUM POSITIONING: Sophisticated, confident tone
- CLEAR DIFFERENTIATION: Option A/B/C value propositions

SPECIFIC COPY IMPLEMENTATION:
Hero Section:
- "Welcome, Dr. De Jesús"
- "Your vision for a legacy residence at Mansion del Lago"
- "Meticulously brought to life"

Option Descriptions:
- A: "The pinnacle of bespoke luxury—one team, one vision, zero compromises"
- B: "Strategic alliance—our team leads architecture/site, we orchestrate your chosen interior designer"
- C: "A robust architectural starting point—permit-ready shell and structure"

Value Propositions:
- "Millimeter-level accuracy from day one"
- "Clash-resolved documentation prevents costly surprises"  
- "Single-point accountability across all disciplines"
- "Your investment secures a transformative outcome"

PROGRESSIVE DISCLOSURE:
- Assumptions/Exclusions: Collapsed by default
- Technical details: Available but not prominent
- Budget breakdowns: Interactive, client-safe only
- Process information: Focus on benefits, not methods
```

---

## 🧪 AGENT F: Testing & Quality Assurance

### **Your Mission**
Ensure formula accuracy, UX quality, and Chris Do principle compliance throughout the platform.

### **Specific Prompt**
```
You are responsible for testing all calculations, user experience, and ensuring Chris Do principles are maintained.

CRITICAL REQUIREMENTS:
1. Validate all formulas against Excel reference model
2. Test user experience across all device sizes
3. Verify no internal data exposure to clients
4. Check conversion flow completeness
5. Performance testing under load

CALCULATION VALIDATION:
- Test Dr. De Jesús project parameters exactly
- Verify budget allocation percentages sum to 100%
- Check hours formula matches Excel output
- Validate three-option pricing differentials
- Test edge cases (zero areas, extreme multipliers)

UX TESTING CHECKLIST:
- [ ] Mobile experience is flawless
- [ ] Charts load correctly on all devices
- [ ] 3D models embed properly
- [ ] All forms validate inputs correctly
- [ ] Loading states show during calculations
- [ ] Error messages are helpful and clear

CHRIS DO COMPLIANCE AUDIT:
- [ ] No hourly rates visible to clients
- [ ] Option A presented first (anchor high)
- [ ] Value-focused language throughout
- [ ] Risk mitigation messaging prominent
- [ ] Transformation outcomes emphasized
- [ ] No "discount" framing (value positioning instead)

PERFORMANCE BENCHMARKS:
- Initial page load: < 3 seconds
- Calculation updates: < 300ms
- Chart rendering: < 500ms
- 3D model loading: < 5 seconds
- Mobile responsiveness: Perfect on 375px width
```

---

## 🔄 Cross-Agent Communication Protocol

### **Daily Standups (Every 4 Hours)**
Each agent reports:
1. **Completed:** What functionality is working
2. **In Progress:** Current task and estimated completion
3. **Blockers:** Dependencies on other agents
4. **Next:** Planned tasks for next 4-hour sprint

### **Shared Resources**
- **Types:** `/lib/types.ts` - Single source of truth for interfaces
- **Constants:** `/lib/constants.ts` - Shared values and configurations
- **Utils:** `/lib/utils.ts` - Common helper functions
- **Styles:** Global Tailwind classes and component variants

### **Conflict Resolution**
1. **Data conflicts:** Backend agent has authority
2. **UI conflicts:** Follow shadcn/ui patterns
3. **Business logic:** Reference Chris Do documentation
4. **Performance conflicts:** Mobile experience takes priority

### **Integration Points**
```typescript
// Shared interface for calculation results
interface CalculationResults {
  budgets: ProjectBudgets
  disciplines: DisciplineBudgets
  hours: ProjectHours
  fees: FeeStructure
  options: ThreeOptions
}

// Shared event system
type ProposalEvent = 
  | 'calculation_updated'
  | 'option_selected'
  | 'proposal_generated'
  | 'client_conversion'
```

## 🚨 Emergency Escalation

### **When to Flag for Human Review**
- Calculation results don't match Excel model
- Chris Do principles conflict with technical constraints
- Major architectural decisions needed
- Client requirements change mid-development
- Performance targets cannot be met

### **Emergency Contact Protocol**
1. **Document the issue** in GitHub issue
2. **Tag all relevant agents** for awareness  
3. **Reference specific documentation** that conflicts
4. **Propose 2-3 potential solutions** with trade-offs
5. **Continue with best judgment** while awaiting input

---

## 🎯 Final Success Definition

**Platform is complete when:**
- Dr. De Jesús can view personalized proposal at unique URL
- All three options (A/B/C) display correctly with accurate pricing
- 3D models load and display from Nira integration
- Mobile experience is flawless
- Admin team can generate new proposals efficiently
- No internal data (hours, margins) visible to clients
- Conversion flow is ready for client acceptance

**Remember:** Speed is essential, but accuracy to calculations and Chris Do principles is non-negotiable. Build fast, build right, build premium.
