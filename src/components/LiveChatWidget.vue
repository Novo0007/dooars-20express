<template>
  <!-- Chat Toggle Button -->
  <div v-if="!isChatOpen" class="fixed bottom-6 right-6 z-50">
    <button
      @click="toggleChat"
      class="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-large hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
    >
      <svg
        class="w-6 h-6 transition-transform duration-200 group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>

      <!-- Notification badge -->
      <div
        v-if="unreadMessages > 0"
        class="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
      >
        {{ unreadMessages > 99 ? '99+' : unreadMessages }}
      </div>
    </button>
  </div>

  <!-- Chat Window -->
  <div
    v-if="isChatOpen"
    class="fixed bottom-6 right-6 w-80 h-96 bg-white dark:bg-neutral-800 rounded-2xl shadow-large border border-neutral-200 dark:border-neutral-700 z-50 flex flex-col overflow-hidden"
  >
    <!-- Chat Header -->
    <div
      class="bg-primary-600 dark:bg-primary-700 text-white p-4 flex items-center justify-between"
    >
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-sm">{{ $t('chat.title') }}</h3>
          <p class="text-xs text-primary-100">{{ agentStatus }}</p>
        </div>
      </div>
      <button
        @click="toggleChat"
        class="text-white/80 hover:text-white transition-colors duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Chat Messages -->
    <div
      ref="messagesContainer"
      class="flex-1 p-4 overflow-y-auto space-y-4 bg-neutral-50 dark:bg-neutral-900"
    >
      <!-- Welcome message -->
      <div v-if="messages.length === 0" class="text-center py-8">
        <div
          class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full mx-auto mb-3 flex items-center justify-center"
        >
          <svg
            class="w-6 h-6 text-primary-600 dark:text-primary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <p class="text-sm text-neutral-600 dark:text-neutral-400">
          {{ $t('chat.startConversation') }}
        </p>
      </div>

      <!-- Messages -->
      <div
        v-for="message in messages"
        :key="message.id"
        class="flex"
        :class="{ 'justify-end': message.sender === 'user' }"
      >
        <div
          class="max-w-[80%] rounded-2xl px-4 py-2 text-sm"
          :class="
            message.sender === 'user'
              ? 'bg-primary-600 text-white rounded-br-md'
              : 'bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-bl-md shadow-sm'
          "
        >
          <p>{{ message.text }}</p>
          <p
            class="text-xs mt-1 opacity-70"
            :class="
              message.sender === 'user'
                ? 'text-primary-100'
                : 'text-neutral-500 dark:text-neutral-400'
            "
          >
            {{ formatTime(message.timestamp) }}
          </p>
        </div>
      </div>

      <!-- Typing indicator -->
      <div v-if="isAgentTyping" class="flex">
        <div class="bg-white dark:bg-neutral-700 rounded-2xl rounded-bl-md px-4 py-2 shadow-sm">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"></div>
            <div
              class="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"
              style="animation-delay: 0.2s"
            ></div>
            <div
              class="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"
              style="animation-delay: 0.4s"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Input -->
    <div
      class="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
    >
      <form @submit.prevent="sendMessage" class="flex space-x-2">
        <input
          v-model="newMessage"
          :placeholder="$t('chat.placeholder')"
          class="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-sm transition-colors duration-200"
          :disabled="isAgentTyping"
        />
        <button
          type="submit"
          :disabled="!newMessage.trim() || isAgentTyping"
          class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-600 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../stores/app'

const { t } = useI18n()
const appStore = useAppStore()

const messagesContainer = ref<HTMLElement>()
const newMessage = ref('')
const isAgentTyping = ref(false)
const unreadMessages = ref(0)

const isChatOpen = computed(() => appStore.isChatOpen)
const messages = computed(() => appStore.chatMessages)

const agentStatus = computed(() => {
  if (isAgentTyping.value) return 'Typing...'
  return 'Online'
})

const toggleChat = () => {
  appStore.toggleChat()
  if (isChatOpen.value) {
    unreadMessages.value = 0
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const messageText = newMessage.value.trim()
  newMessage.value = ''

  // Add user message
  appStore.addChatMessage(messageText, 'user')

  await nextTick()
  scrollToBottom()

  // Simulate agent response
  setTimeout(async () => {
    isAgentTyping.value = true

    setTimeout(async () => {
      isAgentTyping.value = false

      // Generate response based on message content
      const response = generateAgentResponse(messageText)
      appStore.addChatMessage(response, 'agent')

      if (!isChatOpen.value) {
        unreadMessages.value++
      }

      await nextTick()
      scrollToBottom()
    }, 1500)
  }, 500)
}

const generateAgentResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase()

  if (message.includes('booking') || message.includes('reserve')) {
    return "I'd be happy to help you with your booking! You can search for hotels on our homepage and proceed with the booking process. Do you need help finding a specific destination?"
  }

  if (message.includes('cancel') || message.includes('refund')) {
    return "I understand you need help with a cancellation or refund. Please provide your booking reference number and I'll check the cancellation policy for your reservation."
  }

  if (message.includes('payment') || message.includes('card')) {
    return 'For payment-related queries, we accept all major credit cards and use secure payment processing. Your payment information is encrypted and protected. What specific payment question can I help with?'
  }

  if (message.includes('price') || message.includes('cost') || message.includes('discount')) {
    return 'We offer competitive prices and often have special discounts available! Check our homepage for current promo codes, or I can help you find the best deals for your travel dates.'
  }

  if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
    return "Hello! Welcome to WanderStay. I'm here to help you with any questions about hotels, bookings, or travel plans. How can I assist you today?"
  }

  // Default response
  return "Thank you for your message! I'm here to help with any questions about bookings, payments, cancellations, or general travel assistance. Could you please provide more details about what you need help with?"
}

const formatTime = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Watch for new messages and scroll
watch(
  () => messages.value.length,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  },
)
</script>

<style scoped>
/* Custom scrollbar for messages */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

/* Animation for chat window */
.chat-enter-active,
.chat-leave-active {
  transition: all 0.3s ease;
}

.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
