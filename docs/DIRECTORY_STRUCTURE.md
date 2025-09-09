# Project Directory Structure & File Organization

## 📁 Complete File Structure

```
louis-amy-proposal/
├── README.md                                    # Project overview and quick start
├── QUICK_START.md                              # 24-hour development guide
├── project-config.json                         # Configuration and validation data
├── package.json                                # Dependencies and scripts
├── tailwind.config.js                         # Tailwind CSS configuration
├── next.config.js                             # Next.js configuration
├── tsconfig.json                              # TypeScript configuration
├── .env.local                                  # Environment variables (not committed)
├── .env.example                               # Environment template
│
├── docs/                                      # 📖 DOCUMENTATION
│   ├── DEVELOPMENT_STRATEGY.md                # Overall development approach
│   ├── APP_LOGIC.md                          # Calculation formulas and business logic
│   ├── TECH_STACK.md                         # Technology specifications
│   ├── AI_AGENT_PROMPTS.md                   # Role-specific agent instructions
│   ├── AI_AGENT_MASTER_PROMPT.md             # Master coordination prompt
│   ├── REFERENCE_LEGEND.md                   # Guide to reference documents
│   ├── DESIGN_GUIDELINES.md                  # Visual standards and UI patterns
│   ├── REQUIREMENTS.md                       # System requirements and acceptance criteria
│   └── DIRECTORY_STRUCTURE.md                # This file
│
├── app/                                       # 🌐 NEXT.JS APP ROUTER
│   ├── layout.tsx                            # Root layout with providers
│   ├── page.tsx                              # Landing page (redirect to admin)
│   ├── globals.css                           # Global styles and CSS variables
│   │
│   ├── admin/                                # 🔧 INTERNAL CALCULATOR TOOL
│   │   ├── layout.tsx                        # Admin layout with navigation
│   │   ├── page.tsx                          # Admin dashboard overview
│   │   └── calculator/
│   │       ├── page.tsx                      # Main calculator interface
│   │       ├── project-setup/
│   │       │   └── page.tsx                  # Building classification inputs
│   │       ├── budget-config/
│   │       │   └── page.tsx                  # Cost/sf sliders and overrides
│   │       ├── discipline-split/
│   │       │   └── page.tsx                  # Engineering percentages
│   │       ├── fee-calculation/
│   │       │   └── page.tsx                  # Market vs internal pricing
│   │       └── proposal-preview/
│   │           └── page.tsx                  # A/B/C options preview
│   │
│   ├── proposal/                             # 🌟 CLIENT-FACING PROPOSALS
│   │   └── [token]/
│   │       ├── page.tsx                      # Main proposal view
│   │       ├── option-details/
│   │       │   └── [option]/page.tsx         # Detailed option view
│   │       └── components/
│   │           ├── Hero.tsx                  # Personalized welcome
│   │           ├── OptionComparison.tsx      # A/B/C side-by-side
│   │           ├── BudgetVisualization.tsx   # Interactive charts
│   │           ├── ProofOfPrecision.tsx      # 3D models, VR, BIM
│   │           ├── InvestmentBreakdown.tsx   # Budget allocation
│   │           ├── AssumptionsPanel.tsx      # Collapsible details
│   │           └── ConversionFlow.tsx        # Select → Contact
│   │
│   └── api/                                  # 🔌 API ENDPOINTS
│       ├── calculate/
│       │   └── route.ts                      # Core calculation API
│       ├── proposals/
│       │   ├── route.ts                      # CRUD operations
│       │   └── [id]/route.ts                 # Individual proposal API
│       ├── building-types/
│       │   └── route.ts                      # Building classification data
│       └── health/
│           └── route.ts                      # Health check endpoint
│
├── components/                               # 🎨 REUSABLE COMPONENTS
│   ├── ui/                                  # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   ├── dialog.tsx
│   │   ├── collapsible.tsx
│   │   └── slider.tsx
│   │
│   ├── admin/                               # 🔧 Admin-specific components
│   │   ├── ProjectSetupForm.tsx             # Building type/area inputs
│   │   ├── CostRangeSliders.tsx             # Cost per sq ft controls
│   │   ├── BudgetAllocationCard.tsx         # Shell/Interior/Landscape
│   │   ├── DisciplineCards.tsx              # Engineering toggles
│   │   ├── CalculationDisplay.tsx           # Real-time results
│   │   ├── HoursBreakdown.tsx               # Hours by phase/role
│   │   ├── FeeComparison.tsx                # Market vs Louis Amy
│   │   └── ProposalExport.tsx               # Generate client proposal
│   │
│   ├── client/                              # 🌟 Client-facing components
│   │   ├── PersonalizedHero.tsx             # Welcome message
│   │   ├── OptionCard.tsx                   # Individual option display
│   │   ├── OptionComparison.tsx             # A/B/C side-by-side
│   │   ├── FeatureMatrix.tsx                # What's included/excluded
│   │   ├── BudgetDonut.tsx                  # Interactive budget chart
│   │   ├── InvestmentSummary.tsx            # Financial overview
│   │   ├── ProofGallery.tsx                 # 3D models, renders, BIM
│   │   ├── ValueProposition.tsx             # Benefits and outcomes
│   │   ├── AssumptionsCollapsible.tsx       # Detailed assumptions
│   │   ├── ConversionCTA.tsx                # Accept & schedule buttons
│   │   └── ProposalFooter.tsx               # Branding and validity
│   │
│   ├── charts/                              # 📊 Data visualization
│   │   ├── BudgetAllocationChart.tsx        # Donut chart with hover
│   │   ├── DisciplineBreakdown.tsx          # Engineering allocation
│   │   ├── OptionComparisonChart.tsx        # Bar chart A/B/C
│   │   ├── CostRangeVisualization.tsx       # Min/target/max display
│   │   └── PhaseTimeline.tsx                # Project phase timeline
│   │
│   ├── shared/                              # 🔗 Cross-system components
│   │   ├── NiraViewer.tsx                   # 3D model iframe embed
│   │   ├── ModelGallery.tsx                 # Multiple model display
│   │   ├── LoadingStates.tsx                # Skeleton and spinner components
│   │   ├── ErrorBoundary.tsx                # Error handling wrapper
│   │   └── ResponsiveImage.tsx              # Optimized image component
│   │
│   └── layout/                              # 🏗 Layout components
│       ├── AdminHeader.tsx                  # Internal tool navigation
│       ├── ClientHeader.tsx                 # Proposal page header
│       ├── AdminSidebar.tsx                 # Calculator navigation
│       ├── MobileNavigation.tsx             # Mobile menu system
│       └── Footer.tsx                       # Branding and links
│
├── lib/                                     # 🧮 BUSINESS LOGIC
│   ├── types.ts                            # All TypeScript interfaces
│   ├── constants.ts                        # Fixed values and mappings
│   ├── calculations.ts                     # Core calculation engine
│   ├── database.ts                         # Supabase client and queries
│   ├── optionGenerator.ts                  # Three-option proposal logic
│   ├── validation.ts                       # Input validation schemas
│   ├── utils.ts                            # Helper functions
│   └── hooks/                              # Custom React hooks
│       ├── useCalculations.ts              # Real-time calculation hook
│       ├── useProposal.ts                  # Proposal data management
│       └── useResponsive.ts                # Responsive design hook
│
├── data/                                   # 📊 REFERENCE DATA
│   ├── building-types.json                # Building classification lookup
│   ├── cost-ranges.json                   # Cost per sq ft database
│   ├── multipliers.json                   # Category and remodel factors
│   ├── discipline-shares.json             # Engineering percentages
│   ├── copy-content.json                  # Chris Do-aligned copy
│   └── dr-de-jesus-project.json           # Pilot project configuration
│
├── public/                                 # 🖼 STATIC ASSETS
│   ├── images/
│   │   ├── logo-louis-amy.svg             # Brand logo
│   │   ├── casa-vista-exterior.jpg        # Project renderings
│   │   ├── casa-vista-interior.jpg
│   │   ├── site-plan.jpg
│   │   └── team-photo.jpg
│   ├── models/                            # 3D model files (if local)
│   │   ├── casa-vista-exterior.glb
│   │   └── site-context.glb
│   ├── icons/
│   │   ├── favicon.ico
│   │   ├── apple-touch-icon.png
│   │   └── android-chrome-512x512.png
│   └── documents/
│       └── sample-proposal.pdf            # Reference format
│
├── styles/                                # 🎨 STYLING
│   ├── globals.css                        # Global styles and CSS variables
│   ├── admin.css                          # Admin-specific styles
│   ├── client.css                         # Client-specific styles
│   └── charts.css                         # Chart customization
│
├── tests/                                 # 🧪 TESTING
│   ├── calculations.test.ts               # Formula accuracy tests
│   ├── components.test.tsx                # Component unit tests
│   ├── api.test.ts                        # API endpoint tests
│   └── integration.test.ts                # End-to-end tests
│
└── scripts/                               # 🛠 UTILITIES
    ├── setup-database.ts                 # Database schema setup
    ├── seed-data.ts                       # Import cost data
    ├── generate-proposal.ts              # CLI proposal generation
    └── validate-formulas.ts              # Formula accuracy checker
```

