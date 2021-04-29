<template>
  <div class="user-pic">
        <img v-if="realImageUrl && !imageError" :src="realImageUrl" :alt="username + ' profil picture'" @error="onImageError">
        <span v-else-if="!realImageUrl||imageError">
          {{capitalizeAndGetFirstLetter(username)}}
        </span>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

import { capitalizeAndGetFirstLetter } from '@/common/text-format'
import { getProfilPicUrl } from '@/helpers/path'

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
  setup (props) {
    const imageError = ref(false)

    const onImageError = () => {
      imageError.value = true
    }

    const realImageUrl = computed(() => {
      return getProfilPicUrl(props.image)
    })

    return {
      capitalizeAndGetFirstLetter,
      onImageError,
      imageError,
      realImageUrl
    }
  }
})
</script>

<style>

</style>
