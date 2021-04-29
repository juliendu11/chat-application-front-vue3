<template>
  <div class="contact-page">
    <perfect-scrollbar>
      <div class="contact-page__container">
        <div>
        <h3>Online</h3>
        <div class="contact-page__list">
          <ContactCard
            v-for="user in onlineUsers"
            :user="user"
            :key="user.username"
          />
        </div>
      </div>
      <div>
        <h3>Offline</h3>
        <div class="contact-page__list">
          <ContactCard
            v-for="user in offlineUsers"
            :user="user"
            :key="user.username"
          />
        </div>
      </div>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useQuery, useResult } from '@vue/apollo-composable'
import ContactCard from '@/components/cards/ContactCard.vue'

import MembersInfo from '@/graphql/member/queries/MembersInfo.gql'
import { MembersInfoInput, MembersInfoOuput } from '@/types/graphql/member/MembersInfo'

export default defineComponent({
  name: 'Contact',
  components: { ContactCard },
  setup () {
    const { result } = useQuery<MembersInfoOuput, MembersInfoInput>(MembersInfo)

    const users = useResult(result, [], (data) => data.membersInfo.members)

    const onlineUsers = computed(() => {
      return users.value.filter((x) => x.isOnline)
    })

    const offlineUsers = computed(() => {
      return users.value.filter((x) => !x.isOnline)
    })

    return {
      onlineUsers,
      offlineUsers
    }
  }
})
</script>

<style>
</style>