---

## 🎯 File Naming Conventions

### **Components**
- **PascalCase:** `OptionComparison.tsx`, `BudgetAllocationCard.tsx`
- **Descriptive:** Name indicates purpose and context
- **Consistent suffixes:** `Card`, `Form`, `Chart`, `Modal`, `Panel`

### **Utilities & Logic**
- **camelCase:** `calculations.ts`, `optionGenerator.ts`
- **Specific purpose:** Each file has single responsibility
- **Clear exports:** Named exports preferred over default

### **API Routes**
- **kebab-case:** `/api/building-types`, `/api/calculate`
- **RESTful:** GET, POST, PUT, DELETE for CRUD operations
- **Versioned:** `/api/v1/` prefix if versioning needed

## 📋 File Responsibility Matrix

### **Backend Agent Files**
```
✅ lib/calculations.ts              # Core calculation engine
✅ lib/database.ts                  # Supabase queries
✅ lib/types.ts                     # TypeScript interfaces
✅ app/api/calculate/route.ts       # Calculation API
✅ app/api/proposals/route.ts       # Proposal CRUD API
✅ scripts/setup-database.ts       # Database schema
✅ data/*.json                      # Reference data files
```

### **Admin Interface Agent Files**
```
✅ app/admin/calculator/page.tsx    # Main calculator
✅ components/admin/*               # All admin components
✅ lib/hooks/useCalculations.ts     # Calculation state hook
✅ styles/admin.css                 # Admin-specific styles
```

