// Indian Payment Service with Razorpay, UPI, and other Indian payment methods
import { ref } from 'vue'

export interface PaymentOption {
  id: string
  name: string
  type: 'razorpay' | 'upi' | 'netbanking' | 'card' | 'wallet'
  icon: string
  description: string
  enabled: boolean
}

export interface PaymentRequest {
  amount: number // Amount in paise (smallest currency unit)
  currency: string
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  description: string
}

export interface PaymentResponse {
  success: boolean
  paymentId?: string
  orderId: string
  signature?: string
  error?: string
}

export class IndianPaymentService {
  private razorpayKey: string
  private isInitialized = ref(false)

  constructor() {
    this.razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || ''
    this.initializeRazorpay()
  }

  private async initializeRazorpay() {
    try {
      // Load Razorpay script dynamically
      if (!window.Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.head.appendChild(script)
        
        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
        })
      }
      this.isInitialized.value = true
    } catch (error) {
      console.error('Failed to initialize Razorpay:', error)
    }
  }

  // Get available payment options for India
  getPaymentOptions(): PaymentOption[] {
    return [
      {
        id: 'razorpay',
        name: 'Razorpay',
        type: 'razorpay',
        icon: '💳',
        description: 'Card, UPI, NetBanking, Wallets',
        enabled: this.isInitialized.value && !!this.razorpayKey
      },
      {
        id: 'upi',
        name: 'UPI',
        type: 'upi',
        icon: '📱',
        description: 'PhonePe, GooglePay, Paytm, BHIM',
        enabled: true
      },
      {
        id: 'netbanking',
        name: 'Net Banking',
        type: 'netbanking',
        icon: '🏦',
        description: 'All major Indian banks',
        enabled: true
      },
      {
        id: 'cards',
        name: 'Credit/Debit Cards',
        type: 'card',
        icon: '💳',
        description: 'Visa, Mastercard, RuPay',
        enabled: true
      },
      {
        id: 'wallets',
        name: 'Digital Wallets',
        type: 'wallet',
        icon: '💰',
        description: 'Paytm, Amazon Pay, FreeCharge',
        enabled: true
      }
    ]
  }

  // Process payment through Razorpay
  async processRazorpayPayment(request: PaymentRequest): Promise<PaymentResponse> {
    if (!this.isInitialized.value || !window.Razorpay) {
      return {
        success: false,
        orderId: request.orderId,
        error: 'Razorpay not initialized'
      }
    }

    return new Promise((resolve) => {
      const options = {
        key: this.razorpayKey,
        amount: request.amount,
        currency: request.currency,
        name: 'Dooars Express',
        description: request.description,
        order_id: request.orderId,
        prefill: {
          name: request.customerName,
          email: request.customerEmail,
          contact: request.customerPhone
        },
        theme: {
          color: '#3B82F6'
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          paylater: true
        },
        handler: (response: any) => {
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          })
        },
        modal: {
          ondismiss: () => {
            resolve({
              success: false,
              orderId: request.orderId,
              error: 'Payment cancelled by user'
            })
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    })
  }

  // Generate UPI payment URL
  generateUPIUrl(request: PaymentRequest, upiId: string): string {
    const { amount, customerName, orderId, description } = request
    const amountInRupees = (amount / 100).toFixed(2)
    
    return `upi://pay?pa=${upiId}&pn=Dooars Express&tr=${orderId}&am=${amountInRupees}&cu=INR&tn=${encodeURIComponent(description)}`
  }

  // Validate Indian phone number
  validateIndianPhone(phone: string): boolean {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone.replace(/\D/g, ''))
  }

  // Format Indian currency
  formatIndianCurrency(amount: number): string {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
    return formatter.format(amount / 100) // Convert from paise to rupees
  }

  // Get GST calculation for hotel bookings
  calculateGST(amount: number, gstRate: number = 12): { cgst: number; sgst: number; igst: number; total: number } {
    const baseAmount = amount / (1 + gstRate / 100)
    const gstAmount = amount - baseAmount
    
    return {
      cgst: gstAmount / 2, // Central GST
      sgst: gstAmount / 2, // State GST  
      igst: gstAmount,     // Integrated GST (for inter-state)
      total: amount
    }
  }

  // Verify payment with backend
  async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    try {
      // This should call your backend API to verify the payment
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentId,
          orderId,
          signature
        })
      })

      const result = await response.json()
      return result.verified === true
    } catch (error) {
      console.error('Payment verification failed:', error)
      return false
    }
  }
}

// Export global instance
export const paymentService = new IndianPaymentService()

// Type declarations for Razorpay
declare global {
  interface Window {
    Razorpay: any
  }
}
