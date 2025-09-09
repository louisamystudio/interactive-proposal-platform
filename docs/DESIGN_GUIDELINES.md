# Design Guidelines & Visual Standards

## 🎨 Brand Identity & Visual Language

### **Louis Amy AE Studio Brand Essence**
- **Tagline:** "Where Vision Meets Bold Innovation"
- **Positioning:** Premium architectural engineering for HNW clients
- **Aesthetic:** Modern tropical, sophisticated, technology-forward
- **Values:** Precision, Innovation, Craftsmanship, Transformation

### **Visual Personality**
- **Premium:** Sophisticated, refined, exclusive
- **Innovative:** Modern, tech-forward, cutting-edge
- **Trustworthy:** Professional, reliable, established
- **Personal:** Warm, human-centered, relationship-focused

## 🎨 Color Palette

### **Primary Colors**
```css
/* Professional Blue - Primary brand color */
--primary: #2B59FF;
--primary-50: #EBF2FF;
--primary-100: #D1E2FF;
--primary-500: #2B59FF;
--primary-600: #1E40BF;
--primary-900: #0F1F5C;

/* Success Green - Positive actions */
--success: #00C896;
--success-50: #ECFDF8;
--success-100: #D1FAE5;
--success-500: #00C896;

/* Action Orange - CTAs and highlights */
--accent: #FF6B35;
--accent-50: #FFF7ED;
--accent-100: #FFEDD5;
--accent-500: #FF6B35;
```

### **Neutral Palette**
```css
/* Professional grays for text and backgrounds */
--background: #FAFBFC;    /* Light gray background */
--card: #FFFFFF;          /* Pure white cards */
--text-primary: #1F2937;  /* Charcoal for headings */
--text-secondary: #6B7280; /* Medium gray for body */
--text-muted: #9CA3AF;    /* Light gray for captions */
--border: #E5E7EB;        /* Subtle borders */
```

### **Data Visualization Colors**
```css
/* Chart color sequence (accessible and distinct) */
--chart-1: #2B59FF;  /* Primary blue */
--chart-2: #8B5CF6;  /* Purple */  
--chart-3: #10B981;  /* Emerald */
--chart-4: #F59E0B;  /* Amber */
--chart-5: #EF4444;  /* Red */
--chart-6: #06B6D4;  /* Cyan */
--chart-7: #84CC16;  /* Lime */
--chart-8: #F97316;  /* Orange */
```

## 📝 Typography System

### **Font Family**
```css
/* Inter for UI, system fallbacks */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### **Type Scale (Modular Scale: 1.250)**
```css
/* Display text - Hero numbers and key figures */
--text-7xl: 4.5rem;    /* 72px - Total budget display */
--text-6xl: 3.75rem;   /* 60px - Investment amounts */
--text-5xl: 3rem;      /* 48px - Section headings */

/* Headings - Section titles and card headers */
--text-4xl: 2.25rem;   /* 36px - Page titles */
--text-3xl: 1.875rem;  /* 30px - Card titles */
--text-2xl: 1.5rem;    /* 24px - Subsection headers */
--text-xl: 1.25rem;    /* 20px - Large labels */

/* Body text - Content and descriptions */
--text-lg: 1.125rem;   /* 18px - Large body text */
--text-base: 1rem;     /* 16px - Default body */
--text-sm: 0.875rem;   /* 14px - Small text */
--text-xs: 0.75rem;    /* 12px - Captions */
```

### **Font Weights**
```css
--font-normal: 400;    /* Body text */
--font-medium: 500;    /* Labels and emphasis */
--font-semibold: 600;  /* Card titles */
--font-bold: 700;      /* Section headings */
--font-extrabold: 800; /* Investment amounts */
```

## 📐 Spacing & Layout System

### **4pt Baseline Grid**
```css
/* Consistent spacing increments */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-24: 6rem;    /* 96px */
```

### **Container Widths**
```css
/* Responsive container system */
--container-sm: 640px;   /* Mobile landscape */
--container-md: 768px;   /* Tablet */
--container-lg: 1024px;  /* Desktop */
--container-xl: 1280px;  /* Large desktop */
--container-2xl: 1536px; /* Ultra-wide */

/* Content max-widths */
--content-narrow: 42rem;  /* 672px - Reading width */
--content-wide: 64rem;    /* 1024px - Dashboard width */
--content-full: 80rem;    /* 1280px - Maximum width */
```

## 🎴 Component Design Patterns

### **Card Specifications**
```tsx
// Standard card component pattern
<Card className="p-6 shadow-sm border border-gray-200 bg-white">
  <CardHeader className="pb-4">
    <CardTitle className="text-xl font-semibold text-gray-900">
      Title Text
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Card content */}
  </CardContent>
