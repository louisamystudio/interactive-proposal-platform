# Start development of the app
_Exported on 9/9/2025 at 00:08:12 GMT-4 from Cursor (1.5.11)_

---

**User**

@AI_AGENT_MASTER_PROMPT.md @AI_AGENT_PROMPTS.md @APP_LOGIC.md @DESIGN_GUIDELINES.md @DEVELOPMENT_STRATEGY.md @REQUIREMENTS.md @DIRECTORY_STRUCTURE.md @REFERENCE_LEGEND.md @TECH_STACK.md @calculations.ts @types.ts @calibrate-from-excel.ts @calculations.test.ts @DEPLOYMENT_CHECKLIST.md @DEVELOPMENT_PACKAGE_SUMMARY.md @EXECUTIVE_SUMMARY.md @package.json @project-config.json @QUICK_START.md @README.md @SSOT_ALIGNMENT_COMPLETE.md 

start development of this app! do you have any questions? 

---

**Cursor**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

module.exports = nextConfig
```

```jsonc
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/styles/*": ["./styles/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

```typescriptreact
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Louis Amy AE Studio - Interactive Proposals',
  description: 'Premium architectural engineering proposals with interactive 3D models and value-based pricing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Louis Amy Brand Colors */
    --primary: 43 89 255; /* #2B59FF */
    --primary-foreground: 255 255 255;
    --primary-50: 235 242 255;
    --primary-100: 209 226 255;
    --primary-500: 43 89 255;
    --primary-600: 30 64 191;
    --primary-900: 15 31 92;

    --success: 0 200 150; /* #00C896 */
    --success-foreground: 255 255 255;
    --success-50: 236 253 248;
    --success-100: 209 250 229;

    --accent: 255 107 53; /* #FF6B35 */
    --accent-foreground: 255 255 255;
    --accent-50: 255 247 237;
    --accent-100: 255 237 213;

    /* Neutral Colors */
    --background: 250 251 252; /* #FAFBFC */
    --foreground: 31 41 55; /* #1F2937 */
    --card: 255 255 255;
    --card-foreground: 31 41 55;
    --popover: 255 255 255;
    --popover-foreground: 31 41 55;
    --secondary: 243 244 246;
    --secondary-foreground: 31 41 55;
    --muted: 243 244 246;
    --muted-foreground: 107 114 128;
    --accent: 243 244 246;
    --destructive: 239 68 68;
    --destructive-foreground: 255 255 255;
    --border: 229 231 235;
    --input: 229 231 235;
    --ring: 43 89 255;

    /* Typography */
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}

/* Focus styles for accessibility */
.focus-ring:focus-visible {
  @apply outline-none ring-2 ring-primary ring-offset-2;
}
```

```typescriptreact
import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to admin calculator as the main entry point
  redirect('/admin/calculator')
}
```

```typescriptreact
'use client'

import { useState } from 'react'
import { calculateProject, DR_DE_JESUS_PROJECT } from '@/lib/calculations'
import { CalculationResults } from '@/lib/types'

