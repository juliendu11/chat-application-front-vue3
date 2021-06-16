import { MediaSelected } from '@/types/MediaSelected'
import { nextTick, reactive, Ref, ref } from 'vue'
import { debounce } from 'ts-debounce'
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

const scrolling = (loadMoreFunc:any) => {
  const autoScrollToBottomUp = () => {
    const scrollBar = document.querySelector('#scrollBar')
    if (scrollBar) {
      scrollBar.scroll({
        top: 95 * 4,
        left: 0,
        behavior: 'smooth'
      })
    }
  }

  const autoScrollToBottom = () => {
    nextTick(() => {
      const scrollBar = document.querySelector('#scrollBar')
      if (scrollBar) {
        scrollBar.scrollTop = scrollBar.scrollHeight
      }
    })
  }

  const onScrollUp = (moreAvailable:boolean) => {
    if (!moreAvailable) return
    debounceInfiniteHandler()
  }

  const debounceInfiniteHandler = debounce(() => loadMoreFunc(), 500)

  return {
    autoScrollToBottomUp,
    onScrollUp,
    autoScrollToBottom
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
  scrolling,
  formBusinessLogic,
  messageBusinessLogic
}
