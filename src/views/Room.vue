<template>
    <div class="tchat">
        <div class="tchat__header"></div>
        <div class="tchat__content"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'

import MessageItem from '@/types/MessageItem'
export default defineComponent({
  name: 'Room',
  setup () {
    const messageToSend = ref('')
    const messages = ref<MessageItem[]>([])

    const pagination = reactive({
      skip: 0,
      limit: 8,
      moreAvailable: true,
      pageCount: 5,
      page: 1
    })
  }
})
</script>

<style>

</style>
