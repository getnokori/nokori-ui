import { ref } from 'vue'

export default function useHubTreeNodeDropdown() {
  const isDropdownOpen = ref(false)

  function toggleDropdown() {
    isDropdownOpen.value = !isDropdownOpen.value
  }

  return {
    isDropdownOpen,
    toggleDropdown
  }
}
