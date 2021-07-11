<template>
  <div class="message-item" :class="{'message-item--right':isRight}">
    <UserPic :username="message.user.username" :image="message.user.profilPic"/>
    <div class="message-item__content">
      <div class="message-item__medias-zone">
        <template v-for="(media, i) in message.medias" :key="i">
          <img v-if="media.type.includes('image')" :src="getRealMediaUrl(media.path)" alt=""/>
          <video v-else :src="getRealMediaUrl(media.path)" alt=""/>
        </template>
      </div>
      <p v-if="message.message">
        <template v-for="(line, i) in message.message.split('\n')" :key="i">{{line}}<br></template>
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
import { getConversationMediaUrl } from '@/helpers/path'

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
    const getRealMediaUrl = (url:string) => {
      return getConversationMediaUrl(url)
    }

    return {
      formatDateFromNow,
      getRealMediaUrl
    }
  }
})
</script>

<style>
</style>
