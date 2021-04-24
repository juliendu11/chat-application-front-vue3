<template>
  <div v-if="show" class="dialog-wrapper__mask" />
  <div class="right-drawer" :class="{'right-drawer--show':show}">
    <UserPic username="username"/>
    <h3>Username</h3>
    <input id="fileInput" type="file" hidden accept="image/*" @change="onAddFiles">
    <Button color="primary" @click="onClickChangeImage"> Change image </Button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import UserPic from '@/components/UserPic.vue'
import { useMitt } from '../../plugins/mitt'

export default defineComponent({
  name: 'RightDrawer',
  components: { UserPic },
  setup () {
    const mitt = useMitt()
    const show = ref(false)

    mitt.rightDrawer.listen(() => {
      show.value = true
    })

    const onClickChangeImage = () => {
      const fileInput = document.querySelector('#fileInput')
      if (fileInput) {
        (fileInput as any).click()
      }
    }

    const onAddFiles = (e:any) => {
      const file = (e.target.files as FileList).item(0)
      console.log(file)
    }

    return {
      show,
      onClickChangeImage,
      onAddFiles
    }
  }
})
</script>

<style>
</style>
