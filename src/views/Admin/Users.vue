<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
        <p class="text-gray-600 mt-2">Manage user accounts, roles, and permissions</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="exportUsers"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          Export Users
        </button>
        <button
          @click="openInviteModal"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Invite User
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <svg
              class="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Users</p>
            <p class="text-2xl font-semibold text-gray-900">{{ totalUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Active Users</p>
            <p class="text-2xl font-semibold text-gray-900">{{ activeUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100">
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Admin Users</p>
            <p class="text-2xl font-semibold text-gray-900">{{ adminUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100">
            <svg
              class="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">New This Month</p>
            <p class="text-2xl font-semibold text-gray-900">{{ newUsersThisMonth }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or email..."
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            v-model="selectedRole"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="hotel_manager">Hotel Manager</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="selectedStatus"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="refreshUsers"
            :disabled="loading"
            class="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {{ loading ? 'Loading...' : 'Refresh' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Login
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Joined
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      v-if="user.avatar_url"
                      :src="user.avatar_url"
                      :alt="user.full_name"
                      class="h-10 w-10 rounded-full object-cover"
                    />
                    <div
                      v-else
                      class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                    >
                      <span class="text-sm font-medium text-gray-700">
                        {{ getInitials(user.full_name || user.email) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.full_name || 'No name' }}
                    </div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getRoleClass(user.role)"
                >
                  {{ getRoleLabel(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  "
                >
                  {{ user.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button @click="editUser(user)" class="text-blue-600 hover:text-blue-900">
                    Edit
                  </button>
                  <button
                    @click="toggleUserStatus(user)"
                    :class="
                      user.is_active
                        ? 'text-red-600 hover:text-red-900'
                        : 'text-green-600 hover:text-green-900'
                    "
                  >
                    {{ user.is_active ? 'Deactivate' : 'Activate' }}
                  </button>
                  <button
                    @click="viewUserBookings(user)"
                    class="text-purple-600 hover:text-purple-900"
                  >
                    Bookings
                  </button>
                  <button
                    v-if="canDeleteUser(user)"
                    @click="deleteUser(user.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
              {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} of
              {{ filteredUsers.length }} results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  currentPage === page
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white"
      >
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              Edit User: {{ editingUser?.full_name || editingUser?.email }}
            </h3>
            <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveUserChanges" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  v-model="editForm.full_name"
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  v-model="editForm.email"
                  type="email"
                  readonly
                  class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  v-model="editForm.role"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="hotel_manager">Hotel Manager</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  v-model="editForm.is_active"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                v-model="editForm.phone"
                type="tel"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="editForm.email_notifications"
                    class="mr-2 rounded"
                  />
                  <span class="text-sm text-gray-700">Email Notifications</span>
                </label>
              </div>
              <div>
                <label class="flex items-center">
                  <input type="checkbox" v-model="editForm.marketing_emails" class="mr-2 rounded" />
                  <span class="text-sm text-gray-700">Marketing Emails</span>
                </label>
              </div>
            </div>

            <!-- Hotel Assignments (only for hotel managers) -->
            <div v-if="editForm.role === 'hotel_manager'" class="border-t pt-4">
              <div class="flex justify-between items-center mb-3">
                <label class="block text-sm font-medium text-gray-700">Hotel Assignments</label>
                <button
                  type="button"
                  @click="addHotelAssignment"
                  class="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                >
                  Add Hotel
                </button>
              </div>
              <div class="space-y-3">
                <div
                  v-for="(assignment, index) in editForm.assigned_hotels"
                  :key="index"
                  class="flex items-center space-x-3 p-3 border border-gray-200 rounded-md"
                >
                  <div class="flex-1">
                    <select
                      v-model="assignment.hotel_id"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Hotel</option>
                      <option v-for="hotel in hotels" :key="hotel.id" :value="hotel.id">
                        {{ hotel.name }} - {{ hotel.location }}
                      </option>
                    </select>
                  </div>
                  <div class="w-32">
                    <select
                      v-model="assignment.role"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="manager">Manager</option>
                      <option value="staff">Staff</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    @click="removeHotelAssignment(index)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div
                  v-if="editForm.assigned_hotels.length === 0"
                  class="text-sm text-gray-500 italic"
                >
                  No hotels assigned. Click "Add Hotel" to assign hotels to this user.
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeEditModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Invite User Modal -->
    <div
      v-if="showInviteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 max-w-lg shadow-lg rounded-md bg-white"
      >
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Invite New User</h3>
            <button @click="closeInviteModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="sendInvite" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                v-model="inviteForm.email"
                type="email"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                v-model="inviteForm.role"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="hotel_manager">Hotel Manager</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Full Name (Optional)</label
              >
              <input
                v-model="inviteForm.full_name"
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeInviteModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {{ loading ? 'Sending...' : 'Send Invite' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

// State
const users = ref<any[]>([])
const authUsers = ref<any[]>([])
const hotels = ref<any[]>([])
const userHotelAssignments = ref<any[]>([])
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showEditModal = ref(false)
const showInviteModal = ref(false)
const editingUser = ref<any>(null)

// Filters
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')

// Forms
const editForm = ref({
  full_name: '',
  email: '',
  role: 'user',
  is_active: true,
  phone: '',
  email_notifications: true,
  marketing_emails: false,
  assigned_hotels: [] as any[],
})

const inviteForm = ref({
  email: '',
  role: 'user',
  full_name: '',
})

const router = useRouter()
const authStore = useAuthStore()

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (user) =>
        user.full_name?.toLowerCase().includes(query) || user.email?.toLowerCase().includes(query),
    )
  }

  if (selectedRole.value) {
    filtered = filtered.filter((user) => user.role === selectedRole.value)
  }

  if (selectedStatus.value !== '') {
    const isActive = selectedStatus.value === 'true'
    filtered = filtered.filter((user) => user.is_active === isActive)
  }

  return filtered
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value))

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => users.value.filter((user) => user.is_active).length)
const adminUsers = computed(
  () => users.value.filter((user) => user.role === 'admin' || user.role === 'super_admin').length,
)
const newUsersThisMonth = computed(() => {
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  return users.value.filter((user) => new Date(user.created_at) > oneMonthAgo).length
})

// Methods
const fetchUsers = async () => {
  loading.value = true
  try {
    // Fetch user profiles
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (profileError) throw profileError

    // Fetch auth users for last login info
    const { data: authUsersData, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.warn('Could not fetch auth users:', authError.message)
      users.value = profiles || []
    } else {
      // Merge profile data with auth data
      const mergedUsers = (profiles || []).map((profile) => {
        const authUser = authUsersData.users.find((au) => au.id === profile.id)
        return {
          ...profile,
          last_sign_in_at: authUser?.last_sign_in_at,
          confirmed_at: authUser?.confirmed_at,
          email_confirmed_at: authUser?.email_confirmed_at,
        }
      })
      users.value = mergedUsers
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

const refreshUsers = () => {
  fetchUsers()
}

const fetchHotels = async () => {
  try {
    const { data, error } = await supabase
      .from('hotels')
      .select('id, name, location')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    hotels.value = data || []
  } catch (error) {
    console.error('Error fetching hotels:', error)
  }
}

const fetchUserHotelAssignments = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('hotel_assignments')
      .select('*, hotel:hotels(id, name, location)')
      .eq('user_id', userId)
      .eq('is_active', true)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching user hotel assignments:', error)
    return []
  }
}

const editUser = async (user: any) => {
  editingUser.value = user

  // Fetch user's hotel assignments
  const assignments = await fetchUserHotelAssignments(user.id)

  editForm.value = {
    full_name: user.full_name || '',
    email: user.email || '',
    role: user.role || 'user',
    is_active: user.is_active ?? true,
    phone: user.phone || '',
    email_notifications: user.email_notifications ?? true,
    marketing_emails: user.marketing_emails ?? false,
    assigned_hotels: assignments,
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingUser.value = null
}

const saveUserChanges = async () => {
  if (!editingUser.value) return

  loading.value = true
  try {
    // Update user profile
    const { error } = await supabase
      .from('user_profiles')
      .update({
        full_name: editForm.value.full_name,
        role: editForm.value.role,
        is_active: editForm.value.is_active,
        phone: editForm.value.phone,
        email_notifications: editForm.value.email_notifications,
        marketing_emails: editForm.value.marketing_emails,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingUser.value.id)

    if (error) throw error

    // Update hotel assignments if user is hotel manager
    if (editForm.value.role === 'hotel_manager') {
      await updateHotelAssignments(editingUser.value.id, editForm.value.assigned_hotels)
    } else {
      // Remove all hotel assignments if user is no longer hotel manager
      await clearHotelAssignments(editingUser.value.id)
    }

    await fetchUsers()
    closeEditModal()
  } catch (error) {
    console.error('Error updating user:', error)
    alert('Error updating user. Please try again.')
  } finally {
    loading.value = false
  }
}

const updateHotelAssignments = async (userId: string, assignments: any[]) => {
  try {
    // First, deactivate all existing assignments
    await supabase.from('hotel_assignments').update({ is_active: false }).eq('user_id', userId)

    // Then, create/reactivate assignments for selected hotels
    for (const assignment of assignments) {
      if (assignment.hotel_id) {
        await supabase.from('hotel_assignments').upsert({
          user_id: userId,
          hotel_id: assignment.hotel_id,
          role: assignment.role || 'manager',
          is_active: true,
          assigned_by: authStore.user?.id,
        })
      }
    }
  } catch (error) {
    console.error('Error updating hotel assignments:', error)
    throw error
  }
}

const clearHotelAssignments = async (userId: string) => {
  try {
    await supabase.from('hotel_assignments').update({ is_active: false }).eq('user_id', userId)
  } catch (error) {
    console.error('Error clearing hotel assignments:', error)
  }
}

const addHotelAssignment = () => {
  editForm.value.assigned_hotels.push({
    hotel_id: '',
    role: 'manager',
    is_active: true,
  })
}

const removeHotelAssignment = (index: number) => {
  editForm.value.assigned_hotels.splice(index, 1)
}

const toggleUserStatus = async (user: any) => {
  const newStatus = !user.is_active

  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        is_active: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) throw error
    await fetchUsers()
  } catch (error) {
    console.error('Error updating user status:', error)
  }
}

const deleteUser = async (userId: string) => {
  if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

  try {
    const { error } = await supabase.from('user_profiles').delete().eq('id', userId)

    if (error) throw error
    await fetchUsers()
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

const viewUserBookings = (user: any) => {
  router.push(`/admin/bookings?user=${user.id}`)
}

const openInviteModal = () => {
  inviteForm.value = {
    email: '',
    role: 'user',
    full_name: '',
  }
  showInviteModal.value = true
}

const closeInviteModal = () => {
  showInviteModal.value = false
}

const sendInvite = async () => {
  loading.value = true
  try {
    // In a real app, this would send an invitation email
    // For now, we'll just show a success message
    alert(`Invitation sent to ${inviteForm.value.email}`)
    closeInviteModal()
  } catch (error) {
    console.error('Error sending invite:', error)
    alert('Error sending invitation. Please try again.')
  } finally {
    loading.value = false
  }
}

const exportUsers = () => {
  const headers = ['Name', 'Email', 'Role', 'Status', 'Joined', 'Last Login']
  const csvData = users.value.map((user) => [
    user.full_name || '',
    user.email,
    getRoleLabel(user.role),
    user.is_active ? 'Active' : 'Inactive',
    formatDate(user.created_at),
    user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never',
  ])

  const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

const getInitials = (name: string) => {
  if (!name) return '??'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getRoleClass = (role: string) => {
  const classes = {
    user: 'bg-gray-100 text-gray-800',
    hotel_manager: 'bg-green-100 text-green-800',
    admin: 'bg-blue-100 text-blue-800',
    super_admin: 'bg-purple-100 text-purple-800',
  }
  return classes[role as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getRoleLabel = (role: string) => {
  const labels = {
    user: 'User',
    hotel_manager: 'Hotel Manager',
    admin: 'Admin',
    super_admin: 'Super Admin',
  }
  return labels[role as keyof typeof labels] || 'Unknown'
}

const canDeleteUser = (user: any) => {
  // Don't allow deleting super admins or the current user
  return user.role !== 'super_admin' && user.id !== authStore.user?.id
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Lifecycle
onMounted(() => {
  fetchUsers()
  fetchHotels()
})
</script>
