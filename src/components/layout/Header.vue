<template>
  <header>
      <Logo/>
      <nav class="nav">
        <ul>
          <li class="active"><a href="#">Conversation</a></li>
          <li><a href="#">Contacts</a></li>
          <li><a href="#">Tasks</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </nav>
      <UserPic username="Test" @click="onClickOpenProfil"/>
    </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Logo from '@/components/Logo.vue'
import UserPic from '@/components/UserPic.vue'
import { useMitt } from '../../plugins/mitt'

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
      onClickOpenProfil
    }
  }
})
</script>

<style>

</style>
