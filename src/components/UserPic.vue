<template>
  <div class="user-pic">
        <img v-if="image" :src="image" :alt="username + ' profil picture'">
        <span v-else>
          {{capitalizeAndGetFirstLetter(username)}}
        </span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { capitalizeAndGetFirstLetter } from '@/common/text-format'

export default defineComponent({
  name: 'UserPic',
  props: {
    username: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    }
  },
  setup () {
    return {
      capitalizeAndGetFirstLetter
    }
  }
})
</script>

<style>

</style>
