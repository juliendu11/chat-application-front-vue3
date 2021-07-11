<template>
  <div v-if="dialog.show" class="dialog-wrapper">
    <div class="dialog-wrapper__mask" />
    <div class="dialog-wrapper__container" :style="'width:'+ dialog.width"  >
        <AddRoomDialog @close="onClose"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useMitt } from '../plugins/mitt'

import AddRoomDialog from '@/components/DialogAddRoom.vue'

import DialogWrapperState from '@/types/DialogWrapperState'

export default defineComponent({
  name: 'DialogWrapper',
  components: { AddRoomDialog },
  setup () {
    const mitt = useMitt()

    const dialog = reactive<DialogWrapperState>({
      show: false,
      name: '',
      width: '500px',
      exitFunc: null
    })

    mitt.dialogContainer.listen((value) => {
      dialog.show = true
      dialog.name = value.name
      dialog.width = value.width || '500px'
      dialog.exitFunc = value.exitFunc
    })

    const onClose = (val:any) => {
      dialog.show = false
      dialog.name = ''
      if (dialog.exitFunc) {
        dialog.exitFunc(val)
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
