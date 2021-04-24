<template>
  <div class="message-item" :class="{'message-item--right':isRight}">
    <UserPic :username="message.user.username" :image="message.user.profilPic"/>
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
import UserPic from '@/components/UserPic.vue'

export default defineComponent({
  name: 'MessageItem',
  components: { UserPic },
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
