<template>
  <div class="file-selected">
    <Button :isIcon="true" color="gray2" @click="onClickDelete">
      <i class="fa fa-close" aria-hidden="true"></i>
    </Button>
    <img
      v-if="file.type === 'image'"
      :src="file.src"
      :title="file.title"
      @click="onOpenMedia"
    />
    <video v-else :src="file.src" :title="file.title" @click="onOpenMedia" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { MediaSelected } from '@/types/MediaSelected'
import { useMitt } from '@/plugins/mitt'

export default defineComponent({
  name: 'FileSelected',
  props: {
    file: {
      type: Object as PropType<MediaSelected>,
      require: true
    }
  },
  emits: ['on-delete'],
  setup (props, { emit }) {
    const mitt = useMitt()

    const onClickDelete = () => {
      if (props.file) {
        emit('on-delete', props.file.title)
      }
    }

    const onOpenMedia = () => {
      if (props.file) {
        mitt.showLightBox.emit(props.file)
      }
    }

    return {
      onClickDelete,
      onOpenMedia
    }
  }
})
</script>

<style>
</style>
