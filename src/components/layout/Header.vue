<template>
  <header class="header">
      <Logo class="header__logo" @click="onClickHome"/>
      <nav class="nav">
        <ul>
          <li  @click.prevent="onClickChangePage('contacts')" :class="{'active':$route.name === 'Contacts'}"><a href="#">Contacts</a></li>
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

    const onClickHome = () => {
      router.push('/')
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
      ...getProfilInformation(),
      onClickHome
    }
  }
})
</script>

<style>

</style>
