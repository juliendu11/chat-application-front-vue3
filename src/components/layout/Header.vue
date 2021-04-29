<template>
  <header>
      <Logo/>
      <nav class="nav">
        <ul>
          <li :class="{'active':activePage === 'conversation'}"><a href="#" @click.prevent="onClickChangePage('conversation')">Conversation</a></li>
          <li :class="{'active':activePage === 'contacts'}"><a href="#" @click.prevent="onClickChangePage('contacts')">Contacts</a></li>
          <li :class="{'active':activePage === 'tasks'}"><a href="#" @click.prevent="onClickChangePage('tasks')">Tasks</a></li>
          <li :class="{'active':activePage === 'settings'}"><a href="#" @click.prevent="onClickChangePage('settings')">Settings</a></li>
        </ul>
      </nav>
      <UserPic username="Test" @click="onClickOpenProfil"/>
    </header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import Logo from '@/components/Logo.vue'
import UserPic from '@/components/UserPic.vue'
import { useMitt } from '../../plugins/mitt'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Header',
  components: {
    Logo,
    UserPic
  },
  setup () {
    const mitt = useMitt()
    const router = useRouter()

    const activePage = ref('conversation')

    const onClickOpenProfil = () => {
      mitt.rightDrawer.emit()
    }

    const onClickChangePage = (toPage:string) => {
      activePage.value = toPage
      if (toPage === 'conversation') {
        router.push('/')
        return
      }
      router.push('/' + toPage)
    }

    return {
      onClickOpenProfil,
      activePage,
      onClickChangePage
    }
  }
})
</script>

<style>

</style>
