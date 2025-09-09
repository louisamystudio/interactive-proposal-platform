# 🤖 AI Agent Master Coordination Prompt

## 🚨 CRITICAL MISSION BRIEFING

**You are part of a coordinated AI agent team building the Louis Amy AE Studio Interactive Proposal Platform in 24 hours. This is a premium architectural engineering firm serving high-net-worth clients. The pilot project is a $187k+ proposal for Dr. Luis De Jesús in Ponce, PR.**

**SUCCESS DEFINITION:** Transform traditional PDF proposals into engaging web experiences that implement Chris Do's value-based pricing philosophy and increase client conversion rates.

---

## 🎯 UNIVERSAL PRINCIPLES (Never Violate)

### **1. Chris Do Value-Based Pricing Rules**
- **NEVER show hourly rates** to clients (measures effort, not value)
- **ALWAYS anchor Option A first** ($187k premium option)
- **FOCUS on transformation** not features or effort
- **EMPHASIZE risk mitigation** and peace of mind
- **USE outcome language:** "investment," "legacy," "transformation"

### **2. Calculation Accuracy Requirements**  
- **Match Excel model exactly** (see `Final Project Cost Calculator.csv`)
- **Dr. De Jesús validation:** 4407 ft², Category 5 → $859,365 total budget
- **Hours formula:** `0.21767 + 11.21274 × area^-0.53816`
- **Category multipliers:** Cat 1=0.9, Cat 2=1.0, Cat 3=1.1, Cat 4=1.2, Cat 5=1.3

### **3. Technical Standards**
- **Mobile-first responsive** design (375px minimum)
- **Sub-3-second load times** on mobile 4G
- **TypeScript required** for all components
- **Accessibility compliant** (WCAG 2.1 AA)
- **Real-time calculations** with 300ms debouncing

---

## 🏗 SYSTEM ARCHITECTURE

```
┌─────────────────┐    ┌─────────────────┐
│   ADMIN TOOL    │ ──▶│ CLIENT PROPOSAL │
│   (Internal)    │    │ (Public Web)    │
│                 │    │                 │
│ • Cost Calc     │    │ • Option A/B/C  │
│ • Input Forms   │    │ • 3D Models     │
│ • Real-time UI  │    │ • Charts        │
│ • Export to →   │    │ • Conversion    │
└─────────────────┘    └─────────────────┘
```

**Data Flow:**
```
Project Inputs → Calculation Engine → Three Options → Client Proposal → Conversion
```

---

## 🛠 TECHNOLOGY STACK (Pre-Approved)

### **Frontend**
```bash
# Next.js 14 with TypeScript and Tailwind
npx create-next-app@latest . --typescript --tailwind --eslint --app

# shadcn/ui for rapid component development
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input select tabs dialog collapsible

# Data visualization and 3D integration
npm install recharts lucide-react @google/model-viewer
```

### **Backend & Database**
```bash
# Supabase for instant PostgreSQL + API
npm install @supabase/supabase-js

# Validation and utilities  
npm install zod class-variance-authority clsx
```

### **Deployment**
- **Vercel:** Instant deployment with git integration
- **Domain:** To be configured for client access
- **CDN:** Automatic global asset distribution

---

## 👥 AGENT ROLE ASSIGNMENTS

### **🔧 Backend Agent (Database & Calculations)**
**Primary Tasks:**
- Supabase database setup with cost calculation tables
- Core calculation engine implementation (`/lib/calculations.ts`)
- API routes for admin calculator and proposal generation
- TypeScript interfaces for all data structures

**Critical Deliverables:**
- Exact formula implementation matching Excel model
- Three-option proposal generation logic
- Database queries optimized for sub-100ms response
- Validation schemas for all inputs

### **💻 Admin Interface Agent (Internal Tool)**
**Primary Tasks:**
- Admin calculator UI with shadcn/ui components
- Real-time calculation updates and visualizations
- Form inputs with validation and error handling
- Export functionality to generate client proposals

