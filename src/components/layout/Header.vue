<template>
  <header>
      <Logo/>
      <nav class="nav">
        <ul>
          <li :class="{'active':$route.name === 'Home'}"><a href="#" @click.prevent="onClickChangePage('conversation')">Conversation</a></li>
          <li :class="{'active':$route.name === 'Contacts'}"><a href="#" @click.prevent="onClickChangePage('contacts')">Contacts</a></li>
          <li :class="{'active':$route.name === 'Tasks'}"><a href="#" @click.prevent="onClickChangePage('tasks')">Tasks</a></li>
          <li :class="{'active':$route.name === 'Settings'}"><a href="#" @click.prevent="onClickChangePage('settings')">Settings</a></li>
        </ul>
      </nav>
      <UserPic :username="username" :image="profilPic" @click="onClickOpenProfil"/>
    </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Logo from '@/components/Logo.vue'
import UserPic from '@/components/UserPic.vue'
import { useMitt } from '../../plugins/mitt'
import { useRouter } from 'vue-router'
import { getProfilInformation } from '@/common/profil'

export default defineComponent({
  name: 'Header',
  components: {
    Logo,
    UserPic
  },
  setup () {
    const mitt = useMitt()
    const router = useRouter()

    const onClickOpenProfil = () => {
      mitt.rightDrawer.emit()
    }

    const onClickChangePage = (toPage:string) => {
      if (toPage === 'conversation') {
        router.push('/')
        return
      }
      router.push('/' + toPage)
    }

    return {
      onClickOpenProfil,
      onClickChangePage,
      ...getProfilInformation()
    }
  }
})
</script>

<style>

</style>
