import { ref, computed, type Ref } from 'vue'

/**
 * Unified form validation composable
 * Eliminates duplicate validation patterns across components
 */

export interface ValidationRule {
  message: string
  validator: (value: any) => boolean
}

export interface ValidationField {
  value: Ref<any>
  rules: ValidationRule[]
  touched: Ref<boolean>
}

export const useValidation = () => {
  const fields = ref<Record<string, ValidationField>>({})

  /**
   * Common validation rules
   */
  const rules = {
    required: (message = 'This field is required'): ValidationRule => ({
      message,
      validator: (value) => value !== null && value !== undefined && value !== ''
    }),

    email: (message = 'Please enter a valid email address'): ValidationRule => ({
      message,
      validator: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    }),

    minLength: (min: number, message?: string): ValidationRule => ({
      message: message || `Must be at least ${min} characters`,
      validator: (value) => !value || value.toString().length >= min
    }),

    maxLength: (max: number, message?: string): ValidationRule => ({
      message: message || `Must be no more than ${max} characters`,
      validator: (value) => !value || value.toString().length <= max
    }),

    phoneNumber: (message = 'Please enter a valid phone number'): ValidationRule => ({
      message,
      validator: (value) => !value || /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''))
    }),

    indianPhoneNumber: (message = 'Please enter a valid Indian phone number'): ValidationRule => ({
      message,
      validator: (value) => !value || /^(\+91|91|0)?[6-9]\d{9}$/.test(value.replace(/\s/g, ''))
    }),

    passwordStrength: (message = 'Password must be at least 8 characters with uppercase, lowercase, and number'): ValidationRule => ({
      message,
      validator: (value) => !value || (
        value.length >= 8 &&
        /[a-z]/.test(value) &&
        /[A-Z]/.test(value) &&
        /\d/.test(value)
      )
    }),

    confirmPassword: (passwordRef: Ref<string>, message = 'Passwords do not match'): ValidationRule => ({
      message,
      validator: (value) => !value || value === passwordRef.value
    }),

    positiveNumber: (message = 'Must be a positive number'): ValidationRule => ({
      message,
      validator: (value) => !value || (Number(value) > 0)
    }),

    dateNotPast: (message = 'Date cannot be in the past'): ValidationRule => ({
      message,
      validator: (value) => !value || new Date(value) >= new Date()
    }),

    url: (message = 'Please enter a valid URL'): ValidationRule => ({
      message,
      validator: (value) => !value || /^https?:\/\/.+/.test(value)
    })
  }

  /**
   * Register a field for validation
   */
  const registerField = (
    name: string,
    value: Ref<any>,
    validationRules: ValidationRule[]
  ) => {
    fields.value[name] = {
      value,
      rules: validationRules,
      touched: ref(false)
    }
  }

  /**
   * Mark field as touched
   */
  const touch = (name: string) => {
    if (fields.value[name]) {
      fields.value[name].touched.value = true
    }
  }

  /**
   * Mark all fields as touched
   */
  const touchAll = () => {
    Object.keys(fields.value).forEach(touch)
  }

  /**
   * Get validation errors for a field
   */
  const getFieldErrors = (name: string): string[] => {
    const field = fields.value[name]
    if (!field || !field.touched.value) return []

    return field.rules
      .filter(rule => !rule.validator(field.value.value))
      .map(rule => rule.message)
  }

  /**
   * Check if field has errors
   */
  const hasFieldErrors = (name: string): boolean => {
    return getFieldErrors(name).length > 0
  }

  /**
   * Get all validation errors
   */
  const getAllErrors = computed(() => {
    const errors: Record<string, string[]> = {}
    Object.keys(fields.value).forEach(name => {
      const fieldErrors = getFieldErrors(name)
      if (fieldErrors.length > 0) {
        errors[name] = fieldErrors
      }
    })
    return errors
  })

  /**
   * Check if form is valid
   */
  const isValid = computed(() => {
    return Object.keys(getAllErrors.value).length === 0
  })

  /**
   * Validate all fields and return if form is valid
   */
  const validate = (): boolean => {
    touchAll()
    return isValid.value
  }

  /**
   * Reset all validation states
   */
  const reset = () => {
    Object.keys(fields.value).forEach(name => {
      fields.value[name].touched.value = false
    })
  }

  /**
   * Clear all registered fields
   */
  const clear = () => {
    fields.value = {}
  }

  return {
    rules,
    registerField,
    touch,
    touchAll,
    getFieldErrors,
    hasFieldErrors,
    getAllErrors,
    isValid,
    validate,
    reset,
    clear
  }
}
