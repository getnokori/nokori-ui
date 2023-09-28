<template>
  <div class="members">
    <div class="members__desc">
      <p>Use this screen to manage your team and invite new members.</p>
    </div>

    <div class="members-section">
      <div class="members-section__header">
        <div>
          <div class="members-section__title">Invite Link</div>
          <p class="members-section__desc">
            Use this link to invite new members to your account
          </p>
        </div>
      </div>

      <div class="members-section__body">
        <div class="members-section__field">
          <BaseField
            id="members-invite-link"
            v-model="state.inviteLink"
            disabled
          />
        </div>

        <div class="members-section__btn">
          <BaseButton
            v-tooltip="{
              content: 'Copied',
              distance: 10,
              shown: copied,
              triggers: []
            }"
            @click="copy()"
          >
            Copy Link
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="members-section">
      <div class="members-section__header">
        <div>
          <div class="members-section__title">Members</div>
          <p class="members-section__desc">Manage your team members here</p>
        </div>

        <div class="members-section__btn">
          <BaseButton>Add Members</BaseButton>
        </div>
      </div>

      <div class="members-section__body">
        <table class="members-table">
          <tr
            v-for="member of data"
            :key="member.key"
            class="members-table__tr"
          >
            <td class="members-table__td members-table__td--avatar">
              <div class="members-table__avatar">
                <img :src="member.avatar" :alt="member.name" />
              </div>
            </td>

            <td class="members-table__td members-table__td--name">
              <div class="members-table__name">{{ member.name }}</div>
              <div class="members-table__email">{{ member.email }}</div>
            </td>

            <td class="members-table__td members-table__td--type">
              <BaseSelect id="member-type-selector" v-model="member.type">
                <option value="admin">Admin</option>
                <option value="maintainer">Maintainer</option>
              </BaseSelect>
            </td>

            <td class="members-table__td members-table__td--remove">
              <button
                class="members-table__remove-btn"
                @click="toggleConfirmationModal"
              >
                Remove
                <IconTrashCanRegular />
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div class="members__footer">
      <div class="members__actions">
        <div class="members__btn">
          <BaseButton
            btn-style="text-plain"
            type="button"
            @click="$emit('close')"
            >Close</BaseButton
          >
        </div>

        <div class="members__btn members__btn--update">
          <BaseButton type="submit">Update</BaseButton>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <Transition>
      <ActionConfirmationModal
        v-if="state.isConfirmationModalOpen"
        title="Remove Member?"
        description="Are you sure you want to perform this action? You cannot undo this action."
        keyword="delete"
        btn-label="Remove Member"
        @confirmed="handleMemberRemove"
        @close="toggleConfirmationModal"
      />
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useClipboard } from '@vueuse/core'
import type AccountSettingsModalMembersState from '@/types/components/modals/account-settings/AccountSettingsModalMembersState.interface'

// TEMP data
const data = [
  {
    key: 1,
    avatar: 'https://i.pravatar.cc/48',
    name: 'Stanley Dan',
    email: 'stanley.dan@gmail.com',
    type: 'admin'
  },
  {
    key: 2,
    avatar: 'https://i.pravatar.cc/48',
    name: 'Danny Stan',
    email: 'danny.stan@gmail.com',
    type: 'maintainer'
  }
]

defineEmits<{
  (e: 'close'): void
}>()

const state: AccountSettingsModalMembersState = reactive({
  inviteLink: 'https://app.nokori.com/signup?referral=FJ842F23992011ADF!',
  isConfirmationModalOpen: false
})

const { copy, copied } = useClipboard({ source: state.inviteLink })

async function handleMemberRemove() {
  // TODO: wire up memeber removing
}

function toggleConfirmationModal() {
  state.isConfirmationModalOpen = !state.isConfirmationModalOpen
}
</script>

<style scoped lang="scss">
.members {
  padding-top: toRem(18px);
  padding-bottom: toRem(18px);

  &__desc {
    @include clear-children-margins;
    margin-bottom: toRem(30px);
    font-size: toRem(16px);
    line-height: 1.5;
  }

  &__footer {
    padding-top: toRem(28px);
    border-top: 1px solid #3a3d45;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }

  &__btn {
    margin-right: toRem(14px);

    &:last-child {
      margin-right: 0;
    }

    &--update {
      & > .base-btn {
        min-width: toRem(164px);
      }
    }
  }
}

.members-section {
  margin-bottom: toRem(35px);
  padding-top: toRem(25px);
  padding-bottom: toRem(35px);
  padding-left: toRem(25px);
  padding-right: toRem(25px);
  background-color: #27282c;
  border-radius: toRem(6px);

  &:last-child {
    margin-bottom: 0;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: toRem(18px);
    border-bottom: 1px solid #3a3d45;
  }

  &__title {
    margin-bottom: toRem(12px);
    font-size: toRem(18px);
    font-weight: 700;
    line-height: 1.2;
  }

  &__desc {
    margin-top: 0;
    margin-bottom: 0;
    color: #dcdcdc;
    font-size: toRem(16px);
    line-height: 1.2;
  }

  &__body {
    display: flex;
    padding-top: toRem(30px);
  }

  &__field {
    flex-grow: 1;
    margin-right: toRem(10px);

    &:deep(.base-field__input) {
      background-color: hsl(225, 7%, 22%);
      border-color: hsl(225, 7%, 22%);
    }
  }

  &__btn {
    flex-shrink: 0;
    width: 100%;
    max-width: toRem(140px);

    &:deep(.base-btn) {
      width: 100%;
    }
  }
}

.members-table {
  width: 100%;
  border-collapse: collapse;

  &__tr {
    &:last-child {
      .members-table__td {
        padding-bottom: 0;
      }
    }
  }

  &__td {
    padding-bottom: toRem(18px);
    padding-left: toRem(15px);
    padding-right: toRem(15px);

    &:first-child {
      padding-left: 0;
      padding-right: 0;
    }

    &:last-child {
      padding-right: 0;
      text-align: right;
    }

    &--avatar {
      width: toRem(48px);
    }

    &--type {
      max-width: toRem(80px);
    }
  }

  &__avatar {
    width: toRem(48px);
    height: toRem(48px);

    & > img {
      display: block;
      width: 100%;
      border-radius: 50%;
    }
  }

  &__name {
    margin-bottom: toRem(2px);
    color: #fff;
    font-size: toRem(15px);
    font-weight: 600;
    line-height: 1.2;
  }

  &__email {
    color: #fff;
    font-size: toRem(15px);
    line-height: 1.2;
  }

  &__remove-btn {
    display: inline-flex;
    align-items: center;
    padding: 0;
    background-color: transparent;
    border: 0;
    cursor: pointer;

    & > svg {
      margin-left: toRem(8px);
      width: toRem(13px);
      height: toRem(15px);
      fill: #d8d8d8;
    }
  }
}
</style>
