# Development Strategy: 24-Hour Sprint Plan

## 🎯 Strategic Approach

### **Primary Goal**
Create a working interactive proposal platform in 24 hours that:
- Automates Louis Amy's quote preparation process
- Presents proposals in an engaging, Chris Do-aligned format
- Delivers the Dr. De Jesús project proposal as proof of concept

### **Two-Part System Architecture**

```
┌─────────────────┐    ┌─────────────────┐
│   INTERNAL      │────│   CLIENT        │
│   CALCULATOR    │    │   PROPOSAL      │
│   (Admin Tool)  │    │   (Web App)     │
└─────────────────┘    └─────────────────┘
```

## 🛠 Technical Foundation

### **Chosen Tech Stack (Fastest to Deploy)**

**Frontend Framework:**
- **Next.js 14** with App Router (SSR + Client components)
- **TypeScript** for type safety and better DX
- **Tailwind CSS** for rapid styling
- **shadcn/ui** for pre-built, accessible components

**Backend & Database:**
- **Supabase** (PostgreSQL + Auth + Real-time)
- **Next.js API routes** for server-side logic
- **Vercel** for instant deployment

**Data Visualization:**
- **Recharts** (React-native charts, no D3 complexity)
- **Lucide React** for consistent icons
- **Framer Motion** for smooth animations (if time permits)

**3D Integration:**
- **@google/model-viewer** for Nira iframe embedding
- **React Three Fiber** (backup for custom models)

### **Why This Stack?**
- **Zero configuration:** Everything works out of the box
- **Instant deployment:** Push to Vercel = live app in 30 seconds
- **Component library:** shadcn = beautiful UI without design time
- **Database ready:** Supabase = PostgreSQL + admin panel + API
- **TypeScript safety:** Catch errors before runtime

## 🏗 Development Phases (24-Hour Timeline)

### **Phase 1: Foundation Setup (Hours 0-2)**

**Objectives:**
- Project scaffolding and environment setup
- Database schema creation
- Core routing structure

**Deliverables:**
- Next.js app with shadcn/ui configured
- Supabase database with cost calculation tables
- Basic routing for admin and client sides
- Development environment fully operational

**Critical Path:**
```bash
npx create-next-app@latest . --typescript --tailwind --app
npx shadcn-ui@latest init
# Database setup with cost calculation tables
# Environment variables configuration
```

### **Phase 2: Core Calculator Engine (Hours 2-8)**

**Objectives:**
- Implement exact calculation formulas from Excel model
- Build admin interface for project input
- Generate three-option proposals automatically

**Critical Components:**
```typescript
// Core calculation engine
lib/
├── calculations.ts         # Budget, hours, fee formulas
├── categoryMappings.ts     # Building type classifications  
├── optionGenerator.ts      # A/B/C proposal creation
└── dataValidation.ts       # Input validation schemas
```

**Formula Implementation Priority:**
1. **Budget calculations** (area × cost/sf + multipliers)
2. **Discipline allocations** (engineering percentages)
3. **Hours calculations** (non-linear formula)
4. **Fee structures** (market rate vs Louis Amy pricing)
5. **Three-option generation** (A/B/C with scope differences)

### **Phase 3: Admin Interface (Hours 8-12)**

**Objectives:**
- Build intuitive calculator interface for Louis Amy team
- Real-time calculation updates
- Data export to client proposal format

**Key Screens:**
```
/admin/calculator/
├── project-setup/          # Building classification inputs
├── areas-multipliers/      # Square footage and factors
├── budget-allocation/      # Shell/Interior/Landscape splits
├── discipline-config/      # Engineering percentages
├── fee-calculation/        # Market vs internal pricing
└── proposal-preview/       # A/B/C options generated
```

**UI Requirements:**
- **Real-time updates:** Every input change triggers recalculation
- **Visual feedback:** Charts and cards show calculations instantly
- **Data export:** Generate client proposal with one click
- **Mobile responsive:** Works on tablets for field use

### **Phase 4: Client Proposal Interface (Hours 12-20)**

**Objectives:**
- Beautiful, Chris Do-aligned client experience
- Interactive option comparison
- 3D model integration
- Conversion-focused design

**Core Pages:**
```
/proposal/[token]/
├── page.tsx               # Main proposal view
├── components/
│   ├── Hero.tsx           # Personalized welcome
│   ├── OptionCards.tsx    # A/B/C comparison
│   ├── BudgetCharts.tsx   # Interactive visualizations
│   ├── ProofSection.tsx   # 3D models, VR links
│   └── ConversionFlow.tsx # Select → Sign → Pay
```