### **Client Experience Agent Files**
```
✅ app/proposal/[token]/page.tsx    # Main proposal view
✅ components/client/*              # All client components
✅ data/copy-content.json           # Chris Do-aligned copy
✅ styles/client.css                # Client-specific styles
```

### **Integration Agent Files**
```
✅ components/shared/NiraViewer.tsx # 3D model integration
✅ components/charts/*              # Data visualization
✅ lib/utils.ts                     # Helper functions
✅ components/layout/*              # Layout components
```

### **Content Agent Files**
```
✅ data/copy-content.json           # All client-facing copy
✅ components/client/ValueProp.tsx  # Value messaging
✅ components/client/ConversionCTA.tsx # Call-to-action text
✅ public/images/*                  # Image assets and optimization
```

### **QA Agent Files**
```
✅ tests/*                         # All test files
✅ scripts/validate-formulas.ts    # Formula accuracy checker
✅ docs/TESTING_CHECKLIST.md       # QA procedures (to create)
```

---

## 🔄 Data Flow Between Files

### **Calculation Pipeline**
```
Input Forms → lib/validation.ts → lib/calculations.ts → Database Storage → Client Display
     ↑              ↓                     ↓                   ↓            ↓
Project Setup   Validation         Core Engine        Supabase      Proposal UI
```

### **Component Dependency Map**
```
AdminCalculator.tsx
├── ProjectSetupForm.tsx → lib/types.ts
├── BudgetAllocation.tsx → lib/calculations.ts
├── DisciplineCards.tsx → lib/database.ts
└── ProposalExport.tsx → ClientProposal.tsx

ClientProposal.tsx
├── Hero.tsx → data/copy-content.json
├── OptionComparison.tsx → lib/calculations.ts
├── BudgetCharts.tsx → components/charts/*
└── NiraViewer.tsx → components/shared/*
```

## 🎨 Asset Organization

### **Images**
```
public/images/
├── brand/
│   ├── logo-louis-amy.svg         # Primary logo
│   ├── logo-mark.svg              # Icon version
│   └── wordmark.svg               # Text-only version
├── projects/
│   ├── casa-vista/
│   │   ├── exterior-render.jpg    # Hero image
│   │   ├── interior-living.jpg    # Interior showcase
│   │   ├── site-aerial.jpg        # Context view
│   │   └── materials-board.jpg    # Finishes reference
│   └── portfolio/
│       ├── project-1.jpg
│       └── project-2.jpg
└── ui/
    ├── placeholder-chart.svg      # Chart loading state
    ├── no-3d-fallback.jpg        # 3D model fallback
    └── icons/                     # Custom icons if needed
```

