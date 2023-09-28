<template>
  <div class="card">
    <div class="card__header">
      <div class="card__header-top">
        <div class="card__title">{{ sourceType.name }}</div>

        <div class="card__badge">
          <template v-if="sourceType.category === SourceCategories.SQLBased">
            <IconTableCells />
            SQL Based
          </template>

          <template
            v-else-if="sourceType.category === SourceCategories.DocStore"
          >
            <IconBracketsCurlySolid />
            Doc Store
          </template>

          <template
            v-else-if="sourceType.category === SourceCategories.Streaming"
          >
            <IconBarsStaggeredSolid />
            Streaming
          </template>

          <template
            v-else-if="sourceType.category === SourceCategories.BlockStorage"
          >
            <IconCubeSolid />
            Block Storage
          </template>

          <template
            v-else-if="sourceType.category === SourceCategories.InMemory"
          >
            <IconBinarySolid />
            In-Memory
          </template>

          <template
            v-else-if="sourceType.category === SourceCategories.TimeSeries"
          >
            <IconChartSimpleSolid />
            Time-Series
          </template>

          <template v-else-if="sourceType.category === SourceCategories.Graph">
            <IconCircleNodesSolid />
            Graph
          </template>

          <template
            v-else-if="sourceType.category === SourceCategories.KeyValue"
          >
            <IconSquareVSolid />
            Key-Value
          </template>

          <template v-else-if="sourceType.category === SourceCategories.API">
            <IconPlugSolid />
            API
          </template>

          <template v-else-if="sourceType.category === SourceCategories.HTTP">
            <IconEthernetSolid />
            HTTP
          </template>
        </div>
      </div>

      <a class="card__link" :href="sourceType.website" target="_blank">
        {{ sourceType.websiteAnchorText }}
        <template v-if="!!sourceType.websiteAnchorText">
          <IconUpRightFromSquare />
        </template>
      </a>

      <div class="card__logo">
        <img :src="sourceType.logo" :alt="sourceType.name" />
      </div>
    </div>

    <div class="card__body">
      <div class="card__desc">
        {{ sourceType.description }}
      </div>
    </div>

    <div class="card__footer">
      <div class="card__meta">
        <button class="card__btn" type="button" @click="handleButtonClick">
          {{ sourceType.buttonText }}
          <IconCirclePlusSolid />
        </button>

        <IconBoltLightningSolid
          v-if="(sourceType.isHostable as boolean)"
          v-tooltip="{ content: 'Can be hosted!', distance: 12 }"
          class="card__hosted"
        />
      </div>

      <a class="card__link" :href="sourceType.docsURL" target="_blank">
        Read the docs
        <IconUpRightFromSquare />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import SourceCategories from '@/enums/sources/SourceCategories.enum'

const props = defineProps<{
  sourceType: any
}>()

const emit = defineEmits<{
  (e: 'addSource', sourceType: any): void
  (e: 'configureSource', sourceType: any): void
}>()

function handleButtonClick() {
  if (props.sourceType.isConfigurable) {
    emit('configureSource', props.sourceType)
  } else {
    emit('addSource', props.sourceType)
  }
}
</script>

<style scoped lang="scss">
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #282a2e;
  border-radius: toRem(6px);

  &__header {
    margin-bottom: toRem(30px);
    padding-top: toRem(20px);
    padding-left: toRem(20px);
    padding-right: toRem(100px);
  }

  &__header-top {
    display: flex;
    align-items: center;
    margin-bottom: toRem(4px);
  }

  &__logo {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: toRem(10px);
    width: toRem(80px);
    height: toRem(80px);
    background-color: #45484f;
    border-top-right-radius: toRem(6px);
    border-bottom-left-radius: toRem(12px);

    > img {
      display: block;
      max-width: 100%;
    }
  }

  &__title {
    margin-right: toRem(8px);
    font-size: toRem(22px);
    font-weight: 600;
    line-height: 1.2;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    color: #dcdcdc;
    font-size: toRem(16px);
    font-weight: 500;
    line-height: 1.2;
    text-decoration: none;
    transition: var(--default-transition);

    &:hover {
      color: var(--primary);

      svg {
        fill: var(--primary);
      }
    }

    svg {
      flex-shrink: 0;
      margin-left: toRem(7px);
      width: toRem(15px);
      height: toRem(13px);
      fill: #dcdcdc;
      transition: var(--default-transition);
    }
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    padding-left: toRem(6px);
    padding-right: toRem(6px);
    height: toRem(22px);
    color: #dcdcdc;
    background-color: #0074f4;
    border-radius: toRem(6px);
    font-size: toRem(13px);
    font-weight: 500;
    line-height: 1.2;
    white-space: nowrap;

    svg {
      margin-right: toRem(6px);
      width: toRem(13px);
      height: toRem(13px);
      fill: currentColor;
    }
  }

  &__body {
    margin-bottom: toRem(20px);
    padding-left: toRem(20px);
    padding-right: toRem(20px);
  }

  &__desc {
    color: #e8e8e8;
    font-size: toRem(15px);
    font-weight: 500;
    line-height: 1.6;
  }

  &__footer {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: toRem(20px);
    border-top: 1px solid #45484f;

    @include mq($from: 1360px) {
      flex-direction: row;
      align-items: center;
    }

    .card__link {
      white-space: nowrap;
      display: flex;
      align-items: center;

      @include mq($from: 1360px) {
        margin-left: auto;
      }
    }
  }

  &__meta {
    display: flex;
    align-items: center;
    margin-bottom: toRem(15px);

    @include mq($from: 1360px) {
      margin-bottom: 0;
    }
  }

  &__btn {
    display: flex;
    align-items: center;
    padding: 0 toRem(12px);
    height: toRem(42px);
    color: inherit;
    background-color: hsl(222 7% 29%);
    border: 0;
    border-radius: toRem(6px);
    font-size: toRem(15px);
    font-weight: 700;
    line-height: normal;
    white-space: nowrap;
    transition: var(--default-transition);
    cursor: pointer;

    &:hover {
      background-color: hsl(222 7% 39%);
    }

    &:active {
      background-color: hsl(222 7% 34%);
    }

    svg {
      flex-shrink: 0;
      margin-left: toRem(8px);
      width: toRem(16px);
      height: toRem(16px);
      fill: currentColor;
    }
  }

  &__hosted {
    flex-shrink: 0;
    margin-left: toRem(15px);
    width: toRem(12px);
    height: toRem(16px);
    fill: #00b357;
    cursor: help;
  }
}
</style>