**Chris Do Compliance:**
- **No hourly rates displayed** to clients
- **Option A anchored high** ($187k first)
- **Value-focused copy** (transformation, not features)
- **Risk mitigation emphasis** (peace of mind)
- **Progressive disclosure** (collapsible sections)

### **Phase 5: Integration & Polish (Hours 20-24)**

**Objectives:**
- Connect calculator to client proposals
- 3D model embedding from Nira
- Final UX polish and testing
- Dr. De Jesús project deployment

**Integration Tasks:**
- Admin calculator → Client proposal data flow
- Nira 3D model iframe integration
- Responsive design verification
- Performance optimization
- Dr. De Jesús specific content population

## 🔄 AI Agent Coordination Strategy

### **Simultaneous Development Approach**

**Agent A: Backend & Calculations**
- Database schema and Supabase setup
- Core calculation engine implementation
- API routes for data processing
- Formula accuracy validation

**Agent B: Admin Interface**
- Calculator UI components
- Real-time calculation updates
- Data visualization for internal use
- Export to proposal functionality

**Agent C: Client Experience**
- Proposal page components
- Interactive charts and 3D integration
- Chris Do-aligned copy implementation
- Conversion flow development

**Agent D: Testing & Integration**
- Cross-agent integration testing
- Formula validation against Excel model
- UX testing and refinement
- Deployment and production readiness

### **Coordination Protocols**

**Shared Dependencies:**
- All agents use same TypeScript interfaces
- Common utility functions in `/lib/shared/`
- Consistent naming conventions
- Shared component design system

**Communication:**
- **Status updates:** Comment progress in component headers
- **Breaking changes:** Announce in shared types file
- **Questions:** Reference comprehensive docs in `/docs/`
- **Conflicts:** Backend agent has final authority on data flow

## 📊 Success Metrics

### **Development Metrics (24 hours)**
- [ ] All calculations match Excel model (±$100 tolerance)
- [ ] Admin tool generates proposals in under 30 seconds
- [ ] Client proposal loads in under 3 seconds
- [ ] Mobile responsiveness across all screens
- [ ] Dr. De Jesús proposal fully configured

### **Business Metrics (Post-deployment)**
- **Time-to-proposal:** From client brief to sent link
- **Engagement rate:** % of clients viewing full proposal
- **Option selection:** A vs B vs C preferences
- **Conversion rate:** % accepting proposals
- **Time-to-decision:** Days from send to acceptance

## 🔥 Critical Path Dependencies

### **Hour 0-2: Must Complete First**
1. Next.js + shadcn setup
2. Supabase database with cost tables
3. TypeScript interfaces defined
4. Git repository structure

### **Hours 2-8: Core Engine**
1. Calculation formulas implemented
2. Building type classifications
3. Budget allocation logic
4. Hours calculation (non-linear formula)

### **Hours 8-16: User Interfaces**
1. Admin calculator screens
2. Client proposal pages
3. Interactive charts and visualizations
4. 3D model integration

### **Hours 16-24: Integration & Launch**
1. End-to-end data flow
2. Dr. De Jesús project configuration
3. Performance optimization
4. Production deployment

## 🚨 Non-Negotiables

### **Must Be Perfect:**
- **Calculation accuracy:** Formulas match Excel exactly
- **No hourly exposure:** Clients never see internal rates
- **Chris Do principles:** Value-first language throughout
- **Mobile responsiveness:** Works flawlessly on phones
- **Performance:** Sub-3-second load times

### **Can Be Improved Later:**
- Advanced animations
- Payment integration
- E-signature workflow
- Advanced analytics
- Additional 3D interactions

## 📋 Handoff Requirements

### **For Production Release:**
- [ ] Dr. De Jesús proposal fully functional
- [ ] Admin calculator working with all building types
- [ ] Client proposal responsive on mobile
- [ ] 3D models loading from Nira
- [ ] All calculations validated against Excel
- [ ] Performance metrics under target thresholds

### **Documentation Complete:**
- [ ] API documentation for future maintenance
- [ ] Component library documented
- [ ] Calculation formula documentation
- [ ] Deployment and hosting guide
- [ ] User training materials for Louis Amy team

---

## 🎯 Next Steps for AI Agents

1. **Read:** `/docs/AI_AGENT_PROMPTS.md` for role-specific instructions
2. **Review:** `/docs/APP_LOGIC.md` for calculation requirements
3. **Check:** `/docs/REFERENCE_LEGEND.md` for context understanding
4. **Begin:** Execute assigned phase based on timeline above

**Remember:** This is a 24-hour sprint. Speed is critical, but accuracy to Chris Do principles and calculation formulas is non-negotiable.
