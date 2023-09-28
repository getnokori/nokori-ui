<template>
  <BaseFlyout title="Sources" :width="1200" @close="$emit('close')">
    <div class="flyout">
      <template v-if="state.sourceCatalog.isLoading">
        <div class="flyout__loading">
          <LoadingIndicator />
        </div>
      </template>

      <template v-else-if="state.sourceCatalog.error">
        <div class="flyout__error">
          <BaseError>
            {{ state.sourceCatalog.error.message }}
          </BaseError>
        </div>
      </template>

      <template v-else>
        <div class="flyout__container">
          <div class="flyout__sidebar">
            <div class="flyout__search">
              <BaseSearch
                v-model="state.searchQuery"
                @clear="state.searchQuery = ''"
              />
            </div>

            <!-- <div class="flyout__hosted">
              <BaseSwitch id="hosted" v-model="state.isHostedOnly">
                Hosted Only
              </BaseSwitch>
            </div> -->

            <ul class="flyout__categories">
              <SourceSelectorFlyoutCategoryItem
                v-model="state.selectedCategory"
                label="All"
                :value="SourceCategories.All"
              >
                <IconDatabase />
              </SourceSelectorFlyoutCategoryItem>

              <!-- <SourceSelectorFlyoutCategoryItem
                v-model="state.selectedCategory"
                label="SQL Based"
                :value="SourceCategories.SQLBased"
              >
                <IconTableCells />
              </SourceSelectorFlyoutCategoryItem>

              <SourceSelectorFlyoutCategoryItem
                v-model="state.selectedCategory"
                label="Doc Store"
                :value="SourceCategories.DocStore"
              >
                <IconBracketsCurlySolid />
              </SourceSelectorFlyoutCategoryItem>

              <SourceSelectorFlyoutCategoryItem
                v-model="state.selectedCategory"
                label="Streaming"
                :value="SourceCategories.Streaming"
              >
                <IconBarsStaggeredSolid />
              </SourceSelectorFlyoutCategoryItem>

              <SourceSelectorFlyoutCategoryItem
                v-model="state.selectedCategory"
                label="Block Storage"
                :value="SourceCategories.BlockStorage"
              >
                <IconCubeSolid />
              </SourceSelectorFlyoutCategoryItem>

              <SourceSelectorFlyoutCategoryItem
                v-model="state.selectedCategory"
                label="In-Memory"
                :value="SourceCategories.InMemory"
              >
                <IconBinarySolid />
              </SourceSelectorFlyoutCategoryItem>

              <SourceSelectorFlyoutCategoryItem
                v-model="state.selectedCategory"
                label="Time-Series"
                :value="SourceCategories.TimeSeries"
              >
                <IconChartSimpleSolid />
              </SourceSelectorFlyoutCategoryItem>

              <SourceSelectorFlyoutCategoryItem
                v-model="state.selectedCategory"
                label="Graph"
                :value="SourceCategories.Graph"
              >
                <IconCircleNodesSolid />
              </SourceSelectorFlyoutCategoryItem>

              <SourceSelectorFlyoutCategoryItem
                v-model="state.selectedCategory"
                label="Key-Value"
                :value="SourceCategories.KeyValue"
              >
                <IconSquareVSolid />
              </SourceSelectorFlyoutCategoryItem>

              <SourceSelectorFlyoutCategoryItem
                v-model="state.selectedCategory"
                label="API"
                :value="SourceCategories.API"
              >
                <IconPlugSolid />
              </SourceSelectorFlyoutCategoryItem>

              <SourceSelectorFlyoutCategoryItem
                v-model="state.selectedCategory"
                label="HTTP"
                :value="SourceCategories.HTTP"
              >
                <IconEthernetSolid />
              </SourceSelectorFlyoutCategoryItem> -->
            </ul>
          </div>

          <div class="flyout__content">
            <SourceSelectorFlyoutCard
              v-for="sourceType in filteredSourceTypes"
              :key="sourceType.id"
              :source-type="sourceType"
              @add-source="handleSourceAddition"
              @configure-source="handleSourceConfiguration"
            />
          </div>
        </div>
      </template>
    </div>

    <Teleport to="body">
      <Transition>
        <SourceConfigurationFlyout
          v-if="sources.isSourceConfigurationFlyoutOpenInCreateMode"
          :hub-id="hubId"
          @close="toggleSourceConfigurationFlyoutInCreateMode"
          @close-all="closeAllFlyouts"
        />
      </Transition>
    </Teleport>
  </BaseFlyout>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import useHubsStore from '@/stores/hubs.store'
import SourcesService from '@/services/sources.service'
import SourceCategories from '@/enums/sources/SourceCategories.enum'
import type SourceType from '@/types/hubs/SourceType.interface'
import type SourceSelectorFlyoutState from '@/types/components/flyouts/SourceSelectorFlyoutState.interface'

defineProps<{
  hubId: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const hubsStore = useHubsStore()
const { sources } = storeToRefs(hubsStore)
const { toggleSourceConfigurationFlyoutInCreateMode } = hubsStore

const state: SourceSelectorFlyoutState = reactive({
  sourceCatalog: {
    data: [],
    isLoading: false,
    error: null
  },
  searchQuery: '',
  selectedCategory: SourceCategories.All,
  isHostedOnly: false
})

const filteredSourceTypes = computed(() => {
  return state.sourceCatalog.data.filter((sourceType) => {
    const isSearched = sourceType.name
      .toLowerCase()
      .includes(state.searchQuery.toLowerCase())
    const isFromSelectedCategory =
      state.selectedCategory === SourceCategories.All ||
      state.selectedCategory === sourceType.category
    const isHosted = sourceType.isHostable

    return state.isHostedOnly
      ? isHosted && isSearched && isFromSelectedCategory
      : isSearched && isFromSelectedCategory
  })
})

async function fetchSourceCatalog() {
  state.sourceCatalog.error = null
  state.sourceCatalog.isLoading = true

  try {
    const { data } = await SourcesService.getSourcesCatalog()
    state.sourceCatalog.data = data
  } catch (error: unknown) {
    state.sourceCatalog.error = error as Error
  } finally {
    state.sourceCatalog.isLoading = false
  }
}

function closeAllFlyouts() {
  toggleSourceConfigurationFlyoutInCreateMode()
  emit('close')
}

// No-configuration source types
function handleSourceAddition(sourceType: SourceType) {
  emit('close')
}

function handleSourceConfiguration(sourceType: SourceType) {
  toggleSourceConfigurationFlyoutInCreateMode(sourceType)
}

fetchSourceCatalog()
</script>

<style scoped lang="scss">
.flyout {
  padding: toRem(30px) toRem(34px);

  &__loading,
  &__error {
    display: flex;
    justify-content: center;
  }

  &__container {
    display: grid;
    grid-template-columns: toRem(258px) auto;
    align-items: start;
    gap: toRem(40px);
  }

  &__search {
    margin-bottom: toRem(28px);
  }

  &__hosted {
    margin-bottom: toRem(20px);
  }

  &__categories {
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 0;
    list-style-type: none;
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: toRem(25px);
    align-items: stretch;

    @include mq($from: 1440px) {
      gap: toRem(40px);
    }
  }
}
</style>
