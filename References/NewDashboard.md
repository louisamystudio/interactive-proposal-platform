Absolutely—I’m following your lead. Here’s a tight, *agent-ready* blueprint that compares the past vs. present, then prescribes a dashboard that tells a clear story from **project definition → construction budget → design fee (top-down & bottom-up) → adjustments → phase/role allocation → client options**. It’s grounded in your SSOT math and the two-app architecture already defined in the repo docs.&#x20;

---

# The narrative the dashboard must tell (in order)

1. **Project definition (context first, numbers second)**
   Show: Building Use/Type/Tier, Category, Design Level, Areas (new/existing), Site Area, Multipliers (Historic, Remodel). Then a *single sentence* framing: “This budget is a **minimum construction cost** estimate from the PR building-cost DB; fees are separate.” (Key: budget ≠ design fee.) The app already formalizes these input fields and classification mappings in the calculation engine and types.&#x20;

2. **Construction Budget (minimum cost to build from database lookups)**
   Pull min/target/max cost/ft² for New & Remodel from your cost DB; compute `newBudget`, `remodelBudget`, and `totalBudget` after multipliers. Show two visuals:

   * Donut A: **New vs Remodel** (by area share)
   * Donut B: **Budget shares**: Shell / Interior / Landscape
     The engine + schema explicitly define this flow (lookup → budgets → normalized shares), so the UI must bind directly to engine results, not re-compute.

3. **Discipline allocation (how Shell splits)**
   Within Shell, allocate Structural/Civil/Mechanical/Electrical/Plumbing/Telecom; **Architecture gets the remainder**. Cards list dollars and % of Shell, with expanders showing the New vs Remodel portions for that discipline. These formulas are already documented; the UI is pure presentation.&#x20;

4. **Design fee ≠ construction budget (explain the two non-linear views)**

   * **Top-Down (Market):** percent of construction × category multiplier → market fee.
   * **Bottom-Up (Louis Amy):** non-linear hours curve → internal cost (labor + overhead) → markup.
     The **contract price** is the **max(discounted Top-Down, Bottom-Up)**; discount is capped. Show both lenses to admins; clients see only final investment options. The formulas/guardrails are specified in the SSOT.&#x20;

5. **Adjustments for scope (what’s included vs not)**
   Admin toggles mark in-house vs consultant scopes for the market lens; the narrative should say “inclusions/exclusions refine the services being priced,” but **not** expose rates/hours to clients (Chris Do rules).&#x20;

6. **Hours distribution (admin-only diagnostics)**

   * **Phases**: Discovery (8%), Creative – Conceptual (8%), Creative – Schematic (34%), Creative – Preliminary (8%), Technical – Schematic (34%), Technical – Preliminary (8%).
   * **Roles**: Designer 1, Designer 2, Architect, Engineer, Principal (ring chart with leverage).
     These visuals explain *where* time lands, but remain internal.&#x20;

7. **Sanity check (admin-only)**
   A trio tile: **Top-Down**, **Bottom-Up**, **Contract** with variance indicator and an admin-only discount control (≤25%). The implementation pattern is called out in your UX/requirements.&#x20;

8. **Client investment (public)**
   Display **Option A/B/C** (A anchored high) with value language; show a client-safe **Investment Breakdown** donut (Scan-to-BIM, Building Shell, Interior, Landscape) but **never** hours or internal calculations. This is codified across prompts and guidelines.

---

# What the current dashboard is missing vs the old reference

From your screenshots and notes, the old app’s strength was a **storyboarded flow**: Overview → Budget → Disciplines → Fees (two lenses) → Phases/Roles → Contract → Options. The new admin page should mirror that order. If today’s `/admin/calculator` shows raw numbers without context (e.g., intermixing construction cost with design fees, lacking the two-lens explanation, or omitting phase/role visuals), align it to the sequence above so every number appears **in narrative context**. The repo already frames this two-part architecture (Admin vs Client) and the sprint plan expects these exact sections.&#x20;

---

# Component map the agent should implement (names + data they consume)

These components match your directory plan and tech stack, so multiple agents can work in parallel.

**Admin / Results Panel**

* `BudgetOverviewCard` → props from engine `budgets` (`newBudget`, `remodelBudget`, `totalBudget`, `shellBudget`, `interiorBudget`, `landscapeBudget`). Donuts for New/Remodel and Shell/Interior/Landscape.&#x20;
* `DisciplineAllocationCard` → props from engine `disciplines`; expandable New/Remodel sub-rows. Architecture = remainder.&#x20;
* `FeeComparison` → props from engine `fees` (`marketFee`, `louisAmyFee`, `contractPrice`) + admin discount slider (max 25%). Show the two labels “Top-Down” and “Bottom-Up”, plus “Contract”.&#x20;
* `HoursBreakdown` (admin) → props from engine `hours` and your fixed phase/role mappings; stacked bars (phases), ring (roles).&#x20;

