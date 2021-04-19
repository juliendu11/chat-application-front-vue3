<template>
  <div v-if="dialog.show" class="dialog-wrapper">
    <div class="dialog-wrapper__mask" />
    <div class="dialog-wrapper__container" :style="'width:'+ dialog.width"  >
        <AddRoomDialog/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useMitt } from '../plugins/mitt'

import AddRoomDialog from '@/components/dialogs/AddRoomDialog.vue'

export default defineComponent({
  name: 'DialogWrapper',
  components: { AddRoomDialog },
  setup () {
    const mitt = useMitt()

    const dialog = reactive({
      show: false,
      name: '',
      width: '500px',
      exitFunc: () => { return 1 }
    })

    mitt.dialogContainer.listen((value) => {
      dialog.show = true
      dialog.name = value.name
      dialog.width = value.width || '500px'
      dialog.exitFunc = value.exitFunc
    })

    const onClose = () => {
      dialog.show = false
      dialog.name = ''
      if (dialog.exitFunc) {
        dialog.exitFunc()
      }
    }

    return {
      dialog,
      onClose
    }
  }
})
</script>

<style>
</style>
