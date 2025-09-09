// scripts/switch-calibration-mode.ts - Switch between EXCEL and SSOT calibration modes
import fs from 'fs'
import path from 'path'

type Mode = 'EXCEL' | 'SSOT'

const CONSTANTS_FILE = path.join(process.cwd(), 'lib', 'constants.ts')

function getCurrentMode(): Mode | null {
  try {
    const content = fs.readFileSync(CONSTANTS_FILE, 'utf-8')
    const modeMatch = content.match(/export const MODE: Mode = '(EXCEL|SSOT)'/)
    return modeMatch ? modeMatch[1] as Mode : null
  } catch {
    return null
  }
}

function switchMode(newMode: Mode) {
  try {
    let content = fs.readFileSync(CONSTANTS_FILE, 'utf-8')
    content = content.replace(
      /export const MODE: Mode = '(EXCEL|SSOT)'/,
      `export const MODE: Mode = '${newMode}'`
    )
    fs.writeFileSync(CONSTANTS_FILE, content)
    return true
  } catch (error) {
    console.error('❌ Error switching mode:', error)
    return false
  }
}

function showModeComparison() {
  console.log('📊 Calibration Mode Comparison:\n')
  
  console.log('🏢 EXCEL Mode (Original Excel Model):')
  console.log('  • Total Hours: 1,184')
  console.log('  • Contract Price: $137,743.50')
  console.log('  • HFA_OFFSET: 0.0719 (calibrated)')
  console.log('  • MARKET_FEE_RATE: 0.164395 (calibrated)')
  console.log('  • MARKUP: 1.40 (calibrated)')
  console.log('  • Use for: Matching original Excel spreadsheet exactly\n')
  
  console.log('⚙️ SSOT Mode (App Calculation Constants):')
  console.log('  • Total Hours: 1,148.27')
  console.log('  • Contract Price: $187,925.55')  
  console.log('  • HFA_OFFSET: 0.08 (standard)')
  console.log('  • MARKET_FEE_RATE: 0.178025631 (standard)')
  console.log('  • MARKUP: 2.0 (standard)')
  console.log('  • Use for: New app development with consistent constants\n')
  
  console.log('📋 Dr. De Jesús Project (Both Modes):')
  console.log('  • Building: Custom Houses, Category 5')
  console.log('  • Area: 4,407 ft² existing (corrected: remodelMultiplier = 1.0)')
  console.log('  • Total Budget: $859,365')
  console.log('  • Shell/Interior/Landscape: 66%/22%/12%\n')
  
  console.log('🎯 Client Options (Same in Both Modes):')
  console.log('  • Option A: $187,099 (premium anchor)')
  console.log('  • Option B: $126,636 (collaborative)')
  console.log('  • Option C: $87,898 (foundation)')
  console.log('  • Note: Decoupled from contract calculations\n')
}

function main() {
  const args = process.argv.slice(2)
  const command = args[0]
  
  if (command === 'show' || !command) {
    showModeComparison()
    const currentMode = getCurrentMode()
    console.log(`📍 Current Mode: ${currentMode || 'UNKNOWN'}\n`)
    
    if (!command) {
      console.log('Commands:')
      console.log('  npm run calibration:excel    Switch to EXCEL mode')
      console.log('  npm run calibration:ssot     Switch to SSOT mode')
      console.log('  npm run calibration:show     Show this comparison')
      console.log('  npm run test calculations    Validate current mode')
    }
    return
  }

  if (command === 'excel') {
    const currentMode = getCurrentMode()
    if (currentMode === 'EXCEL') {
      console.log('✅ Already in EXCEL mode')
      return
    }
    
    if (switchMode('EXCEL')) {
      console.log('✅ Switched to EXCEL mode')
      console.log('📊 Now matching: Hours=1,184, Contract=$137,743.50')
      console.log('🔄 Run: npm test calculations')
    }
    return
  }

  if (command === 'ssot') {
    const currentMode = getCurrentMode()
    if (currentMode === 'SSOT') {
      console.log('✅ Already in SSOT mode')
      return
    }
    
    if (switchMode('SSOT')) {
      console.log('✅ Switched to SSOT mode')
      console.log('📊 Now matching: Hours=1,148.27, Contract=$187,925.55')
      console.log('🔄 Run: npm test calculations')
    }
    return
  }

  console.error('❌ Unknown command. Use: excel, ssot, or show')
  process.exit(1)
}

main()
