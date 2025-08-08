// Currency conversion utilities for Indian market

export interface CurrencyConversion {
  from: string
  to: string
  rate: number
  lastUpdated: Date
}

// Approximate USD to INR conversion rate (should be updated with real-time rates in production)
const USD_TO_INR_RATE = 83.12 // As of 2024

export const formatIndianRupee = (
  amount: number,
  options?: {
    showSymbol?: boolean
    precision?: number
    abbreviated?: boolean
  },
): string => {
  const { showSymbol = true, precision = 0, abbreviated = false } = options || {}

  // Handle abbreviated format for large numbers (Indian numbering system)
  if (abbreviated && amount >= 100000) {
    if (amount >= 10000000) {
      // 1 crore
      const crores = amount / 10000000
      return `${showSymbol ? '₹' : ''}${crores.toFixed(1)}Cr`
    } else if (amount >= 100000) {
      // 1 lakh
      const lakhs = amount / 100000
      return `${showSymbol ? '₹' : ''}${lakhs.toFixed(1)}L`
    }
  }

  // Use Indian numbering system (lakh, crore)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'INR',
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })

  const formatted = formatter.format(amount)

  // If not showing symbol but using currency formatter, remove the symbol
  if (!showSymbol && formatted.includes('₹')) {
    return formatted.replace('₹', '').trim()
  }

  return formatted
}

export const convertUSDToINR = (usdAmount: number): number => {
  return Math.round(usdAmount * USD_TO_INR_RATE)
}

export const convertINRToUSD = (inrAmount: number): number => {
  return Math.round((inrAmount / USD_TO_INR_RATE) * 100) / 100
}

// Convert all USD prices in the app to INR
export const convertPriceToINR = (priceInUSD: number): number => {
  if (!priceInUSD || isNaN(priceInUSD)) return 0
  return convertUSDToINR(priceInUSD)
}

// Format price for display throughout the app
export const formatPrice = (
  price: number,
  options?: {
    showCurrency?: boolean
    abbreviated?: boolean
    precision?: number
  },
): string => {
  const { showCurrency = true, abbreviated = false, precision = 0 } = options || {}

  // Convert USD to INR if needed (legacy data might still be in USD)
  const inrPrice = price < 1000 ? convertPriceToINR(price) : price

  return formatIndianRupee(inrPrice, {
    showSymbol: showCurrency,
    abbreviated,
    precision,
  })
}

// Hotel price ranges for Indian market
export const indianPriceRanges = [
  { label: 'Budget', min: 1000, max: 3000 },
  { label: 'Mid-range', min: 3000, max: 7000 },
  { label: 'Luxury', min: 7000, max: 15000 },
  { label: 'Premium', min: 15000, max: 50000 },
  { label: 'Ultra-luxury', min: 50000, max: null },
]

// Get price range label
export const getPriceRangeLabel = (price: number): string => {
  const range = indianPriceRanges.find(
    (range) => price >= range.min && (range.max === null || price <= range.max),
  )
  return range?.label || 'Premium'
}

// Tax calculations for Indian hospitality industry
export const calculateIndianTaxes = (
  baseAmount: number,
): {
  baseAmount: number
  cgst: number
  sgst: number
  totalTax: number
  finalAmount: number
} => {
  // Hotel rooms in India attract 12% GST (6% CGST + 6% SGST)
  const gstRate = 0.12
  const cgst = Math.round(baseAmount * 0.06)
  const sgst = Math.round(baseAmount * 0.06)
  const totalTax = cgst + sgst

  return {
    baseAmount,
    cgst,
    sgst,
    totalTax,
    finalAmount: baseAmount + totalTax,
  }
}

// Price suggestions for hotel booking based on Indian market
export const getRecommendedPrices = (basePrice: number) => {
  const taxes = calculateIndianTaxes(basePrice)

  return {
    basePrice: taxes.baseAmount,
    withTaxes: taxes.finalAmount,
    formatted: {
      base: formatPrice(taxes.baseAmount),
      withTaxes: formatPrice(taxes.finalAmount),
      taxes: formatPrice(taxes.totalTax),
    },
    breakdown: {
      base: `Base Rate: ${formatPrice(taxes.baseAmount)}`,
      cgst: `CGST (6%): ${formatPrice(taxes.cgst)}`,
      sgst: `SGST (6%): ${formatPrice(taxes.sgst)}`,
      total: `Total: ${formatPrice(taxes.finalAmount)}`,
    },
  }
}

// Format price per night for hotel listings
export const formatPricePerNight = (price: number): string => {
  const inrPrice = price < 1000 ? convertPriceToINR(price) : price
  return `${formatPrice(inrPrice)}/night`
}

// Format price range for search filters
export const formatPriceRange = (min: number, max: number): string => {
  const minINR = min < 1000 ? convertPriceToINR(min) : min
  const maxINR = max < 1000 ? convertPriceToINR(max) : max

  return `${formatPrice(minINR)} - ${formatPrice(maxINR)}`
}
