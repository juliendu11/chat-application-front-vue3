<template>
  <div class="home">
    <DialogWrapper/>
    <Header class="home__header"/>
    <Drawer class="home__drawer"/>
    <RightDrawer/>
    <main class="home__content">
      <router-view/>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useQuery } from '@vue/apollo-composable'

import MyInformation from '@/graphql/member/queries/MyInformation.gql'

import Drawer from '@/components/layout/Drawer.vue'
import RightDrawer from '@/components/layout/RightDrawer.vue'
import Header from '@/components/layout/Header.vue'
import DialogWrapper from '@/components/DialogWrapper.vue'
import { useStore } from '../store/Store'

import MyMemberInfo from '@/types/MyMemberInfo'

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

    const { onResult } = useQuery<{myInformation:MyMemberInfo}>(MyInformation)

    onResult((result) => {
      if (result.data) {
        store.member.updateEmail(result.data.myInformation.email)
        store.member.updateUsername(result.data.myInformation.username)
        store.member.updateId(result.data.myInformation._id)
      }
    })
  }
})
</script>
