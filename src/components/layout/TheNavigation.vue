<template>
  <nav class="nav">
    <ul class="nav__container">
      <li class="nav__item">
        <RouterLink
          :class="[
            'nav__link nav__link--stroke',
            isActive(RouteNames.ROOT) ? 'router-link-active' : ''
          ]"
          :to="{ name: RouteNames.ROOT }"
        >
          <ChartBarIcon class="nav__icon--stroke nav__icon" />
        </RouterLink>
      </li>
      <li class="nav__item">
        <RouterLink
          :class="[
            'nav__link nav__link--fill',
            isActive(RouteNames.HUBS) ? 'router-link-active' : ''
          ]"
          :to="{ name: RouteNames.HUBS }"
        >
          <IconNavHubs class="nav__icon--fill nav__icon" />
        </RouterLink>
      </li>
      <li class="nav__item">
        <RouterLink
          :class="[
            'nav__link nav__link--fill',
            isActive(RouteNames.AUTH) ? 'router-link-active' : ''
          ]"
          :to="{ name: RouteNames.AUTH }"
          :exact="false"
        >
          <IconUsersRegular class="nav__icon--fill nav__icon" />
        </RouterLink>
      </li>
      <li class="nav__item">
        <RouterLink
          :class="[
            'nav__link nav__link--fill',
            isActive(RouteNames.MAIL) ? 'router-link-active' : ''
          ]"
          :to="{ name: RouteNames.MAIL }"
          :exact="false"
        >
          <EnvelopeIcon class="nav__icon--stroke nav__icon" />
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import RouteNames from '@/enums/RouteNames.enum'
import { ChartBarIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'

import IconPeopleRegular from '@/components/icons/IconPeopleRegular.vue'
import IconMailboxOutline from '@/components/icons/IconMailboxOutline.vue'
import IconMailboxFlagUpRegular from '@/components/icons/IconMailboxFlagUpRegular.vue'
import IconUserAstronaut from '@/components/icons/IconUserAstronautRegular.vue'
import IconEnvelopeOutline from '@/components/icons/IconEnvelopeOutline.vue'
import IconUsersRegular from '@/components/icons/IconUsersRegular.vue'
import IconSendOutline from '@/components/icons/IconSendOutline.vue'
const route = useRoute()

function isActive(href: string) {
  const baseHref = href.split('/')[0]
  return route.path.split('/')[1] === baseHref
}
</script>

<style scoped lang="scss">
.nav {
  --padding: 0.875rem; // 14px
}

.nav {
  padding: var(--padding);
  width: var(--nav-width);
  height: 100%;
  background-color: #27282c;

  &__container {
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 0;
    list-style-type: none;
  }

  &__item {
    margin-bottom: toRem(8px);
  }

  &__link {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: calc(var(--nav-width) - var(--padding) * 2);
    border-radius: toRem(6px);
    transition: var(--default-transition);

    &:hover {
      background-color: #35373d;

      .nav__icon--fill {
        fill: #fff;
      }

      .nav__icon--stroke {
        stroke: #fff;
      }
    }

    &.router-link-active {
      background-color: #35373d;

      .nav__icon--fill {
        fill: #fff;
      }

      .nav__icon--stroke {
        stroke: #fff;
      }
    }
  }

  &__icon {
    transition: var(--default-transition);
    width: toRem(26px);
    height: toRem(26px);

    &--fill {
      fill: #666;
    }

    &--stroke {
      stroke: #6f7276;
    }
  }
}
</style>
