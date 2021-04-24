<template>
  <div class="message-item" :class="{'message-item--right':isRight}">
    <img :src="message.user.profilPic" :alt="message.user.username" />
    <div class="message-item__content">
      <p>
        {{message.text}}
      </p>
      <span>{{formatDateFromNow(message.date)}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import MessageItem from '../types/MessageItem'
import { formatDateFromNow } from '@/common/date'

export default defineComponent({
  name: 'MessageItem',
  props: {
    message: {
      type: Object as PropType<MessageItem>,
      required: true
    },
    isRight: {
      type: Boolean,
      default: false
    }
  },
  setup () {
    return {
      formatDateFromNow
    }
  }
})
</script>

<style>
</style>
