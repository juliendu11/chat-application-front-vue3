import { MediaSelected } from '@/types/MediaSelected'
import { reactive, Ref, ref } from 'vue'
import { MessageReactive } from '@/types/reactive/Room'
import { onBeforeRouteUpdate } from 'vue-router'
import { FormReactive } from '@/types/reactive/PrivateMessage'

const mediaBusinessLogic = () => {
  const mediasSelected = ref<MediaSelected[]>([])

  const onAddFiles = (e: any) => {
    Array.from(e.target.files as FileList).forEach(file => {
      loadMediaSelected(file)
    })
  }

  const loadMediaSelected = (file: File) => {
    const reader = new FileReader()

    reader.onload = function (event: any) {
      mediasSelected.value.push({
        title: file.name,
        type: file.type.includes('image') ? 'image' : 'video',
        src: event.target.result as string,
        media: file
      })
    }

    reader.readAsDataURL(file)
  }

  const onDeleteFileSelected = (name: string) => {
    mediasSelected.value = mediasSelected.value.filter(x => x.title !== name)
  }

  return {
    onAddFiles,
    onDeleteFileSelected,
    mediasSelected
  }
}

const formBusinessLogic = (mediasSelected:Ref<MediaSelected[]>) => {
  const form = reactive<FormReactive>({
    message: '',
    loading: false,
    medias: []
  })

  const resetForm = () => {
    form.message = ''
    form.medias = []
    mediasSelected.value = []
  }

  return {
    form,
    resetForm
  }
}

const messageBusinessLogic = () => {
  const message = reactive<MessageReactive>({
    skip: 0,
    limit: 10,
    values: [],
    moreAvailable: false,
    pageAvailable: 1,
    page: 1
  })

  const whenChangingEntity = () => {
    message.skip = 0
    message.limit = 10
    message.moreAvailable = false
    message.pageAvailable = 1
    message.page = 1
    message.values = []
  }

  onBeforeRouteUpdate(() => {
    whenChangingEntity()
  })

  return {
    message
  }
}

export {
  mediaBusinessLogic,
  formBusinessLogic,
  messageBusinessLogic
}