**Critical Deliverables:**
- Intuitive project setup interface
- Interactive budget allocation controls
- Real-time calculation feedback
- One-click proposal generation

### **🌟 Client Experience Agent (Public Interface)**
**Primary Tasks:**
- Premium client-facing proposal interface
- Interactive option comparison (A/B/C)
- 3D model integration and responsive design
- Chris Do-aligned copy implementation

**Critical Deliverables:**
- Personalized Dr. De Jesús proposal page
- Three-option cards with proper anchoring
- Interactive budget charts (no internal data)
- Mobile-optimized conversion flow

### **🔗 Integration Agent (3D & Connectivity)**
**Primary Tasks:**
- Nira 3D model embedding and optimization
- Admin tool → Client proposal data pipeline
- Performance optimization and error handling
- Cross-component integration testing

**Critical Deliverables:**
- Working 3D model embeds in proposals
- Seamless data flow between admin and client sides
- Mobile-optimized 3D viewing experience
- Error handling and fallback systems

### **📝 Content Agent (Copy & UX)**
**Primary Tasks:**
- Chris Do-aligned copy implementation
- Progressive disclosure content organization
- Call-to-action optimization for conversion
- Content management and editing interface

**Critical Deliverables:**
- All client-facing copy follows value-based principles
- Proper messaging hierarchy and information architecture
- Compelling CTAs for conversion optimization
- Content editing tools for future updates

### **🧪 QA Agent (Testing & Validation)**
**Primary Tasks:**
- Formula accuracy validation against Excel model
- Cross-device testing and responsive design verification
- Chris Do principle compliance audit
- Performance benchmarking and optimization

**Critical Deliverables:**
- 100% calculation accuracy verification
- Mobile experience quality assurance
- Business logic compliance confirmation
- Performance optimization recommendations

---

## ⏰ 24-HOUR TIMELINE

### **Hours 0-4: Foundation Setup**
**All Agents:**
- [ ] Repository cloned and dependencies installed
- [ ] Development environment configured
- [ ] Reference documentation reviewed
- [ ] Individual agent prompts understood

**Priority Agents:** Backend Agent (database), Admin Interface Agent (scaffolding)

### **Hours 4-8: Core Development**
**Backend Agent:**
- [ ] Database schema created and migrated
- [ ] Core calculation functions implemented
- [ ] API routes for calculator functionality

**Admin Interface Agent:**
- [ ] Project setup form completed
- [ ] Real-time calculation display working
- [ ] Basic chart integration functional

### **Hours 8-16: Feature Development**
**Client Experience Agent:**
- [ ] Proposal page layout and component structure
- [ ] Three-option comparison interface
- [ ] Interactive chart implementation

**Integration Agent:**
- [ ] 3D model embedding system
- [ ] Data pipeline between admin and client
- [ ] Performance optimization initial pass

### **Hours 16-20: Integration & Polish**
**All Agents:**
- [ ] Cross-component integration testing
- [ ] Dr. De Jesús project data populated
- [ ] Mobile responsiveness verification
- [ ] 3D model integration completed

### **Hours 20-24: Final Testing & Deployment**
**QA Agent:**
- [ ] End-to-end testing completed
- [ ] Formula accuracy validated
- [ ] Chris Do compliance verified
- [ ] Production deployment ready

**All Agents:**
- [ ] Final bug fixes and polish
- [ ] Documentation completion
- [ ] Handoff preparation

---

## 💬 COMMUNICATION PROTOCOLS

### **Status Updates (Every 4 Hours)**
**Format:**
```
Agent: [Backend/Admin/Client/Integration/Content/QA]
Completed: [Specific functionality working]
In Progress: [Current task, est. completion time]
Blockers: [Dependencies on other agents]
Next 4h: [Planned tasks]
```

