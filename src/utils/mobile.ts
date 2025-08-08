// Mobile and responsive utilities for Indian mobile-first design

export const useResponsive = () => {
  // Detect mobile device
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  // Get screen size category
  const getScreenSize = () => {
    const width = window.innerWidth
    if (width < 640) return 'xs' // < 640px
    if (width < 768) return 'sm' // 640px - 768px
    if (width < 1024) return 'md' // 768px - 1024px
    if (width < 1280) return 'lg' // 1024px - 1280px
    return 'xl' // > 1280px
  }

  // Check if user prefers reduced motion (accessibility)
  const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  // Get optimal touch target size for Indian users (44px minimum)
  const getTouchTargetSize = () => {
    return isMobile() ? 'min-h-[44px] min-w-[44px]' : 'min-h-[40px] min-w-[40px]'
  }

  // Get optimal font size for Indian mobile users
  const getFontSize = (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl') => {
    const mobile = isMobile()
    const sizeMap = {
      xs: mobile ? 'text-sm' : 'text-xs',
      sm: mobile ? 'text-base' : 'text-sm', 
      base: mobile ? 'text-lg' : 'text-base',
      lg: mobile ? 'text-xl' : 'text-lg',
      xl: mobile ? 'text-2xl' : 'text-xl'
    }
    return sizeMap[size]
  }

  // Get optimal spacing for mobile
  const getSpacing = (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl') => {
    const mobile = isMobile()
    const sizeMap = {
      xs: mobile ? 'p-2' : 'p-1',
      sm: mobile ? 'p-3' : 'p-2',
      base: mobile ? 'p-4' : 'p-3',
      lg: mobile ? 'p-6' : 'p-4',
      xl: mobile ? 'p-8' : 'p-6'
    }
    return sizeMap[size]
  }

  return {
    isMobile,
    getScreenSize,
    prefersReducedMotion,
    getTouchTargetSize,
    getFontSize,
    getSpacing
  }
}

// Indian-specific mobile utilities
export const useIndianMobile = () => {
  // Common Indian phone number formats
  const formatIndianPhoneNumber = (phone: string) => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '')
    
    // Handle different formats
    if (digits.length === 10) {
      // Format: 98765 43210
      return `${digits.slice(0, 5)} ${digits.slice(5)}`
    } else if (digits.length === 12 && digits.startsWith('91')) {
      // Format: +91 98765 43210
      return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`
    }
    
    return phone // Return original if can't format
  }

  // Indian rupee formatting
  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  }

  // Indian address formatting helpers
  const formatIndianAddress = (address: {
    building?: string
    street?: string
    area?: string
    city: string
    state: string
    pincode: string
  }) => {
    const parts = []
    if (address.building) parts.push(address.building)
    if (address.street) parts.push(address.street)
    if (address.area) parts.push(address.area)
    parts.push(address.city)
    parts.push(address.state)
    parts.push(address.pincode)
    
    return parts.filter(Boolean).join(', ')
  }

  // Validate Indian PIN code
  const validatePincode = (pincode: string) => {
    const pincodeRegex = /^[1-9][0-9]{5}$/
    return pincodeRegex.test(pincode)
  }

  // Get popular Indian banks for UPI
  const getIndianBanks = () => [
    { name: 'State Bank of India', upiHandle: '@sbi' },
    { name: 'HDFC Bank', upiHandle: '@hdfc' },
    { name: 'ICICI Bank', upiHandle: '@icici' },
    { name: 'Axis Bank', upiHandle: '@axis' },
    { name: 'Punjab National Bank', upiHandle: '@pnb' },
    { name: 'Bank of Baroda', upiHandle: '@bob' },
    { name: 'Canara Bank', upiHandle: '@canara' },
    { name: 'Union Bank of India', upiHandle: '@unionbank' },
    { name: 'IDBI Bank', upiHandle: '@idbi' },
    { name: 'Yes Bank', upiHandle: '@yes' }
  ]

  // Get Indian states and UTs
  const getIndianStates = () => [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ]

  return {
    formatIndianPhoneNumber,
    formatIndianCurrency,
    formatIndianAddress,
    validatePincode,
    getIndianBanks,
    getIndianStates
  }
}

// Responsive breakpoint utilities matching Tailwind
export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}

// Common mobile-first responsive classes
export const responsiveClasses = {
  container: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
  card: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden',
  button: 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  input: 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:border-blue-500',
  modal: 'fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20',
  modalContent: 'mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all'
}
