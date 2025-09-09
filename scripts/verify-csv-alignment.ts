// scripts/verify-csv-alignment.ts
// Compare our calculation engine against values in Final Project Cost Calculator .csv

import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { calculateProject, DR_DE_JESUS_PROJECT, VALIDATION_TARGETS } from '../lib/calculations'

function extract(csvPath: string) {
  const raw = fs.readFileSync(csvPath, 'utf-8')
  const records: string[][] = parse(raw, { skip_empty_lines: false })
  const map = new Map<string, string>()
  for (const row of records) {
    const key = (row[0] || '').trim()
    const val = (row[1] || '').trim()
    if (key) map.set(key, val)
  }
  const findVal = (want: string) => {
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    const wantN = norm(want)
    const entries = Array.from(map.entries())
    for (const [k, v] of entries) {
      if (norm(k) === wantN) return v
    }
    for (const [k, v] of entries) {
      if (norm(k).startsWith(wantN)) return v
    }
    return ''
  }
  const getNum = (k: string) => {
    const raw = findVal(k)
    const num = Number((raw || '').toString().replace(/,/g, ''))
    return Number.isFinite(num) ? num : NaN
  }
  return {
    totalBudget: getNum('Total Budget'),
    shellBudget: getNum('Building Shell Minimum Total Budget'),
    interiorBudget: getNum('Interior Minimum Budget'),
    landscapeBudget: getNum('Landscape Minimum Budget'),
    categoryMultiplier: Number(map.get('Category Multiplier') || '0'),
    marketFeeRate: (() => {
      const v = findVal('Architecture (Design + Consultant Admin.)')
      const first = (v || '').split(',')[0]
      const n = Number(first)
      return Number.isFinite(n) ? n : NaN
    })(),
  }
}

function close(a: number, b: number, tol = 1e-2) {
  return Math.abs(a - b) <= tol
}

function main() {
  const csv = path.join(process.cwd(), 'References', 'Final Project Cost Calculator .csv')
  if (!fs.existsSync(csv)) {
    console.error('CSV not found:', csv)
    process.exit(1)
  }
  const extracted = extract(csv)
  const result = calculateProject(DR_DE_JESUS_PROJECT)

  console.log('CSV vs Engine Comparison')
  console.log('========================')
  console.log(`Total Budget:   csv=${extracted.totalBudget} engine=${result.budgets.totalBudget}`)
  console.log(`Shell Budget:   csv=${extracted.shellBudget} engine=${result.budgets.shellBudget}`)
  console.log(`Interior:       csv=${extracted.interiorBudget} engine=${result.budgets.interiorBudget}`)
  console.log(`Landscape:      csv=${extracted.landscapeBudget} engine=${result.budgets.landscapeBudget}`)
  console.log(`Category Mult.: csv=${extracted.categoryMultiplier} engine=${VALIDATION_TARGETS ? 'configured' : 'n/a'}`)
  console.log(`Market Fee %:   csv=${extracted.marketFeeRate}`)
  console.log('')

  const ok =
    close(extracted.totalBudget, result.budgets.totalBudget, 1) &&
    close(extracted.shellBudget, result.budgets.shellBudget, 0.1) &&
    close(extracted.interiorBudget, result.budgets.interiorBudget, 0.1) &&
    close(extracted.landscapeBudget, result.budgets.landscapeBudget, 0.1)

  console.log(`Alignment: ${ok ? 'PASS' : 'FAIL'}`)
  process.exit(ok ? 0 : 1)
}

main()
