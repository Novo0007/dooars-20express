import { ref, type Ref } from 'vue'

/**
 * Unified loading state management composable
 * Eliminates duplicate loading state patterns across components
 */
export const useLoading = (initialState = false) => {
  const loading = ref(initialState)
  const loadingStates = ref<Record<string, boolean>>({})

  /**
   * Set general loading state
   */
  const setLoading = (state: boolean) => {
    loading.value = state
  }

  /**
   * Set specific loading state by key
   */
  const setLoadingState = (key: string, state: boolean) => {
    loadingStates.value[key] = state
  }

  /**
   * Check if specific operation is loading
   */
  const isLoading = (key?: string): boolean => {
    if (key) {
      return loadingStates.value[key] || false
    }
    return loading.value
  }

  /**
   * Execute operation with loading state management
   */
  const withLoading = async <T>(
    operation: () => Promise<T>,
    loadingKey?: string
  ): Promise<T> => {
    if (loadingKey) {
      setLoadingState(loadingKey, true)
    } else {
      setLoading(true)
    }

    try {
      return await operation()
    } finally {
      if (loadingKey) {
        setLoadingState(loadingKey, false)
      } else {
        setLoading(false)
      }
    }
  }

  /**
   * Execute multiple operations with individual loading states
   */
  const withMultipleLoading = async <T extends Record<string, () => Promise<any>>>(
    operations: T
  ): Promise<{ [K in keyof T]: Awaited<ReturnType<T[K]>> }> => {
    const promises = Object.entries(operations).map(async ([key, operation]) => {
      setLoadingState(key, true)
      try {
        const result = await operation()
        return [key, result]
      } finally {
        setLoadingState(key, false)
      }
    })

    const results = await Promise.all(promises)
    return Object.fromEntries(results)
  }

  /**
   * Get loading states for multiple operations
   */
  const getLoadingStates = () => ({ ...loadingStates.value })

  /**
   * Clear all loading states
   */
  const clearLoadingStates = () => {
    loadingStates.value = {}
    setLoading(false)
  }

  return {
    loading: loading as Ref<boolean>,
    loadingStates: loadingStates as Ref<Record<string, boolean>>,
    setLoading,
    setLoadingState,
    isLoading,
    withLoading,
    withMultipleLoading,
    getLoadingStates,
    clearLoadingStates
  }
}
