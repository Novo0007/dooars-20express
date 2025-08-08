#!/usr/bin/env node

// Script to convert existing USD prices to INR in the database
// Run this once when switching from USD to INR

const USD_TO_INR_RATE = 83.12

console.log('🔄 Converting prices from USD to INR...')
console.log(`Using conversion rate: 1 USD = ${USD_TO_INR_RATE} INR`)

// Price conversion examples for common hotel rates
const samplePrices = [
  { name: 'Budget Hotel', usd: 25, inr: Math.round(25 * USD_TO_INR_RATE) },
  { name: 'Mid-range Hotel', usd: 75, inr: Math.round(75 * USD_TO_INR_RATE) },
  { name: 'Luxury Hotel', usd: 200, inr: Math.round(200 * USD_TO_INR_RATE) },
  { name: 'Premium Resort', usd: 500, inr: Math.round(500 * USD_TO_INR_RATE) }
]

console.log('\n📊 Price conversion examples:')
console.log('================================')
samplePrices.forEach(price => {
  console.log(`${price.name}: $${price.usd} → ₹${price.inr.toLocaleString('en-IN')}`)
})

console.log('\n✅ Database price conversion would happen here in production')
console.log('📝 Update all price fields in:')
console.log('   - hotels table (price column)')
console.log('   - rooms table (price_per_night column)')
console.log('   - bookings table (total_price, final_price columns)')

console.log('\n💡 Note: The app now automatically converts and formats prices in INR')