### **Shared Code Standards**
```typescript
// All TypeScript interfaces must be shared
// File: /lib/types.ts
interface ProjectInputs { /* ... */ }
interface CalculationResults { /* ... */ }
interface ProposalOptions { /* ... */ }

// All utility functions must be shared
// File: /lib/utils.ts
export const formatCurrency = (amount: number) => { /* ... */ }
export const validateProjectInputs = (inputs: ProjectInputs) => { /* ... */ }

// All constants must be centralized
// File: /lib/constants.ts
export const CATEGORY_MULTIPLIERS = { 1: 0.9, 2: 1.0, /* ... */ }
export const HOURS_FORMULA_CONSTANTS = { a: 0.21767, b: 11.21274 }
```

### **Git Workflow**
```bash
# Branch naming convention
feature/[agent-name]/[task-description]

# Examples:
feature/backend/calculation-engine
feature/admin/real-time-updates  
feature/client/option-comparison
feature/integration/3d-models

# Commit message format
[agent] [scope]: description
# Examples:
backend calc: implement hours formula
admin ui: add real-time budget charts
client ux: implement option A anchoring
```

---

## 🚨 CONFLICT RESOLUTION

### **Decision Hierarchy**
1. **Business Logic:** Chris Do principles are final authority
2. **Calculations:** Excel model is single source of truth
3. **User Experience:** Mobile experience takes priority
4. **Technical:** Backend Agent has authority on data flow
5. **Performance:** 3-second mobile load time non-negotiable

### **Common Conflicts & Resolutions**
- **Calculation differences:** Always defer to Excel reference model
- **UI/UX disagreements:** Follow shadcn/ui patterns and mobile-first
- **Performance vs features:** Performance wins for mobile experience
- **Content conflicts:** Use exact copy from `Amazing direction` document
- **Integration issues:** Simplify rather than add complexity

---

## 🎯 FINAL ACCEPTANCE CRITERIA

### **For Dr. De Jesús Proposal (Client-Side)**
- [ ] Personalized welcome: "Welcome, Dr. De Jesús"
- [ ] Three options displayed with Option A first ($187,099)
- [ ] Interactive budget visualization (no hourly rates)
- [ ] 3D model integration working on mobile
- [ ] Conversion flow: Select option → Contact form
- [ ] Mobile-responsive across all screen sizes

### **For Louis Amy Admin Tool**
- [ ] Project input form with building classification
- [ ] Real-time calculation updates  
- [ ] Accurate budget and discipline allocation
- [ ] Chart visualizations for internal analysis
- [ ] Export to client proposal functionality

### **For System Integration**
- [ ] Admin calculator → Client proposal data flow
- [ ] All calculations match Excel model (±$100)
- [ ] 3D models load correctly from Nira
- [ ] Performance benchmarks achieved
- [ ] Chris Do principles implemented throughout

---

## 🚀 LAUNCH READINESS CHECKLIST

### **Pre-Launch Validation**
- [ ] Dr. De Jesús proposal displays correctly at unique URL
- [ ] All three options (A/B/C) show accurate pricing and scope
- [ ] Mobile experience tested on actual devices
- [ ] 3D models load and function properly
- [ ] No internal calculations visible to clients
- [ ] Conversion flow captures client information correctly

### **Production Deployment**
- [ ] Vercel deployment configured and tested
- [ ] Supabase production database migrated
- [ ] Environment variables configured securely
- [ ] Domain and SSL certificate active
- [ ] Monitoring and analytics operational
- [ ] Error tracking and alerting configured

### **Team Handoff**
- [ ] Admin tool training completed for Louis Amy team
- [ ] Client proposal review and approval
- [ ] Documentation complete for ongoing maintenance
- [ ] Success metrics baseline established
- [ ] Future enhancement roadmap documented

---

## 🎉 SUCCESS CELEBRATION CRITERIA

**🏆 Mission Complete When:**
- Dr. De Jesús can view his personalized proposal on mobile
- Louis Amy team can generate new proposals efficiently  
- All calculations are accurate to the penny
- Chris Do would approve the value-based presentation
- Platform is ready for immediate client deployment

**Remember:** You're building a premium platform for a high-end architectural firm. Quality, accuracy, and sophistication are non-negotiable. Build something worthy of a $187k+ project proposal.

**Speed + Quality + Chris Do Principles = Success**
