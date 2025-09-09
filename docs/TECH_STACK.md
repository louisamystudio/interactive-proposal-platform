# Technical Stack & Implementation Guide

## 🚀 Chosen Technology Stack

### **Frontend Framework**
```bash
# Next.js 14 with App Router (optimal for speed)
npx create-next-app@latest . --typescript --tailwind --eslint --app
```

**Why Next.js 14:**
- **SSR + Client components:** Best of both worlds
- **File-based routing:** `/proposal/[token]/page.tsx` automatic
- **API routes:** Backend logic co-located
- **Vercel deployment:** Push to deploy in 30 seconds
- **Image optimization:** Automatic WebP conversion
- **TypeScript native:** Better DX and fewer bugs

### **UI Component Library**
```bash
# shadcn/ui (most productive choice for 24 hours)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input select tabs dialog
npx shadcn-ui@latest add collapsible sheet slider progress
```

**shadcn/ui Advantages:**
- **Copy-paste components:** No external dependencies
- **Radix UI primitives:** Accessibility built-in
- **Tailwind-based:** Consistent with our CSS approach
- **Customizable:** Easy to match Louis Amy brand
- **Production ready:** Used by thousands of apps

### **Data Visualization**
```bash
npm install recharts lucide-react
```

**Recharts Benefits:**
- **React-native:** No DOM manipulation complexity
- **Responsive by default:** Works on mobile automatically
- **Rich tooltips:** Perfect for budget hover interactions
- **Composable:** Mix charts easily
- **Lightweight:** 45kb gzipped

### **Database & Backend**
```bash
npm install @supabase/supabase-js
```

**Supabase Features:**
- **PostgreSQL:** Full SQL power with relationships
- **Instant API:** Auto-generated REST and GraphQL
- **Real-time:** Live updates across clients
- **Auth built-in:** Magic links, row-level security
- **Storage:** For 3D models and images
- **Edge functions:** Serverless compute

## 🗂 Database Schema Design

