<template>
  <TransitionRoot as="template" :show="open">
    <div
      class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full"
    >
      <Dialog as="div" class="relative z-10" @click="$emit('close')">
        <div class="fixed inset-0" />

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div
              class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10"
            >
              <TransitionChild
                as="template"
                enter="transform transition ease-in-out duration-300 sm:duration-300"
                enter-from="translate-x-full"
                enter-to="translate-x-0"
                leave="transform transition ease-in-out duration-300 sm:duration-300"
                leave-from="translate-x-0"
                leave-to="translate-x-full"
              >
                <DialogPanel
                  class="pointer-events-auto w-screen max-w-xl -mr-4"
                >
                  <FullScreenLoader v-if="state.isLoading" />
                  <div
                    class="flex h-full flex-col overflow-y-scroll bg-[#27282c] p-6 pt-10 shadow-xl"
                  >
                    <div class="px-4 sm:px-6">
                      <div
                        class="flex items-center justify-between pb-4 border-b-[1px] border-[#373941]"
                      >
                        <div class="flex flex-col items-start">
                          <DialogTitle
                            class="flex-md font-medium text-xl leading-4 text-gray-100 pb-[2px]"
                            >User Profile</DialogTitle
                          >
                        </div>

                        <div class="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            class="rounded-full p-1 bg-[#373941] text-gray-400 hover:text-gray-500 focus:outline-none"
                            @click="$emit('close')"
                          >
                            <span class="sr-only">Close panel</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="px-4 sm:px-6 mt-4">
                      <div
                        v-if="state.error.hasError"
                        class="bg-rose-400/20 p-4 rounded-md items-center mb-3"
                      >
                        {{ state.error.message }}
                      </div>
                      <div class="flex items-center">
                        <h3
                          v-if="state.user.firstName || state.user.lastName"
                          class="text-xl font-bold text-white sm:text-2xl"
                        >
                          {{ state.user.firstName }} {{ state.user.lastName }}
                        </h3>
                        <h3
                          v-else
                          class="text-xl font-bold text-white/30 sm:text-2xl"
                        >
                          Anonymous User
                        </h3>
                        <span
                          :class="[
                            state.user.active
                              ? 'bg-green-500'
                              : 'bg-rose-500/70',
                            'ml-2.5 inline-block h-2 w-2 flex-shrink-0 rounded-full'
                          ]"
                        >
                        </span>

                        <div class="ml-auto inline-flex">
                          <Menu
                            as="div"
                            class="relative inline-block text-left"
                          >
                            <MenuButton
                              class="inline-flex items-center rounded-md bg-white/5 p-2 text-gray-400 shadow-sm ring-0 ring-inset ring-gray-300 hover:bg-white/10"
                            >
                              <span class="sr-only">Open options menu</span>
                              <EllipsisVerticalIcon
                                class="h-5 w-5"
                                aria-hidden="true"
                              />
                            </MenuButton>
                            <transition
                              enter-active-class="transition ease-out duration-100"
                              enter-from-class="transform opacity-0 scale-95"
                              enter-to-class="transform opacity-100 scale-100"
                              leave-active-class="transition ease-in duration-75"
                              leave-from-class="transform opacity-100 scale-100"
                              leave-to-class="transform opacity-0 scale-95"
                            >
                              <MenuItems
                                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-zinc-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                              >
                                <div class="py-1">
                                  <MenuItem v-slot="{ active }">
                                    <a
                                      :class="[
                                        active
                                          ? 'bg-zinc-600 text-zinc-100'
                                          : 'text-zinc-300',
                                        'block px-4 py-2 text-sm cursor-pointer'
                                      ]"
                                      @click.stop="toggleActive"
                                      >{{
                                        state.user.active !== 0
                                          ? 'Deactivate'
                                          : 'Set Active'
                                      }}</a
                                    >
                                  </MenuItem>
                                </div>
                              </MenuItems>
                            </transition>
                          </Menu>
                        </div>
                      </div>
                      <p class="text-base tracking-normal text-gray-500 -mt-2">
                        {{ props.userId }}
                      </p>
                      <div class="mt-6">
                        <h3 class="font-medium text-zinc-200">Email Address</h3>
                        <div
                          class="mt-2 -space-y-px rounded-md bg-white/5 shadow-sm"
                        >
                          <div>
                            <label for="email-address" class="sr-only"
                              >Email</label
                            >
                            <input
                              id="email-address"
                              v-model="state.user.email"
                              type="text"
                              name="email-address"
                              class="relative block w-full rounded-md border-0 bg-transparent px-4 py-3 text-white ring-1 ring-inset ring-gray-200/5 placeholder:text-gray-400 focus:z-10 focus:ring-1 focus:ring-inset focus:ring-gray-200/30 sm:text-sm sm:leading-6"
                              placeholder="Email Address"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="mt-6">
                        <h3 class="font-medium text-zinc-200">Name</h3>
                        <div>
                          <div
                            class="mt-2 -space-y-px rounded-md bg-white/5 shadow-sm"
                          >
                            <div class="flex -space-x-px">
                              <div class="w-1/2 min-w-0 flex-1">
                                <label
                                  for="card-expiration-date"
                                  class="sr-only"
                                  >First Name</label
                                >
                                <input
                                  id="card-expiration-date"
                                  v-model="state.user.firstName"
                                  type="text"
                                  name="card-expiration-date"
                                  class="relative block w-full rounded-none rounded-l-md border-0 bg-transparent px-4 py-3 text-white ring-1 ring-inset ring-gray-200/5 placeholder:text-gray-400 focus:z-10 focus:ring-1 focus:ring-inset focus:ring-gray-200/30 sm:text-sm sm:leading-6"
                                  placeholder="First Name"
                                />
                              </div>
                              <div class="w-1/2 min-w-0 flex-1">
                                <label for="card-number" class="sr-only"
                                  >Last Name</label
                                >
                                <input
                                  id="card-number"
                                  v-model="state.user.lastName"
                                  type="text"
                                  name="card-number"
                                  class="relative block w-full rounded-none rounded-r-md border-0 bg-transparent px-4 py-3 text-white ring-1 ring-inset ring-gray-200/5 placeholder:text-gray-400 focus:z-10 focus:ring-1 focus:ring-inset focus:ring-gray-200/30 sm:text-sm sm:leading-6"
                                  placeholder="Last Name"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Address Info -->
                      <div class="mt-6">
                        <h3 class="font-medium text-zinc-200">Address</h3>
                        <div>
                          <div
                            class="mt-2 -space-y-px rounded-md bg-white/5 shadow-sm"
                          >
                            <div>
                              <label for="card-number" class="sr-only"
                                >Address line 1</label
                              >
                              <input
                                id="card-number"
                                v-model="state.user.address.streetAddress"
                                type="text"
                                name="card-number"
                                class="relative block w-full rounded-none rounded-t-md border-0 bg-transparent px-4 py-3 text-white ring-1 ring-inset ring-gray-200/5 placeholder:text-gray-400 focus:z-10 focus:ring-1 focus:ring-inset focus:ring-gray-200/30 sm:text-sm sm:leading-6"
                                placeholder="Address line 1"
                              />
                            </div>
                            <div>
                              <label for="card-number" class="sr-only"
                                >Address line 2</label
                              >
                              <input
                                id="card-number"
                                v-model="state.user.address.streetAddressExt"
                                type="text"
                                name="card-number"
                                class="relative block w-full rounded-none border-0 bg-transparent px-4 py-3 text-white ring-1 ring-inset ring-gray-200/5 placeholder:text-gray-400 focus:z-10 focus:ring-1 focus:ring-inset focus:ring-gray-200/30 sm:text-sm sm:leading-6"
                                placeholder="Address line 2"
                              />
                            </div>
                            <div class="min-w-0 flex-1">
                              <label for="state" class="sr-only">State</label>
                              <select
                                id="state"
                                v-model="state.user.address.locality"
                                name="state"
                                autocomplete="state-name"
                                class="relative block w-full rounded-none border-0 bg-transparent px-4 py-3 text-white ring-1 ring-inset ring-gray-200/5 focus:z-10 focus:ring-1 focus:ring-inset focus:ring-gray-200/30 sm:text-sm sm:leading-6"
                              >
                                <option value="">Select a state</option>
                                <option value="AL">Alabama</option>
                                <option value="AK">Alaska</option>
                                <option value="AZ">Arizona</option>
                                <option value="AR">Arkansas</option>
                                <option value="CA">California</option>
                                <option value="CO">Colorado</option>
                                <option value="CT">Connecticut</option>
                                <option value="DE">Delaware</option>
                                <option value="FL">Florida</option>
                                <option value="GA">Georgia</option>
                                <option value="HI">Hawaii</option>
                                <option value="ID">Idaho</option>
                                <option value="IL">Illinois</option>
                                <option value="IN">Indiana</option>
                                <option value="IA">Iowa</option>
                                <option value="KS">Kansas</option>
                                <option value="KY">Kentucky</option>
                                <option value="LA">Louisiana</option>
                                <option value="ME">Maine</option>
                                <option value="MD">Maryland</option>
                                <option value="MA">Massachusetts</option>
                                <option value="MI">Michigan</option>
                                <option value="MN">Minnesota</option>
                                <option value="MS">Mississippi</option>
                                <option value="MO">Missouri</option>
                                <option value="MT">Montana</option>
                                <option value="NE">Nebraska</option>
                                <option value="NV">Nevada</option>
                                <option value="NH">New Hampshire</option>
                                <option value="NJ">New Jersey</option>
                                <option value="NM">New Mexico</option>
                                <option value="NY">New York</option>
                                <option value="NC">North Carolina</option>
                                <option value="ND">North Dakota</option>
                                <option value="OH">Ohio</option>
                                <option value="OK">Oklahoma</option>
                                <option value="OR">Oregon</option>
                                <option value="PA">Pennsylvania</option>
                                <option value="RI">Rhode Island</option>
                                <option value="SC">South Carolina</option>
                                <option value="SD">South Dakota</option>
                                <option value="TN">Tennessee</option>
                                <option value="TX">Texas</option>
                                <option value="UT">Utah</option>
                                <option value="VT">Vermont</option>
                                <option value="VA">Virginia</option>
                                <option value="WA">Washington</option>
                                <option value="WV">West Virginia</option>
                                <option value="WI">Wisconsin</option>
                                <option value="WY">Wyoming</option>
                              </select>
                            </div>
                            <div class="flex -space-x-px">
                              <div class="w-1/2 min-w-0 flex-1">
                                <label
                                  for="card-expiration-date"
                                  class="sr-only"
                                  >City</label
                                >
                                <input
                                  id="card-expiration-date"
                                  v-model="state.user.address.region"
                                  type="text"
                                  name="card-expiration-date"
                                  class="relative block w-full rounded-none rounded-bl-md border-0 bg-transparent px-4 py-3 text-white ring-1 ring-inset ring-gray-200/5 placeholder:text-gray-400 focus:z-10 focus:ring-1 focus:ring-inset focus:ring-gray-200/30 sm:text-sm sm:leading-6"
                                  placeholder="City"
                                />
                              </div>
                              <div>
                                <label for="postal-code" class="sr-only"
                                  >Postal</label
                                >
                                <input
                                  id="postal-code"
                                  v-model="state.user.address.postalCode"
                                  type="number"
                                  name="postal-code"
                                  class="relative block w-full rounded-none rounded-br-md border-0 bg-transparent px-4 py-3 text-white ring-1 ring-inset ring-gray-200/5 placeholder:text-gray-400 focus:z-10 focus:ring-1 focus:ring-inset focus:ring-gray-200/30 sm:text-sm sm:leading-6"
                                  placeholder="Postal Code"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="px-4 sm:px-6 mt-10">
                      <h3 class="font-medium text-zinc-200">User Activity</h3>
                      <FeedsActivitySimple
                        :activity="state.activity"
                        class="mt-2"
                      />
                    </div>

                    <!-- Action buttons -->
                    <div
                      class="border-t border-gray-200/10 px-4 py-5 mt-10 sm:px-6"
                    >
                      <div class="flex justify-end space-x-3">
                        <button
                          type="button"
                          class="rounded-md bg-white/5 px-5 py-2 disabled:bg-zinc-700 text-sm font-semibold text-zinc-200 shadow-sm ring-1 ring-inset ring-zinc-300/10 hover:bg-white/10 disabled:pointer-events-none"
                          :disabled="state.save.isSaving"
                          @click="handleClose"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          class="inline-flex justify-center disabled:bg-zinc-700 rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none"
                          :disabled="state.save.isSaving"
                          @click.prevent="handleUpdateUser"
                        >
                          <IconLoadingSpinner
                            v-if="state.save.isSaving"
                            class="animate-spin h-3 w-3 mr-0 text-zinc-50"
                          />
                          Save & Close
                        </button>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'