**Admin / Inputs Panel**

* `ProjectSetupForm` (Use/Type/Tier, Category, Design Level);
* `AreaInputCard` (New/Existing/Site);
* `MultiplierCard` (Historic/Remodel);
* `CostRangeSliders` (min/target/max PSF with database anchors).&#x20;

**Client**

* `OptionComparison` + `OptionCard` (A/B/C with value copy);
* `InvestmentBreakdown` donut (**client-safe** buckets);
* `NiraViewer` proof section;
* `ConversionCTA`.
  Client must never see hours/rates; “A first” is mandatory.

**Charts/UI**
Use the Recharts donut/bar specs and shadcn card patterns from the design standards; keep premium, mobile-first styling.&#x20;

---

# Data & math (bind UI to SSOT—no re-calc in components)

**Budgets/discipline/hours/fees/options** already exist as the canonical outputs of the engine; components should **only render** these values:

* **Budgets & shares**: lookup PSF → `newBudget`/`remodelBudget` → normalized Shell/Interior/Landscape.&#x20;
* **Disciplines**: Shell × shares; Architecture = Shell − Σ(eng).&#x20;
* **Hours**: non-linear curve with category and New/Remodel factors (diagnostics only).&#x20;
* **Fees**: Top-Down vs Bottom-Up; Contract = max(discounted market, LA fee); capped discount.&#x20;
* **Options**: A/B/C are value-messaged fixed investments, **decoupled** from internal fee math.&#x20;

---

# Copy & labeling (tie numbers to meaning)

* **Construction budget** → “Estimated minimum cost to execute construction” (from PR building-cost DB).
* **Design fee** → “Louis Amy’s professional services to design and deliver the project.”
* **Top-Down (Market)** → “Industry-standard fee as % of construction for this category.”
* **Bottom-Up (Louis Amy)** → “Estimated time × blended internal cost (non-linear curve) → professional fee.”
* **Contract price** → “The higher of: discounted market fee or internal bottom-up fee (risk-balanced).”
* **A/B/C options (client)** → **Investments** communicated with Chris Do language—value, outcomes, risk mitigation; no hourly rates, ever.&#x20;

---

# Page layout (admin & client) the agent should implement

**Admin** (two columns; inputs left, results right):
`ProjectSetupCard` → `AreaInputCard` → `MultiplierCard` → `CostRangeSliders` | `BudgetOverviewCard` → `DisciplineAllocationCard` → `HoursBreakdown` (admin only) → `FeeComparison` → `ProposalExport`. These sections/filenames are already listed in the repo’s directory plan.&#x20;

**Client** (single, scrollable):
`PersonalizedHero` → `OptionComparison` (A first) → `ProofOfPrecision` (Nira) → `InvestmentBreakdown` (client-safe chart) → `AssumptionsPanel` (collapsed) → `ConversionCTA`. This is the expected public narrative.&#x20;

---

# DB & performance notes (for the “PR\_building\_cost” tie-in)

* Model the cost ranges & shares with the Supabase schema in the stack guide; wire budget lookups to populate min/target/max PSF and default shares.&#x20;
* Keep real-time updates with 300 ms debounce; target <100 ms calculation time in the UI.&#x20;
* Maintain the two-app boundary (Admin vs Client) and the success gates from the sprint plan.&#x20;

---

# Acceptance gates (what “done right” looks like)

* **Accuracy:** All engine outputs shown exactly (±\$100 to the Excel model where specified).&#x20;
* **Narrative:** The five questions are obvious on screen: *What are we building? What will it cost to build? What is the design fee (two lenses)? What’s included/excluded? How is time phased & who works on it?*
* **Safety:** No hours/rates on client pages; **Option A first**; value-based copy.&#x20;
* **Structure:** Components live where the directory matrix expects them so teams can parallelize.&#x20;
* **Speed & mobile:** Sub-3s on mobile; charts responsive; Nira viewer lazy-loaded.&#x20;

---

# What to change in the current admin dashboard (action list)

1. **Prominent “Project Definition” header** with Use/Type/Tier/Category/Design Level + Areas + Multipliers; add the one-line budget vs fee disclaimer. (If missing—add it.)
2. **Split “Construction Budget” from “Design Fee”** into distinct sections with tooltips that define each; never mix the two labels in one card.
3. **Add two labeled charts** right after budget: New vs Remodel (by area); Shell/Interior/Landscape (by \$).
4. **Make discipline cards a grid**; Architecture remainder computed; enable click-to-expand to show New/Remodel lines.
5. **Add “Fee Analysis” with two clear lenses** side-by-side: Top-Down (Market %) and Bottom-Up (Louis Amy hours); include a variance chip and an admin-only discount slider (≤25%).&#x20;
6. **Add “Phases & Team Leverage”** (admin-only) with a stacked phase bar and role ring; center label “Total Hours”.
7. **Lock the client output to A/B/C options** (no hours). Have a `ProposalExport` step that packages client-safe data only.&#x20;

