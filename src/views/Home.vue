<template>
  <div class="home">
    <DialogWrapper/>
    <Header class="home__header"/>
    <Drawer class="home__drawer"/>
    <main class="home__content">
      <router-view/>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'

import Drawer from '@/components/layout/Drawer.vue'
import Header from '@/components/layout/Header.vue'
import DialogWrapper from '@/components/DialogWrapper.vue'

import { createClient } from '@/services/socket-io.service'

export default defineComponent({
  name: 'Home',
  components: {
    Drawer,
    Header,
    DialogWrapper
  },
  setup () {
    onMounted(() => {
      const client = createClient()
      console.log(client)
      setTimeout(() => {
        const message = {
          name: 'John',
          text: 'Test',
          room: 'Room1'
        }
        client.emit('msgToServer', message)
      }, 500)
    })
  }
})
</script>