### **3D Models**
```
public/models/              # Local storage (backup)
├── casa-vista-exterior.glb # Main building model
├── site-context.glb        # Site and landscape
└── interior-layout.glb     # Interior space (if available)

External (Nira):           # Primary hosting
├── Casa Vista Exterior    # Nira model ID: [to be provided]
├── Interior Walkthrough   # Nira model ID: [to be provided]
└── Site Master Plan       # Nira model ID: [to be provided]
```

## 📝 Configuration Files

### **Environment Variables**
```bash
# .env.local (local development)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_local_service_key

# Production values (Vercel environment)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=production_anon_key
SUPABASE_SERVICE_ROLE_KEY=production_service_key

# Optional future integrations
STRIPE_SECRET_KEY=sk_test_...
DOCUSIGN_INTEGRATION_KEY=docusign_key
NIRA_API_KEY=nira_api_key
```

### **Database Configuration**
```sql
-- Supabase SQL Editor
-- Import schema from docs/TECH_STACK.md
-- Seed with data from References/Custom_Residential_CostS_DB_CLEAN_v3.csv
```

### **Tailwind Configuration**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#2B59FF',
        success: '#00C896', 
        accent: '#FF6B35',
        // Louis Amy brand colors
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
```

## 🚀 Development Workflow

### **Agent Coordination**
1. **Clone repository** and create feature branch
2. **Review assigned files** in responsibility matrix
3. **Read role-specific prompt** in `/docs/AI_AGENT_PROMPTS.md`
4. **Implement assigned components** following standards
5. **Test integration** with other agents' work
6. **Commit with standard message** format
7. **Report progress** every 4 hours

### **Integration Points**
- **All agents:** Use shared types from `/lib/types.ts`
- **Backend ↔ Admin:** API calls from admin forms to calculation engine
- **Admin ↔ Client:** Data export from calculator to proposal generation
- **Integration ↔ All:** 3D models and charts used across components

### **Quality Gates**
- **Code review:** TypeScript compilation must pass
- **Testing:** Unit tests for calculations must pass
- **UX review:** Mobile responsive test required
- **Performance:** Load time benchmarks must be met

---

## 🎯 Success Checkpoints by File Completion

### **4-Hour Checkpoint**
```
✅ lib/types.ts              # All interfaces defined
✅ lib/constants.ts          # Fixed values and mappings
✅ lib/calculations.ts       # Core formulas working
✅ app/api/calculate/route.ts # Basic API endpoint
```

### **8-Hour Checkpoint**  
```
✅ components/admin/ProjectSetupForm.tsx    # Input forms
✅ components/admin/CalculationDisplay.tsx  # Results display
✅ app/admin/calculator/page.tsx            # Calculator page
✅ lib/database.ts                          # Database queries
```

### **16-Hour Checkpoint**
```
✅ app/proposal/[token]/page.tsx            # Client proposal
✅ components/client/OptionComparison.tsx   # A/B/C display
✅ components/charts/BudgetAllocationChart.tsx # Interactive charts
✅ components/shared/NiraViewer.tsx         # 3D integration
```

### **24-Hour Checkpoint (COMPLETE)**
```
✅ Dr. De Jesús proposal fully functional
✅ Admin calculator generates accurate quotes
✅ Mobile responsive design verified
✅ 3D models integrated and loading
✅ All calculations validated against Excel
✅ Chris Do principles implemented throughout
```

---

## 🔧 File Dependencies & Load Order

### **Critical Load Path**
1. **types.ts** → All other files depend on interfaces
2. **constants.ts** → Calculation functions need fixed values
3. **calculations.ts** → UI components need calculation results  
4. **database.ts** → API routes need data access
5. **UI components** → Pages assemble components into views

### **Parallel Development Safe**
- Admin components and Client components (independent)
- Chart components and Layout components (independent)
- API routes and UI components (connected via types only)
- Testing files (depend on implementation completion)

---

**🎯 AGENT ACTIVATION SEQUENCE:**

1. **Backend Agent:** Start immediately with database and calculations
2. **Admin Agent:** Begin after types.ts and constants.ts complete  
3. **Client Agent:** Start after calculation engine working
4. **Integration Agent:** Begin after basic components exist
5. **Content Agent:** Parallel with Client Agent using copy references
6. **QA Agent:** Continuous testing as components complete

**The 24-hour countdown starts NOW. Build premium, build fast, build right.**