export default function AdminCalculatorPage() {
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      // For now, use the Dr. De Jesús project as our test case
      const calculatedResults = calculateProject(DR_DE_JESUS_PROJECT)
      setResults(calculatedResults)
    } catch (error) {
      console.error('Calculation error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Louis Amy AE Studio - Proposal Calculator
          </h1>
          <p className="text-gray-600">
            Generate accurate architectural engineering proposals with Chris Do value-based pricing
          </p>
        </div>

        {/* Calculator Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Project Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Building Type
              </label>
              <p className="text-sm text-gray-500">
                {DR_DE_JESUS_PROJECT.classification.buildingType}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area (sq ft)
              </label>
              <p className="text-sm text-gray-500">
                {DR_DE_JESUS_PROJECT.areas.existingAreaFt2.toLocaleString()} existing
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <p className="text-sm text-gray-500">
                {DR_DE_JESUS_PROJECT.classification.category} (Very High Complexity)
              </p>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
          >
            {loading ? 'Calculating...' : 'Calculate Proposal'}
          </button>
        </div>

        {/* Results Display */}
        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Budget Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Budget Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Budget:</span>
                  <span className="font-semibold">${results.budgets.totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shell (66%):</span>
                  <span>${results.budgets.shellBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Interior (22%):</span>
                  <span>${results.budgets.interiorBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Landscape (12%):</span>
                  <span>${results.budgets.landscapeBudget.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Fee Structure */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Fee Structure</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Market Fee:</span>
                  <span className="font-semibold">${results.fees.marketFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contract Price:</span>
                  <span className="font-semibold text-green-600">${results.fees.contractPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Hours:</span>
                  <span>{results.hours.totalHours.toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* Three Options */}
            <div className="bg-white rounded-lg shadow-sm border p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Client Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(results.options).map(([key, option]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-blue-600 mb-2">Option {key}</h4>
                    <div className="text-2xl font-bold mb-2">
                      ${option.investment.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{option.valuePromise}</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      {option.scope.slice(0, 3).map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

```typescriptreact
'use client'

import { useState } from 'react'
import { calculateProject, DR_DE_JESUS_PROJECT } from '@/lib/calculations'
import { CalculationResults } from '@/lib/types'

interface ProposalPageProps {
  params: { token: string }
}

export default function ProposalPage({ params }: ProposalPageProps) {
  const [results] = useState<CalculationResults>(() =>
    calculateProject(DR_DE_JESUS_PROJECT)
  )
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Louis Amy AE Studio
            </h1>
            <p className="text-gray-600">Where Vision Meets Bold Innovation</p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, Dr. Luis De Jesús
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your vision for a legacy residence at Mansion del Lago, meticulously brought to life
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <div className="font-semibold">4,407 sq ft</div>
              <div>Existing Area</div>
            </div>
            <div>
              <div className="font-semibold">Category 5</div>
              <div>Complexity Rating</div>
            </div>
            <div>
              <div className="font-semibold">$859,365</div>
              <div>Total Budget</div>
            </div>
          </div>
        </div>
      </div>

      {/* Three Options */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Investment Level
          </h3>
          <p className="text-lg text-gray-600">
            Three carefully crafted options to bring your vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {Object.entries(results.options).map(([key, option]) => (
            <div
              key={key}
              className={`bg-white rounded-lg shadow-sm border-2 p-8 ${
                selectedOption === key ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
              }`}
            >
              {/* Recommended Badge for Option A */}
              {key === 'A' && (
                <div className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                  Recommended
                </div>
              )}

              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Option {key}</h4>
                <div className="text-4xl font-extrabold text-blue-600 mb-2">
                  ${option.investment.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Fixed Investment</div>
              </div>

              <div className="mb-6">
                <h5 className="font-semibold text-gray-900 mb-3">What's Included:</h5>
                <ul className="space-y-2">
                  {option.scope.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {option.excluded.length > 0 && (
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900 mb-3">Not Included:</h5>
                  <ul className="space-y-2">
                    {option.excluded.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm text-gray-600 italic">
                  "{option.valuePromise}"
                </p>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setSelectedOption(key as 'A' | 'B' | 'C')}
                  className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
                    selectedOption === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedOption === key ? 'Selected' : 'Select Option'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Option Actions */}
        {selectedOption && (
          <div className="mt-12 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-2xl mx-auto">
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Ready to move forward with Option {selectedOption}?
              </h4>
              <p className="text-gray-600 mb-6">
                Your investment of ${results.options[selectedOption].investment.toLocaleString()} will bring your vision to life with unparalleled precision and peace of mind.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors">
                  Accept & Reserve Studio Window
                </button>
                <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">
                  Ask a Question
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            Confidential Proposal — for Dr. Luis De Jesús only • Valid for 30 days
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Louis Amy AE Studio • Where Vision Meets Bold Innovation
          </p>
        </div>
      </div>
    </div>
  )
}
```

```typescriptreact
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
```

```typescriptreact
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    // Handle module aliases (this will be automatically configured for you based on your tsconfig.json paths)
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

```javascript
// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
```

```jsonc
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6", "es2017"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/styles/*": ["./styles/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```

