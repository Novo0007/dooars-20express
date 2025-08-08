#!/usr/bin/env node

// Production readiness checker
const fs = require('fs')
const path = require('path')

const errors = []
const warnings = []

console.log('🔍 Checking production readiness...\n')

// Check environment variables
const envPath = path.join(__dirname, '../.env')
if (!fs.existsSync(envPath)) {
  errors.push('Missing .env file')
} else {
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  // Check for required variables
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_RAZORPAY_KEY_ID',
    'VITE_APP_NAME',
    'VITE_APP_URL'
  ]
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      errors.push(`Missing environment variable: ${varName}`)
    }
  })
  
  // Check for demo/test values
  if (envContent.includes('your-project.supabase.co')) {
    errors.push('Using demo Supabase URL')
  }
  
  if (envContent.includes('your-anon-key')) {
    errors.push('Using demo Supabase key')
  }
  
  if (envContent.includes('rzp_test_')) {
    warnings.push('Using Razorpay test key - switch to live key for production')
  }
}

// Check for console.log statements
const srcPath = path.join(__dirname, '../src')
function checkFile(filePath) {
  if (filePath.endsWith('.vue') || filePath.endsWith('.ts') || filePath.endsWith('.js')) {
    const content = fs.readFileSync(filePath, 'utf8')
    
    // Check for console statements
    const consoleMatches = content.match(/console\.(log|warn|error|debug)/g)
    if (consoleMatches && consoleMatches.length > 0) {
      warnings.push(`Console statements found in ${filePath.replace(srcPath, 'src')}: ${consoleMatches.length} instances`)
    }
    
    // Check for alert statements
    const alertMatches = content.match(/alert\(/g)
    if (alertMatches && alertMatches.length > 0) {
      errors.push(`Alert statements found in ${filePath.replace(srcPath, 'src')}: ${alertMatches.length} instances`)
    }
    
    // Check for TODO comments
    const todoMatches = content.match(/TODO:|FIXME:|HACK:/gi)
    if (todoMatches && todoMatches.length > 0) {
      warnings.push(`TODO/FIXME comments found in ${filePath.replace(srcPath, 'src')}: ${todoMatches.length} instances`)
    }
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDir(filePath)
    } else if (stat.isFile()) {
      checkFile(filePath)
    }
  })
}

if (fs.existsSync(srcPath)) {
  walkDir(srcPath)
}

// Check package.json for demo dependencies
const packagePath = path.join(__dirname, '../package.json')
if (fs.existsSync(packagePath)) {
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  
  // Check for development dependencies in production
  if (packageContent.dependencies) {
    Object.keys(packageContent.dependencies).forEach(dep => {
      if (dep.includes('mock') || dep.includes('fake') || dep.includes('demo')) {
        warnings.push(`Potential demo dependency: ${dep}`)
      }
    })
  }
}

// Check for demo files
const demoFiles = [
  'db.json',
  'mock-data.json',
  'test-data.json'
]

demoFiles.forEach(file => {
  const filePath = path.join(__dirname, `../${file}`)
  if (fs.existsSync(filePath)) {
    warnings.push(`Demo file found: ${file} - consider removing for production`)
  }
})

// Display results
console.log('📊 Production Readiness Report')
console.log('==============================\n')

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed! Your app is production-ready.\n')
} else {
  if (errors.length > 0) {
    console.log('❌ ERRORS (must fix before production):')
    errors.forEach(error => console.log(`   • ${error}`))
    console.log('')
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS (recommended to fix):')
    warnings.forEach(warning => console.log(`   �� ${warning}`))
    console.log('')
  }
}

console.log(`Summary: ${errors.length} errors, ${warnings.length} warnings`)

// Exit with error code if there are errors
if (errors.length > 0) {
  process.exit(1)
} else {
  process.exit(0)
}
