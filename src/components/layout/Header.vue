<template>
  <header class="header">
    <Logo class="header__logo" />
    <nav class="nav">
      <ul>
        <router-link  to="/contacts" v-slot="{ isActive }">
          <li :class="{ active: isActive }"><a href="#">Contacts</a></li>
        </router-link>
      </ul>
    </nav>
    <UserPic
      :username="username"
      :image="profilPic"
      @click="onClickOpenProfil"
    />
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Logo from '@/components/Logo.vue'
import UserPic from '@/components/UserPic.vue'
import { useMitt } from '../../plugins/mitt'
import { getProfilInformation } from '@/common/profil'

export default defineComponent({
  name: 'Header',
  components: {
    Logo,
    UserPic
  },
  setup () {
    const mitt = useMitt()

    const onClickOpenProfil = () => {
      mitt.rightDrawer.emit()
    }

    return {
      onClickOpenProfil,
      ...getProfilInformation()
    }
  }
})
</script>

<style>
</style>
