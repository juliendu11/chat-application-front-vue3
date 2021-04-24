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
import { defineComponent } from 'vue'

import Drawer from '@/components/layout/Drawer.vue'
import Header from '@/components/layout/Header.vue'
import DialogWrapper from '@/components/DialogWrapper.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Drawer,
    Header,
    DialogWrapper
  }
})
</script>