### **Core Tables**
```sql
-- Building cost reference data
CREATE TABLE building_cost_data (
  id SERIAL PRIMARY KEY,
  building_use TEXT NOT NULL,
  building_type TEXT NOT NULL, 
  building_tier TEXT NOT NULL,
  category INTEGER NOT NULL,
  
  -- Cost per square foot ranges
  shell_new_min DECIMAL(8,2),
  shell_new_target DECIMAL(8,2),
  shell_new_max DECIMAL(8,2),
  shell_remodel_min DECIMAL(8,2),
  shell_remodel_target DECIMAL(8,2),
  shell_remodel_max DECIMAL(8,2),
  interior_new_min DECIMAL(8,2),
  interior_new_target DECIMAL(8,2),
  interior_new_max DECIMAL(8,2),
  
  -- Budget distribution percentages
  project_shell_share DECIMAL(4,3),
  project_interior_share DECIMAL(4,3),
  project_landscape_share DECIMAL(4,3),
  
  -- Engineering discipline shares
  architectural_design_share DECIMAL(5,4),
  structural_design_share DECIMAL(5,4),
  civil_design_share DECIMAL(5,4),
  mechanical_design_share DECIMAL(5,4),
  electrical_design_share DECIMAL(5,4),
  plumbing_design_share DECIMAL(5,4),
  telecom_design_share DECIMAL(5,4),
  
  UNIQUE(building_use, building_type, building_tier, category)
);

-- Category multipliers lookup
CREATE TABLE category_multipliers (
  category INTEGER PRIMARY KEY,
  multiplier DECIMAL(3,2) NOT NULL,
  description TEXT
);

-- Proposal management
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'base64url'),
  
  -- Client information
  client_name TEXT NOT NULL,
  client_email TEXT,
  project_name TEXT NOT NULL,
  location TEXT NOT NULL,
  
  -- Project parameters
  building_use TEXT NOT NULL,
  building_type TEXT NOT NULL,
  building_tier TEXT NOT NULL,
  category INTEGER NOT NULL,
  new_area_ft2 DECIMAL(8,2) NOT NULL,
  existing_area_ft2 DECIMAL(8,2) NOT NULL,
  site_area_m2 DECIMAL(8,2),
  historic_multiplier DECIMAL(3,2) DEFAULT 1.0,
  remodel_multiplier DECIMAL(3,2) DEFAULT 0.5,
  
  -- Calculated results (JSON for flexibility)
  budgets JSONB NOT NULL,
  disciplines JSONB NOT NULL,
  hours JSONB NOT NULL,
  fees JSONB NOT NULL,
  options JSONB NOT NULL,
  
  -- Proposal management
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  accepted_option TEXT CHECK (accepted_option IN ('A', 'B', 'C'))
);

-- Client interaction tracking
CREATE TABLE proposal_events (
  id SERIAL PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id),
  event_type TEXT NOT NULL, -- 'opened', 'option_viewed', 'detail_expanded', 'accepted'
  event_data JSONB,
  client_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🏗 Project Structure

### **Recommended File Organization**
```
louis-amy-proposal/
├── README.md
├── docs/                   # This documentation
├── app/                    # Next.js App Router
│   ├── admin/             # Internal calculator tool
│   │   └── calculator/
│   │       ├── page.tsx           # Main calculator interface
│   │       ├── components/        # Calculator-specific components
│   │       └── data/              # Cost data management
│   ├── proposal/          # Client-facing proposals
│   │   └── [token]/
│   │       ├── page.tsx           # Main proposal view
│   │       ├── components/        # Proposal-specific components
│   │       └── assets/            # 3D models, images
│   ├── api/               # Backend API routes
│   │   ├── calculate/             # Calculation endpoints
│   │   ├── proposals/             # Proposal CRUD
│   │   └── assets/                # Static file serving
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/                # shadcn/ui components
│   ├── charts/            # Data visualization components
│   ├── forms/             # Form components
│   └── layout/            # Layout components
├── lib/                   # Core business logic
│   ├── calculations.ts    # Main calculation engine
│   ├── database.ts        # Supabase client and queries
│   ├── types.ts           # TypeScript interfaces
│   ├── constants.ts       # Fixed values and mappings
│   └── utils.ts           # Helper functions
├── data/                  # Static reference data
│   ├── building-types.json
│   ├── cost-ranges.json
│   └── copy-content.json
└── public/                # Static assets
    ├── images/
    ├── models/            # 3D model files (if local)
    └── icons/
```

## 🔧 Essential Package Configuration

### **package.json dependencies**
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    
    "tailwindcss": "^3.3.0",
    "@tailwindcss/forms": "^0.5.0",
    "@tailwindcss/typography": "^0.5.0",
    
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-collapsible": "^1.0.0",
    "@radix-ui/react-slider": "^1.0.0",
    
    "recharts": "^2.8.0",
    "lucide-react": "^0.290.0",
    "clsx": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    
    "@supabase/supabase-js": "^2.38.0",
    "zod": "^3.22.0",
    
    "@google/model-viewer": "^3.3.0",
    "framer-motion": "^10.16.0"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "@types/three": "^0.158.0"
  }
}
```

### **Environment Variables**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional integrations
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
DOCUSIGN_INTEGRATION_KEY=your_docusign_key
NIRA_API_KEY=your_nira_key (if needed for embedding)
```

## 🎨 Component Architecture

### **Atomic Design Structure**
```typescript
// Component hierarchy
components/
├── ui/                    # Atomic (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── charts/                # Molecules
│   ├── BudgetDonut.tsx
│   ├── DisciplineChart.tsx
│   └── OptionComparison.tsx
├── forms/                 # Organisms
│   ├── ProjectSetupForm.tsx
│   ├── BudgetAllocation.tsx
│   └── ClientInfoForm.tsx
└── layout/                # Templates
    ├── AdminLayout.tsx
    ├── ProposalLayout.tsx
    └── Header.tsx
