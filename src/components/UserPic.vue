<template>
  <div class="user-pic" @click="onClickProfil">
        <img v-if="image" :src="image" :alt="username + ' profil picture'">
        <span v-else>
          {{capitalizeAndGetFirstLetter(username)}}
        </span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { capitalizeAndGetFirstLetter } from '@/common/text-format'
import { useRouter } from 'vue-router'

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
    const router = useRouter()

    const onClickProfil = () => {
      router.push('/profil')
    }

    return {
      onClickProfil,
      capitalizeAndGetFirstLetter
    }
  }
})
</script>

<style>

</style>