import UsersService from '@/services/auth/users.service'
import type { UserActivityItemDTO } from '@/types/auth/users.type'
const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})

const open = ref(props.userId !== null)

const state = reactive({
  isLoading: true,
  save: {
    isSaving: false
  },
  user: {
    active: null as number | null,
    email: null as string | null,
    firstName: null as string | null,
    lastName: null as string | null,
    address: {
      streetAddress: null as string | null,
      streetAddressExt: null as string | null,
      locality: '' as string | null,
      region: null as string | null,
      postalCode: null as string | null
    }
  },
  activity: [] as UserActivityItemDTO[],
  error: {
    hasError: false,
    message: ''
  }
})

watch(() => props.userId, fetchUser)
watch(
  () => state.user.address.locality,
  (newValue) => {
    if (!newValue) {
      state.user.address.locality = ''
    }
  }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

onMounted(async () => {
  if (props.userId) {
    fetchUser(props.userId)
    fetchUserEvents()
  }
})

async function handleClose() {
  open.value = false
  emit('close')
}

async function toggleActive() {
  state.save.isSaving = false
  resetError()
  const update = {
    active: !state.user.active
  }

  try {
    const didUpdateUser = await UsersService.updateUser(props.userId, update)
    if (didUpdateUser.statusCode === 200) {
      state.user.active = Number(!state.user.active)
    }
  } catch (error: any) {
    state.error.hasError = true
    state.error.message = error.message
  }

  state.save.isSaving = false
}

async function fetchUser(userId: string) {
  resetError()
  const user = await UsersService.getUser(userId)
  if (user.data) {
    state.user = { ...user.data }
    state.isLoading = false
  }
}

async function fetchUserEvents() {
  resetError()
  const events = await UsersService.getUserEvents(props.userId)
  if (events.data) {
    state.activity = [...events.data]
  }
}

function resetError() {
  state.error.hasError = false
  state.error.message = ''
}

async function handleUpdateUser() {
  resetError()
  await updateUser()
}

async function updateUser() {
  resetError()
  state.save.isSaving = true
  state.user.address.locality =
    state.user.address.locality !== '' ? state.user.address.locality : null

  try {
    const didUpdateUser = await UsersService.updateUser(
      props.userId,
      state.user
    )
    if (didUpdateUser.statusCode === 200) {
      state.save.isSaving = false
      open.value = false
      emit('close')
    }
  } catch (error: any) {
    state.error.hasError = true
    state.error.message = error.message
    state.save.isSaving = false
  }
}
</script>
