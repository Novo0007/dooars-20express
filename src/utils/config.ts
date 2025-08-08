// Production configuration utilities

export interface ConfigValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export const validateEnvironment = (): ConfigValidation => {
  const errors: string[] = []
  const warnings: string[] = []

  // Check required environment variables
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_RAZORPAY_KEY_ID',
    'VITE_APP_NAME',
    'VITE_APP_URL',
  ]

  requiredEnvVars.forEach((varName) => {
    const value = import.meta.env[varName]
    if (
      !value ||
      value === 'your-project.supabase.co' ||
      value === 'your-anon-key' ||
      value === 'rzp_test_sample'
    ) {
      errors.push(`Missing or invalid environment variable: ${varName}`)
    }
  })

  // Check for test/demo values
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
  if (razorpayKey && razorpayKey.startsWith('rzp_test_')) {
    warnings.push('Using Razorpay test key - switch to live key for production')
  }

  // Check Supabase URL format
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  if (supabaseUrl && !supabaseUrl.includes('.supabase.co')) {
    warnings.push('Supabase URL format appears invalid')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

export const isProduction = (): boolean => {
  return import.meta.env.PROD
}

export const isDevelopment = (): boolean => {
  return import.meta.env.DEV
}

export const getAppConfig = () => {
  return {
    name: import.meta.env.VITE_APP_NAME || 'Dooars Express',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE,
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL,
      hasValidKey:
        !!import.meta.env.VITE_SUPABASE_ANON_KEY &&
        import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your-anon-key',
    },
    razorpay: {
      keyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
      isLive: import.meta.env.VITE_RAZORPAY_KEY_ID?.startsWith('rzp_live_'),
    },
  }
}

export const logConfigStatus = () => {
  const validation = validateEnvironment()
  const config = getAppConfig()

  console.group('🔧 App Configuration')
  console.log('Environment:', config.environment)
  console.log('App Name:', config.name)
  console.log('App URL:', config.url)
  console.log('Supabase configured:', config.supabase.hasValidKey)
  console.log('Razorpay mode:', config.razorpay.isLive ? 'LIVE' : 'TEST')

  if (validation.errors.length > 0) {
    console.group('❌ Configuration Errors')
    validation.errors.forEach((error) => console.error(error))
    console.groupEnd()
  }

  if (validation.warnings.length > 0) {
    console.group('⚠️ Configuration Warnings')
    validation.warnings.forEach((warning) => console.warn(warning))
    console.groupEnd()
  }

  console.groupEnd()

  return validation
}