---

# Why this is aligned with the current project and sprint

* The **two-part architecture** (Admin calculator → Client proposal) and the 24-hour sprint milestones already expect these sections and flows. This plan is the minimal path to “green.”&#x20;
* The **calculation engine** already exposes `budgets`, `disciplines`, `hours`, `fees`, and `options`; UI should just bind to them.&#x20;
* The **tech stack & components** (Next14 + shadcn/ui + Recharts + Nira embeds) and naming already exist; you’re just wiring the narrative, not inventing new math.&#x20;

---

# Quick “do-this-now” for the agent

* Scaffold (or refactor) these files per the repo’s structure:
  `components/admin/{BudgetOverviewCard,DisciplineAllocationCard,HoursBreakdown,FeeComparison,ProposalExport}.tsx`
  `components/client/{OptionComparison,InvestmentBreakdown,ConversionCTA}.tsx`
  `components/charts/{BudgetAllocationChart,PhaseTimeline}.tsx`&#x20;
* Bind each component to the SSOT outputs from `/lib/calculations.ts` (don’t re-compute in the components).&#x20;
* Enforce **client-safety** and **Option A first** per prompts and requirements.
* Validate against the **Dr. De Jesús** test case where applicable, then run your sprint checkpoints.&#x20;

---

If you want, I can turn this into issue checklists per component (with prop signatures and sample mock data) so your agent can paste and ship with zero ambiguity.


Below is an integrated report and design guideline that compares the **current deployed admin dashboard** (`spock.replit`) with the **older but more narrative‑rich example** (`louisamyproposalforluisdejesus.replit.app`).  The goal is to help the agent understand the relationship between the different data components (budget vs design fee vs services), identify the narrative flow that made the older version successful, and provide concrete recommendations for redesigning the current dashboard.

---

## 1. Narrative flow: how the old dashboard guides users

The older dashboard is successful because it tells a clear story, moving from **context to cost to fee to final proposal**.  Each section answers a specific question in order:

1. **Project definition** – Building type, category, design level, building area and site area.  It tells users what they are evaluating and frames everything that follows.
2. **Construction budget** – It distinguishes **construction cost** (the minimum cost to build, pulled from the `pr_construction_cost_index` database) from **design fees**.  It shows min/target/max cost‑per‑ft² sliders and calculates total budget and Shell/Interior/Landscape shares.  A donut chart displays New vs Remodel percentages and Shell/Interior/Landscape shares.
3. **Construction budget allocation** – Budgets are allocated across Architecture, Interior, Landscape and the engineering disciplines (Structural, Civil, Mechanical, Electrical, Plumbing, Telecom).  Architecture receives the remainder after subtracting the other disciplines.  Each card shows dollars and percentage share.
4. **Fee analysis (design fees)** – Two non‑linear fee models are compared:

   * **Top‑Down (Market)**: fee as a percentage of construction cost, adjusted by the building category; hours are implied by industry benchmarks.
   * **Bottom‑Up (Louis Amy)**: fee derived from estimated hours (non‑linear curve vs. area and category) multiplied by a blended labor + overhead rate.
     A table of scopes shows market fee and hours per scope with in‑house vs consultant toggles, and a second table shows hours and total cost per team member.
5. **Project phases & team leverage** – A bar chart breaks down total hours by phase (Discovery, Creative Conceptual, Creative Schematic, Creative Preliminary, Technical Schematic, Technical Preliminary) and a donut shows how those hours are distributed across Designer 1, Designer 2, Architect, Engineer and Principal.
6. **Sanity check & pricing** – A trio of cards compares Top‑Down vs Bottom‑Up vs Final Contract Price.  A slider lets the admin apply a discount (up to 25 %), and the contract price is set to the **higher of discounted market fee or Louis Amy fee**.  This section emphasises that **construction cost and design fee are separate**.
7. **Investment summary & options** – The final section translates the fee analysis into **client options (A/B/C)** with clear investment amounts and included services.  It compares market rate, Louis Amy price and final contract price, shows a savings figure and lists in‑house services.  It never exposes hourly rates to clients, consistent with the requirement that the proposal be value‑messaged.

This narrative explains to clients: (1) what the project is, (2) how much it will cost to build, (3) how much Louis Amy charges to design it, and (4) what value options they have.

---

## 2. What the current admin dashboard lacks

The new dashboard on `spock.replit` has modern styling and a working calculation engine but misses much of the narrative above:

