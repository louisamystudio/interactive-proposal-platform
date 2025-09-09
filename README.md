# Louis Amy AE Studio - Interactive Proposal Platform

## 🏗️ Project Overview

**Mission:** Transform traditional PDF proposals into engaging, interactive web experiences that implement Chris Do's value-based pricing philosophy and dramatically increase client conversion rates.

**Pilot Project:** Dr. Luis De Jesús residential proposal (Casa Vista, Ponce, PR)
**Timeline:** 24-hour rapid development sprint
**Goal:** Replace static proposals with dynamic, data-driven client experiences

## 🎯 Strategic Vision

### The Problem We're Solving
- Static PDF proposals create friction and decision delays
- Clients can't easily compare options or understand value
- Internal quote preparation is manual and time-intensive
- No way to track client engagement or optimize proposals

### The Chris Do Solution
- **Value-based pricing:** Focus on transformation, not effort
- **Anchor high:** Present premium option first ($187k → $127k → $88k)
- **No hourly rates:** Fixed investments with clear outcomes
- **Risk mitigation:** Emphasize peace of mind and certainty

### Expected Outcomes
- **50%+ faster** proposal acceptance times
- **Higher conversion rates** through interactive engagement
- **Premium positioning** through technology showcase
- **Reduced back-and-forth** via clear option comparison

## 🏛️ Two-Part Architecture

### **Part 1: Internal Calculator (Admin Tool)**
**Purpose:** Louis Amy team creates accurate quotes using sophisticated formulas
**Users:** Project managers, architects, principals
**Features:**
- Building classification inputs (type, tier, category)
- Area and multiplier configuration
- Real-time budget calculations
- Engineering discipline allocation
- Three-option proposal generation

### **Part 2: Client Proposal (Web Experience)**
**Purpose:** Clients explore options and commit confidently
**Users:** HNW clients (Dr. De Jesús target profile)
**Features:**
- Personalized welcome and project overview
- Interactive option comparison (A/B/C)
- 3D model integration (Nira-hosted assets)
- Progressive disclosure (collapsible details)
- Conversion flow (select → sign → pay → schedule)

## 🚀 Quick Start for AI Agents

### Prerequisites
```bash
Node.js 18+ | Git | VS Code with Cursor
```

### Rapid Setup (5 minutes)
```bash
# 1. Create Next.js foundation
npx create-next-app@latest . --typescript --tailwind --eslint --app

# 2. Add UI components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input select tabs dialog

# 3. Add essential packages
npm install recharts lucide-react @supabase/supabase-js
npm install @google/model-viewer @radix-ui/react-collapsible

# 4. Development server
npm run dev
```

### First Task Verification
- [ ] Next.js app loads at localhost:3000
- [ ] Shadcn components render correctly
- [ ] Tailwind styling works
- [ ] Can import Recharts and Lucide icons

## 📁 Repository Structure
```
/
├── README.md (this file)
├── docs/
│   ├── DEVELOPMENT_STRATEGY.md
│   ├── APP_LOGIC.md
│   ├── TECH_STACK.md
│   ├── AI_AGENT_PROMPTS.md
│   └── REFERENCE_LEGEND.md
├── app/
│   ├── admin/              # Internal calculator tool
│   ├── proposal/[token]/   # Client-facing proposals
│   └── api/                # Backend services
├── components/
│   ├── admin/              # Calculator components
│   ├── client/             # Proposal components
│   └── shared/             # Reusable UI
├── lib/
│   ├── calculations.ts     # Core formulas
│   ├── database.ts         # Supabase client
│   └── utils.ts            # Helper functions
└── data/
    ├── cost-ranges.json    # Building cost data
    ├── multipliers.json    # Category & remodel factors
    └── copy.json           # Chris Do-aligned content
```

## 🎨 Brand & Design Standards

### Visual Identity
- **Primary:** #2B59FF (Professional Blue)
- **Secondary:** #00C896 (Success Green) 
- **Accent:** #FF6B35 (Action Orange)
- **Typography:** Inter font family
- **Spacing:** 4pt baseline grid

### Design Principles
- **Premium aesthetic:** Convey Louis Amy's sophisticated expertise
- **Progressive disclosure:** Complex information revealed gradually
- **Mobile-first:** Responsive across all devices
- **Accessibility:** WCAG 2.1 AA compliance

## 🔧 Core Integrations

### 3D Model Display (Nira Integration)
```html
<!-- Embed Nira-hosted models -->
<iframe src="https://nira.app/embed/[model-id]" 
        width="100%" height="400px" 
        frameborder="0"></iframe>
```

### Data Visualization (Recharts)
```tsx
// Budget distribution donut
<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie data={budgetData} dataKey="value" 
         innerRadius={60} outerRadius={90} />
  </PieChart>
</ResponsiveContainer>
```

## 🚨 Critical Success Factors

### For AI Agents Working on This Project:
1. **Never expose hourly rates** to clients
2. **Always anchor Option A first** (highest price)
3. **Use SSOT formulas** from `/lib/calculations.ts` (exact Excel accuracy)
4. **Follow Chris Do copy guidelines** (outcome-focused)
5. **Mobile responsiveness** is mandatory
6. **Real-time calculations** required
7. **Exact calculation accuracy** verified by unit tests against SSOT

### Quality Gates
- [ ] Calculations match SSOT model exactly (verified by unit tests)
- [ ] No internal pricing data visible to clients
- [ ] Three options clearly differentiated (A anchored first)
- [ ] Mobile experience is flawless
- [ ] 3D models load and display properly

## 🤝 AI Agent Coordination

### Primary Agents Needed
1. **Backend Agent:** Database setup, calculations, API development
2. **Frontend Agent:** UI components, responsive design, client experience
3. **Integration Agent:** 3D models, charts, third-party services
4. **Testing Agent:** Formula validation, UX testing, performance

### Communication Protocol
- **All agents must read:** `/docs/AI_AGENT_PROMPTS.md` before starting
- **Status updates:** Comment progress in respective component files
- **Conflicts:** Refer to `/docs/DEVELOPMENT_STRATEGY.md` for priorities
- **Questions:** Check `/docs/REFERENCE_LEGEND.md` for context

## 🏁 Definition of Done

### Internal Calculator Complete:
- [ ] All building types and categories supported
- [ ] Real-time budget calculations working
- [ ] Three-option proposals generated accurately
- [ ] Export to client proposal format

### Client Proposal Complete:
- [ ] Personalized for Dr. De Jesús project
- [ ] Interactive option comparison
- [ ] 3D model integration working
- [ ] Mobile-responsive design
- [ ] Ready for client review

## 📞 Emergency Contact
If any AI agent encounters blockers or needs clarification on Chris Do principles, calculation formulas, or design decisions, refer to the comprehensive documentation in `/docs/` or flag for human review.

---

**Next Step:** Read `/docs/DEVELOPMENT_STRATEGY.md` to understand the detailed technical approach and coordination plan.
