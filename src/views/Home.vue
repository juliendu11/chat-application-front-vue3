<template>
  <div class="home">
    <DialogWrapper />
    <Header class="home__header" />
    <Drawer class="home__drawer" />
    <RightDrawer />
    <main class="home__content">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import {
  useQuery,
  useSubscription
} from '@vue/apollo-composable'

import MyInformation from '@/graphql/member/queries/MyInformation.gql'
import MemberOnline from '@/graphql/member/subscriptions/MemberOnline.gql'
import MemberOffline from '@/graphql/member/subscriptions/MemberOffline.gql'

import {
  MemberOnlineInput,
  MemberOnlineOutput
} from '@/types/graphql/member/MemberOnline'
import {
  MemberOfflineInput,
  MemberOfflineOutput
} from '@/types/graphql/member/MemberOffline'

import {
  MemberMyInfoInput,
  MemberMyInfoOutput
} from '@/types/graphql/member/MemberMyInfo'

import Drawer from '@/components/layout/Drawer.vue'
import RightDrawer from '@/components/layout/RightDrawer.vue'
import Header from '@/components/layout/Header.vue'
import DialogWrapper from '@/components/DialogWrapper.vue'
import { useStore } from '../store/Store'

import { useMitt } from '@/plugins/mitt'

export default defineComponent({
  name: 'Home',
  components: {
    Drawer,
    Header,
    DialogWrapper,
    RightDrawer
  },
  setup () {
    const store = useStore()
    const mitt = useMitt()

    const { onResult } = useQuery<MemberMyInfoOutput, MemberMyInfoInput>(
      MyInformation
    )

    onResult((result) => {
      if (result.data && result.data.memberMyInformation.result) {
        store.member.updateEmail(result.data.memberMyInformation.value.email)
        store.member.updateUsername(result.data.memberMyInformation.value.username)
        store.member.updateId(result.data.memberMyInformation.value._id)
        store.member.updateProfilPic(result.data.memberMyInformation.value.profilPic)
      }
    })

    const { result: memberOnlineResult } = useSubscription<
      MemberOnlineOutput,
      MemberOnlineInput
    >(MemberOnline)

    watch(memberOnlineResult, (val) => {
      mitt.memberOnlineStatusChanged.emit({
        member: val.memberOnline,
        isOnline: true
      })
    })

    const { result: memberOfflineResult } = useSubscription<
      MemberOfflineOutput,
      MemberOfflineInput
    >(MemberOffline)

    watch(memberOfflineResult, (val) => {
      mitt.memberOnlineStatusChanged.emit({
        member: val.memberOffline,
        isOnline: false
      })
    })
  }
})
</script>