* **No clear separation between construction cost and design fee.**  It shows a “Total Budget” and a “Contract Price” but does not explain that the budget is a minimum construction cost from the cost database while the contract price is the design fee.  There is no top‑down vs bottom‑up comparison and no discount slider.
* **Missing fee tables and phase breakdown.**  The current version has a budget breakdown and discipline chart, but it does not display market fees by scope, hours by team member, phase distribution or team leverage.  Without these, the user cannot see how the design fee is derived or how hours are allocated.
* **Limited narrative ordering.**  The current page shows inputs, budget, engineering disciplines and “Option A” in one panel, but it lacks a logical flow: project definition → budget → fee comparison → final pricing → options.
* **No internal/external toggle for services.**  The older version let admins switch certain scopes to consultant mode, which reduced hours and highlighted excluded services.
* **No explanation of category multipliers or design-level effects.**  The current page uses database defaults but doesn’t tell the user why “Category 5” yields a 1.3× multiplier or how design level affects budget and fee shares.

Without these elements, numbers appear disconnected, making it hard for the agent to understand “what does this \$142,688 represent?” or “why is Option A larger than Option B?”.

---

## 3. Guidelines for redesigning the current dashboard

To align the new dashboard with the proven narrative of the older version (while keeping the updated architecture and SSOT math), the following guidelines should be implemented:

### A. Structure & flow

1. **Project definition panel** at the top: show Building Use/Type/Tier, Category, Design Level, New vs Existing area, Site area and multipliers.  Include a short disclaimer: *“Construction cost estimates come from the PR building-cost database; design fees are calculated separately.”*
2. **Construction Budget section**:

   * **Cost range sliders** for new and remodel cost/ft², showing min/target/max anchored to the cost database.
   * **Total budget and share cards** for Shell, Interior and Landscape with a donut chart (66 % / 22 % / 12 % by default).
   * **Engineering discipline grid**: allocate the Shell budget across Architecture (remainder) and the six engineering disciplines; each card expands to show new vs remodel amounts.
3. **Design Fee Analysis section (admin‑only)**:

   * **Top‑Down vs Bottom‑Up tables**: show market fee and hours by scope on the left and hours & cost by team member on the right.  Let admins toggle scopes between in‑house and consultant to see the effect on hours and cost.
   * **Project phases & team leverage**: replicate the bar chart and donut for phase distribution and team hours.  Keep this hidden in the client proposal.
   * **Sanity Check & Pricing**: display Top‑Down total, Bottom‑Up total and the current Contract Price.  Include a discount slider (0–25 %) that updates the final price as `max(marketFee × (1 − discount), louisAmyFee)`.
4. **Client Options & Summary**:

   * Generate fixed Option A/B/C cards with investment amounts, scopes and exclusions.  Always show Option A first as the premium anchor and avoid any hourly or cost breakdown.
   * Present an **Investment Breakdown donut** (Scan‑to‑BIM, Building Shell, Interior, Landscape) and a bullet list of included in‑house services.
   * Show Market Rate, Louis Amy Price and Final Contract Price side‑by‑side with savings highlighted.
   * End with a compelling CTA panel (“Why choose Louis Amy Engineering?”) and buttons to accept or schedule a consultation.

### B. Visual & interaction design

* **Maintain modern UI but adopt narrative hierarchy** – Use cards, headings and collapsible panels to guide the user through the story.  The cost sliders and discipline cards should remain interactive, but complex fee/phase charts should only appear on the admin side.
* **Emphasize definitions** – Label sections clearly: *Construction Budget (minimum cost)* vs *Design Fee* vs *Investment Options*.  Provide tooltips explaining category multipliers, design levels and how budgets are split.
* **Prevent data recomputation in the UI** – All values (budgets, shares, disciplines, hours, fees, options) should come directly from the calculation engine, respecting the SSOT formulas and calibration modes.  Do not recalculate percentages in React components.
* **Ensure client safety** – Never display hours, rates or internal fee formulas in the proposal view.  Keep the discount slider, variance and phase distribution only in the admin view.

### C. Data integration & back‑end considerations

* **Continue using the Supabase cost database** for min/target/max cost/ft² and discipline shares.  Surface read‑only vs override states (as the current dashboard does) but hide them from clients.
* **Bind Top‑Down fees to category multipliers** and design level; bind Bottom‑Up fees to the non‑linear hours curve and current labor/overhead rates.
* **Keep calibration modes** – The engine already supports “EXCEL” and “SSOT” modes; the UI should simply display whichever values the engine provides and label them accordingly.

---

## 4. Summary for the agent

The core message is that **construction cost and design fee are different**: the construction cost is a minimum estimate from the cost database, whereas the design fee is calculated from two non‑linear models (market % vs hours).  The dashboard must tell that story clearly.  By following the narrative flow (project definition → construction budget → fee analysis → sanity check → investment options) and adopting the proven visual layout from the older dashboard, the new version can both honour the updated code structure and deliver a coherent experience that users can understand.