</Card>
```

### **Option Card Design**
```tsx
// Three-option comparison cards
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Option A - Premium anchor */}
  <Card className="relative border-2 border-primary ring-2 ring-primary/20">
    <Badge className="absolute -top-2 left-4 bg-primary text-white">
      Recommended
    </Badge>
    <CardHeader className="text-center pb-4">
      <CardTitle className="text-2xl font-bold text-primary">
        Option A
      </CardTitle>
      <div className="text-4xl font-extrabold text-gray-900">
        $187,099
      </div>
      <p className="text-sm text-gray-600">Fixed Investment</p>
    </CardHeader>
    {/* Card content */}
  </Card>
</div>
```

### **Data Visualization Design**
```tsx
// Budget allocation donut chart
<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={budgetData}
      dataKey="value"
      nameKey="category"
      innerRadius={60}
      outerRadius={90}
      startAngle={90}
      endAngle={-270}
    >
      {budgetData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={chartColors[index]} />
      ))}
    </Pie>
    <Tooltip 
      formatter={(value: number, name: string) => [
        `$${value.toLocaleString()}`,
        name
      ]}
      labelStyle={{ color: '#1F2937', fontWeight: 600 }}
      contentStyle={{ 
        background: 'white',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}
    />
  </PieChart>
</ResponsiveContainer>
```

## 📱 Responsive Design Requirements

### **Mobile-First Breakpoints**
```css
/* Mobile (375px - 640px) */
.mobile {
  /* Stack all cards vertically */
  grid-template-columns: 1fr;
  /* Larger touch targets */
  min-height: 44px;
  /* Condensed spacing */
  gap: 1rem;
}

/* Tablet (640px - 1024px) */
.tablet {
  /* 2-column layout */
  grid-template-columns: repeat(2, 1fr);
  /* Medium spacing */
  gap: 1.5rem;
}

/* Desktop (1024px+) */
.desktop {
  /* 3-column layout for options */
  grid-template-columns: repeat(3, 1fr);
  /* Full spacing */
  gap: 2rem;
}
```

### **Mobile UX Considerations**
- **Touch targets:** Minimum 44px height for buttons
- **Thumb zones:** CTAs within easy reach
- **Scroll performance:** Smooth scrolling with momentum
- **Loading states:** Clear feedback on slow connections
- **Offline graceful:** Cache critical content

## 🎯 Interface Patterns

### **Progressive Disclosure**
```tsx
// Collapsible sections pattern
<Collapsible>
  <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
    <span className="font-medium">Assumptions & Exclusions</span>
    <ChevronDown className="w-4 h-4 transform transition-transform" />
  </CollapsibleTrigger>
  <CollapsibleContent className="pt-2 space-y-2">
    {/* Detailed content hidden by default */}
  </CollapsibleContent>
</Collapsible>
```

### **Interactive Elements**
```tsx
// Hover states and micro-interactions
<Button 
  className="
    transition-all duration-200 
    hover:scale-105 hover:shadow-lg
    active:scale-95
    focus:ring-2 focus:ring-primary/20
  "
>
  Accept & Reserve Studio Window
</Button>
```

### **Loading States**
```tsx
// Skeleton loading for calculations
<Card className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
</Card>
```

## 🖼 Image & Asset Guidelines

### **Image Optimization**
```tsx
// Next.js Image component for all visuals
import Image from 'next/image'

<Image
  src="/casa-vista-exterior.jpg"
  alt="Casa Vista Exterior Rendering"
  width={800}
  height={600}
  className="rounded-lg object-cover"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..." // Low-quality placeholder
  priority // Above-the-fold images
/>
```

### **3D Model Integration**
```tsx
// Nira iframe with responsive wrapper
<div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
  <iframe
    src={`https://nira.app/embed/${modelId}`}
    className="w-full h-full border-0"
    allow="fullscreen; xr-spatial-tracking"
    loading="lazy" // Performance optimization
  />
</div>
```

### **Icon Usage**
```tsx
// Lucide React icons (consistent style)
import { Building2, Calculator, Eye, CheckCircle } from 'lucide-react'

<div className="flex items-center gap-2">
  <Building2 className="w-5 h-5 text-primary" />
  <span>Architecture & Engineering</span>
</div>
```

## 📊 Data Visualization Standards

### **Chart Color Mapping**
```typescript
// Consistent color assignments
const disciplineColors = {
  architecture: '#2B59FF',    // Primary blue
  interior: '#8B5CF6',        // Purple
  landscape: '#10B981',       // Emerald  
  structural: '#F59E0B',      // Amber
  civil: '#EF4444',           // Red
  mechanical: '#06B6D4',      // Cyan
  electrical: '#84CC16',      // Lime
  plumbing: '#F97316',        // Orange
  telecom: '#6366F1'          // Indigo
}
```

### **Chart Interaction Standards**
```tsx
// Hover behavior for all charts
const chartTooltipStyle = {
  background: 'white',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  fontSize: '14px',
  padding: '12px'
}

// Number formatting for tooltips
const formatCurrency = (value: number) => 
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
```

## 🎯 Layout Specifications

### **Admin Calculator Layout**
```tsx
// Two-column layout: inputs left, results right
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-screen p-6">
  {/* Input Panel */}
  <div className="lg:col-span-4 space-y-6">
    <ProjectSetupCard />
    <AreaInputCard />
    <MultiplierCard />
    <OverrideSettings />
  </div>
  
  {/* Results Panel */}
  <div className="lg:col-span-8 space-y-6">
    <BudgetOverviewCard />
    <DisciplineAllocationCard />
    <HoursBreakdownCard />
    <ThreeOptionsPreview />
  </div>
</div>
```

### **Client Proposal Layout**
```tsx
// Single-column, scroll-based experience
<div className="max-w-4xl mx-auto px-4 py-8 space-y-16">
  <HeroSection />          {/* Personalized welcome */}
  <OptionComparison />     {/* A/B/C side-by-side */}
  <ProofOfPrecision />     {/* 3D models, VR, BIM */}
  <InvestmentBreakdown />  {/* Interactive charts */}
  <AssumptionsPanel />     {/* Collapsible details */}
  <ConversionFlow />       {/* Accept & pay CTAs */}
</div>
```

## 🎭 Animation & Micro-Interactions

### **Subtle Animations**
```css
/* Smooth transitions for all interactive elements */
.interactive {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects */
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Loading states */
.skeleton {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Success states */
.success-bounce {
  animation: bounce 1s ease-in-out;
}
```

### **Framer Motion Integration (if time permits)**
```tsx
import { motion } from 'framer-motion'

// Stagger animations for option cards
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: index * 0.1 }}
>
  <OptionCard />
</motion.div>
```

## 📊 Chart & Visualization Standards

### **Budget Distribution Donut**
```typescript
// Specifications for main budget chart
const donutConfig = {
  innerRadius: 60,
  outerRadius: 90,
  startAngle: 90,
  endAngle: -270,
  paddingAngle: 2,
  cornerRadius: 3
}

// Data structure
interface BudgetSegment {
  category: string
  value: number
  percentage: number
  color: string
  description?: string
}
```

### **Option Comparison Chart**
```tsx
// Bar chart comparing three options
<ResponsiveContainer width="100%" height={200}>
  <BarChart data={optionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
    <XAxis 
      dataKey="option" 
      tick={{ fontSize: 14, fill: '#6B7280' }}
    />
    <YAxis 
      tick={{ fontSize: 12, fill: '#6B7280' }}
      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
    />
    <Tooltip 
      formatter={(value) => [`$${value.toLocaleString()}`, 'Investment']}
      contentStyle={chartTooltipStyle}
    />
    <Bar dataKey="investment" fill="#2B59FF" radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

## 🎯 Component Specifications

### **Investment Display Cards**
```tsx
// Large number display for key figures
<Card className="text-center p-8 bg-gradient-to-br from-primary/5 to-primary/10">
  <div className="space-y-2">
    <div className="text-sm font-medium text-primary uppercase tracking-wide">
      Total Investment
    </div>
    <div className="text-5xl font-extrabold text-gray-900">
      $187,099
    </div>
    <div className="text-sm text-gray-600">
      Fixed Price - No Hourly Billing
    </div>
  </div>
</Card>
```

### **Feature Inclusion Indicators**
```tsx
// Visual indicators for what's included/excluded
<div className="space-y-3">
  {features.map((feature, index) => (
    <div key={index} className="flex items-center gap-3">
      {feature.included ? (
        <CheckCircle className="w-5 h-5 text-success" />
      ) : (
        <XCircle className="w-5 h-5 text-gray-400" />
      )}
      <span className={cn(
        "text-sm",
        feature.included ? "text-gray-900" : "text-gray-500 line-through"
      )}>
        {feature.name}
      </span>
    </div>
  ))}
</div>
```

### **Call-to-Action Buttons**
```tsx
// Primary CTA styling
<Button 
  size="lg"
  className="
    bg-primary hover:bg-primary-600 
    text-white font-semibold
    px-8 py-4 text-lg
    shadow-lg hover:shadow-xl
    transition-all duration-200
    w-full md:w-auto
  "
>
  Accept & Reserve Studio Window
</Button>

// Secondary CTA styling  
<Button 
  variant="outline"
  size="lg"
  className="
    border-primary text-primary hover:bg-primary/5
    font-medium px-6 py-3
    transition-all duration-200
  "
>
  Ask a Question
</Button>
```

## 🔍 Accessibility Standards

### **WCAG 2.1 AA Compliance**
```tsx
// Focus states for keyboard navigation
<Button className="focus:ring-2 focus:ring-primary/20 focus:ring-offset-2">
  Interactive Element
</Button>

// Alt text for all images
<Image
  src="/rendering.jpg"
  alt="Casa Vista exterior architectural rendering showing modern tropical facade"
  // Never use decorative or generic alt text
/>

// ARIA labels for complex interactions
<div 
  role="tabpanel"
  aria-labelledby="option-a-tab"
  aria-describedby="option-a-description"
>
  {/* Option A content */}
</div>
```

### **Color Contrast Requirements**
- **Normal text:** 4.5:1 contrast ratio minimum
- **Large text:** 3:1 contrast ratio minimum
- **Interactive elements:** Clear focus indicators
- **Charts:** Sufficient contrast between segments

## 📐 Grid System & Alignment

### **Layout Grid**
```css
/* 12-column responsive grid */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

/* Common layout patterns */
.sidebar-main { grid-template-columns: 300px 1fr; } /* Admin layout */
.two-column { grid-template-columns: repeat(2, 1fr); } /* Content layout */
.three-column { grid-template-columns: repeat(3, 1fr); } /* Option cards */
```

### **Content Alignment**
```tsx
// Left-align for readability
<div className="text-left max-w-prose">
  {/* Body content */}
</div>

// Center-align for key figures
<div className="text-center">
  <div className="text-4xl font-extrabold">$187,099</div>
</div>

// Right-align for financial data
<div className="text-right font-mono text-sm">
  $123,456.78
</div>
```

## 🎨 Brand Application Examples

### **Louis Amy Header**
```tsx
<header className="bg-white border-b border-gray-200 px-6 py-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Logo className="h-8 w-auto" />
      <div>
        <div className="font-semibold text-gray-900">Louis Amy AE Studio</div>
        <div className="text-xs text-gray-600">Where Vision Meets Bold Innovation</div>
      </div>
    </div>
    <nav className="hidden md:flex items-center gap-6">
      <Link className="text-gray-600 hover:text-primary">Calculator</Link>
      <Link className="text-gray-600 hover:text-primary">Proposals</Link>
      <Link className="text-gray-600 hover:text-primary">Settings</Link>
    </nav>
  </div>
</header>
```

### **Premium Proposal Footer**
```tsx
<footer className="mt-16 py-8 border-t border-gray-200 text-center">
  <div className="text-sm text-gray-600 mb-2">
    Confidential Proposal — for Dr. De Jesús only
  </div>
  <div className="text-xs text-gray-500">
    Louis Amy AE Studio • Where Vision Meets Bold Innovation
  </div>
  <div className="text-xs text-gray-400 mt-2">
    Proposal valid for 30 days • louisamy.com
  </div>
</footer>
```

## 🚨 Implementation Checklist for AI Agents

### **Visual Quality Gates**
- [ ] Consistent spacing using 4pt grid system
- [ ] Proper color contrast (WCAG AA)
- [ ] Responsive breakpoints working
- [ ] Interactive states (hover, focus, active)
- [ ] Loading states for all async content
- [ ] Error states with helpful messaging

### **Brand Compliance**
- [ ] Louis Amy colors used correctly
- [ ] Typography hierarchy maintained
- [ ] Premium aesthetic throughout
- [ ] Chris Do language principles followed
- [ ] No hourly/effort language visible

### **Performance Standards**
- [ ] Images optimized and properly sized
- [ ] Charts render smoothly on mobile
- [ ] 3D models load with progress indicators
- [ ] Animations don't impact performance
- [ ] Accessibility standards met

---

**Remember:** This is a premium platform for high-net-worth clients. Every design decision should reflect the sophistication and innovation that Louis Amy AE Studio represents. Quality over speed when these conflict, but both are essential for the 24-hour deadline.