```

### **Key Component Specifications**

**BudgetDonut Component:**
```typescript
interface BudgetDonutProps {
  data: {
    shell: number
    interior: number  
    landscape: number
  }
  showValues?: boolean // Hide $ amounts for client view
  interactive?: boolean // Enable hover tooltips
}
```

**OptionCard Component:**
```typescript
interface OptionCardProps {
  option: 'A' | 'B' | 'C'
  investment: number
  title: string
  description: string
  included: string[]
  excluded: string[]
  idealWhen: string
  onSelect: () => void
}
```

## 🔌 Third-Party Integrations

### **3D Model Integration (Nira)**
```typescript
// Nira iframe embedding
const NiraViewer = ({ modelId, className }: {
  modelId: string
  className?: string
}) => (
  <iframe 
    src={`https://nira.app/embed/${modelId}`}
    className={cn("w-full h-96 rounded-lg", className)}
    frameBorder="0"
    allowFullScreen
  />
)
```

### **Data Visualization (Recharts)**
```typescript
// Interactive donut with hover
const InteractiveBudgetChart = ({ data }: { data: BudgetData[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie 
        data={data}
        dataKey="value"
        nameKey="category"
        innerRadius={60}
        outerRadius={90}
        startAngle={90}
        endAngle={-270}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip 
        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Budget']}
      />
    </PieChart>
  </ResponsiveContainer>
)
```

## 🚀 Deployment & Hosting

### **Vercel Deployment (Recommended)**
```bash
# Deploy to Vercel (instant)
npm install -g vercel
vercel --prod

# Auto-deploy on git push
vercel --prod --confirm
```

**Vercel Advantages:**
- **Zero-config deployment:** Just push to GitHub
- **Edge functions:** Fast API responses globally  
- **Image optimization:** Automatic WebP/AVIF
- **CDN:** Global asset distribution
- **Analytics:** Built-in performance monitoring
- **Free tier:** Perfect for pilot project

### **Alternative: Railway/Render**
```bash
# Railway (good database + app hosting)
npm install -g @railway/cli
railway deploy

# Render (simple alternative)
# Just connect GitHub repo, auto-deploy
```

## 📱 Responsive Design Strategy

### **Breakpoint System**
```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */  
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Ultra-wide */
```

### **Mobile-First Components**
```typescript
// Responsive grid system
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards stack on mobile, grid on desktop */}
</div>

// Mobile navigation
<div className="block md:hidden">
  {/* Mobile menu */}
</div>
<div className="hidden md:block">
  {/* Desktop navigation */}
</div>
```

## 🔒 Security & Performance

### **Security Measures**
```typescript
// Proposal token security
const generateSecureToken = () => {
  return crypto.randomBytes(32).toString('base64url')
}

// Row-level security (Supabase)
CREATE POLICY "Proposals are viewable by token" ON proposals 
  FOR SELECT USING (token = current_setting('request.jwt.token'));
```

### **Performance Optimization**
```typescript
// Image optimization
import Image from 'next/image'

<Image 
  src="/casa-vista-render.jpg"
  width={800} 
  height={600}
  alt="Casa Vista Exterior Render"
  priority // Above-the-fold images
/>

// Dynamic imports for heavy components
const BudgetChartComponent = dynamic(
  () => import('../components/charts/BudgetChart'),
  { ssr: false } // Client-side only for charts
)
```

## 🔄 Development Workflow

### **Git Workflow**
```bash
# Branch strategy for simultaneous agents
main                    # Production-ready code
├── feature/admin-calc  # Admin calculator development
├── feature/client-ui   # Client proposal interface  
├── feature/integration # 3D models and APIs
└── feature/testing     # Validation and QA
```

### **Code Quality Gates**
```bash
# Pre-commit checks
npm run lint          # ESLint validation
npm run type-check    # TypeScript compilation
npm run test          # Formula validation tests
npm run build         # Production build test
```

## 📊 Monitoring & Analytics

### **Built-in Analytics**
```typescript
// Vercel Analytics (automatic)
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout() {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### **Custom Event Tracking**
```typescript
// Proposal interaction tracking
const trackEvent = (eventName: string, properties: object) => {
  // Store in Supabase for analysis
  supabase
    .from('proposal_events')
    .insert({
      proposal_id: proposalId,
      event_type: eventName,
      event_data: properties
    })
}

// Usage throughout app
trackEvent('option_viewed', { option: 'A', duration: 45 })
trackEvent('proposal_accepted', { option: 'B', decision_time: '24h' })
```

## 🧪 Testing Strategy

### **Critical Test Cases**
```typescript
// Formula accuracy tests
describe('Louis Amy Calculations', () => {
  test('Dr. De Jesús project calculation accuracy', () => {
    const input = {
      buildingType: 'Custom Houses',
      category: 5,
      newArea: 0,
      existingArea: 4407,
      siteArea: 972,
      historicMultiplier: 1.0,
      remodelMultiplier: 1.0  // CORRECTED: 1.0 to yield $859,365 total budget
    }
    
    const results = calculateProject(input)
    
    // Verify against calibrated model (reads from constants)
    import { CONFIG } from '@/lib/constants'
    
    expect(results.totalBudget).toBeCloseTo(CONFIG.VALIDATION.totalBudget, 0)
    expect(results.contractPrice).toBeCloseTo(CONFIG.VALIDATION.contractPrice, 2)
    expect(results.totalHours).toBeCloseTo(CONFIG.VALIDATION.totalHours, 2)
  })
  
  test('Three-option generation', () => {
    const options = generateThreeOptions(results)
    
    expect(options.A.investment).toBe(187099)
    expect(options.B.investment).toBe(126636)  
    expect(options.C.investment).toBe(87898)
  })
})
```

## 🔄 AI Agent Handoff Protocol

### **Development Readiness Checklist**
Before starting development, ensure:
- [ ] Repository cloned and dependencies installed
- [ ] Supabase database created and migrated
- [ ] Environment variables configured
- [ ] Reference documents reviewed
- [ ] Chris Do principles understood
- [ ] Calculation formulas validated

### **Component Development Standards**
```typescript
// All components must follow this pattern
interface ComponentProps {
  // Props interface required
}

export function ComponentName({ ...props }: ComponentProps) {
  // Implementation
  return (
    <div className="responsive-classes">
      {/* Component content */}
    </div>
  )
}

// Export with display name for debugging
ComponentName.displayName = 'ComponentName'
```

### **Commit Message Standards**
```bash
# Format: type(scope): description
feat(admin): add budget calculation engine
fix(client): resolve mobile chart rendering
docs(readme): update setup instructions
test(calc): add formula validation tests
```

## 🚀 Production Deployment Checklist

### **Pre-Deployment Requirements**
- [ ] All tests passing
- [ ] Mobile responsiveness verified
- [ ] 3D models loading correctly
- [ ] No console errors
- [ ] Performance < 3 second load time
- [ ] Chris Do principles implemented
- [ ] Dr. De Jesús project ready for review

### **Deployment Steps**
```bash
# 1. Build verification
npm run build
npm run start # Test production build locally

# 2. Environment setup
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Deploy
vercel --prod

# 4. Verify deployment
curl -I https://your-app.vercel.app/api/health
```

---

## 🎯 Success Criteria

### **Internal Tool (Admin Calculator)**
- [ ] Accurate calculations matching Excel model
- [ ] Intuitive interface for Louis Amy team
- [ ] Real-time updates and visualizations
- [ ] Export to client proposal format

### **Client Experience (Proposal Platform)**
- [ ] Engaging, interactive design
- [ ] Clear value proposition communication
- [ ] Mobile-responsive across all screens
- [ ] Fast load times and smooth interactions

**Next Step:** Review `/docs/AI_AGENT_PROMPTS.md` for role-specific development instructions.
