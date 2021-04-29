<template>
  <div class="user-pic">
        <img v-if="image && !imageError" :src="image" :alt="username + ' profil picture'" @error="onImageError">
        <span else>
          {{capitalizeAndGetFirstLetter(username)}}
        </span>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

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
    const imageError = ref(false)

    const onImageError = () => {
      imageError.value = true
    }

    return {
      capitalizeAndGetFirstLetter,
      onImageError,
      imageError
    }
  }
})
</script>

<style>

</style>
