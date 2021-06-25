<template>
  <div class="contact-page">
    <div class="contact-page__header">
       <Button :isIcon="true" type="btn-clean" color="primary" @click="onClickReturn">
         <i class="fa fa-chevron-left" aria-hidden="true"></i>
       </Button>
    </div>
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
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useQuery, useResult, useApolloClient } from '@vue/apollo-composable'
import ContactCard from '@/components/cards/ContactCard.vue'

import MembersInfo from '@/graphql/member/queries/MembersInfo.gql'
import { MembersInfoInput, MembersInfoOuput } from '@/types/graphql/member/MembersInfo'
import { useStore } from '../store/Store'
import { useMitt } from '@/plugins/mitt'
import { cloneDeep } from '@apollo/client/utilities'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Contact',
  components: { ContactCard },
  setup () {
    const store = useStore()
    const mitt = useMitt()
    const { resolveClient } = useApolloClient()
    const client = resolveClient()
    const router = useRouter()

    const { result } = useQuery<MembersInfoOuput, MembersInfoInput>(MembersInfo)

    const users = useResult(result, [], (data) => data.membersInfo.members)

    const onlineUsers = computed(() => {
      return users.value
        .filter((x) => x.isOnline)
        .filter((x) => x._id !== store.member.getId())
    })

    const offlineUsers = computed(() => {
      return users.value
        .filter((x) => !x.isOnline)
        .filter((x) => x._id !== store.member.getId())
    })

    const updateUserOnlineStatus = (memberIndex:number, isOnline:boolean) => {
      const data = client.readQuery<MembersInfoOuput, MembersInfoInput>({
        query: MembersInfo
      })
      if (!data) return

      const copyMembers = cloneDeep(data.membersInfo.members)
      copyMembers[memberIndex].isOnline = isOnline

      client.writeQuery<MembersInfoOuput>({
        query: MembersInfo,
        data: {
          membersInfo: {
            ...data.membersInfo,
            members: copyMembers
          }
        }
      })
    }

    const subscribe = () => {
      mitt.memberOnlineStatusChanged.listen((args) => {
        if (users.value.length === 0) return

        const findMemberIndex = users.value.findIndex(x => args.member._id === x._id)
        if (findMemberIndex !== -1) {
          updateUserOnlineStatus(findMemberIndex, args.isOnline)
        }
      })
    }

    onMounted(() => {
      subscribe()
    })

    const onClickReturn = () => {
      router.push('/')
    }

    return {
      onlineUsers,
      offlineUsers,
      onClickReturn
    }
  }
})
</script>

<style>
</style>
