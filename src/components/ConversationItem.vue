<template>
  <div class="conversation-item">
    <div class="conversation-item__header">
      <span v-if="title">{{ title }}</span>
      <UserPic v-else :username="from" :image="profilPic" />
    </div>
    <div
      class="conversation-item__content"
      :class="{ 'conversation-item__content--new-msg': isNewMessage }"
    >
      <span>{{ from }}</span>
      <p>{{ message }}</p>
    </div>
    <div class="conversation-item__extra">
      <span>{{ date }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserPic from '@/components/UserPic.vue'

export default defineComponent({
  name: 'ConversationItem',
  components: { UserPic },
  props: {
    isNewMessage: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      required: true
    },
    profilPic: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  }
})
</script>
