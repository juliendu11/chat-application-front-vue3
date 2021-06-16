<template>
  <div class="tchat">
    <div class="tchat__header">
      <h3>{{ $route.params.name }}</h3>
    </div>
    <perfect-scrollbar id="scrollBar" :class="{'ps--grow':mediasSelected.length !== 0}" @ps-y-reach-start="onScrollUp">
      <div class="tchat__content">
        <MessageItem
          v-for="(message, z) in messagesReversed"
          :key="z"
          :message="message"
          :isRight="isMe(message.user._id)"
        />
      </div>
    </perfect-scrollbar>
    <div class="tchat__footer" :class="{'tchat__footer--grow':mediasSelected.length !== 0}">
      <form @submit.prevent="onSubmitForm">
        <input
          id="tchatFileInput"
          type="file"
          hidden
          accept="video/*,image/*"
          multiple
          @change="onAddFiles"
        />
        <div class="tchat__files-selected-zone">
          <FileSelected v-for="(file, i) in mediasSelected" :key="i" :file="file" @on-delete="onDeleteFileSelected"/>
        </div>
        <textarea placeholder="Type your message here" v-model="form.message" />
        <div class="tchat__footer-btn">
          <div>
            <div class="tchat__icon" @click="onClickUploadFile">
              <i class="fa fa-file-image-o" aria-hidden="true"></i>
            </div>
          </div>
          <Button :loading="form.loading" :disabled="form.loading">
            Send
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { onBeforeRouteUpdate } from 'vue-router'
import { debounce } from 'ts-debounce'

import AddRoomMessage from '@/graphql/rooms/mutations/AddRoomMessage.gql'
import RoomMessages from '@/graphql/rooms/queries/RoomMessages.gql'
import { RoomAddMessageInput, RoomAddMessageOutput } from '@/types/graphql/rooms/AddRoomMessage'
import { RoomGetMessageInput, RoomGetMessageOutput } from '@/types/graphql/rooms/RoomMessage'
import { MessageReactive } from '@/types/reactive/Room'

import { showErrorSwal } from '../services/swal.service'
import { useStore } from '../store/Store'

import MessageItem from '@/components/MessageItem.vue'
import FileSelected from '@/components/FileSelected.vue'

import { useMitt } from '../plugins/mitt'
import { MediaSelected } from '@/types/MediaSelected'

export default defineComponent({
  name: 'Room',
  components: { MessageItem, FileSelected },
  setup () {
    const store = useStore()
    const mitt = useMitt()

    const myId = store.member.getId()
    const roomIdSelected = ref('')

    const mediasSelected = ref<MediaSelected[]>([])

    const form = reactive({
      message: '',
      loading: false,
      medias: []
    })

    const message = reactive<MessageReactive>({
      skip: 0,
      limit: 10,
      values: [],
      moreAvailable: false,
      pageAvailable: 1,
      page: 1
    })

    const autoScrollToBottom = () => {
      nextTick(() => {
        const scrollBar = document.querySelector('#scrollBar')
        if (scrollBar) {
          scrollBar.scrollTop = scrollBar.scrollHeight
        }
      })
    }

    const messagesReversed = computed(() => {
      return message.values.slice().reverse()
    })

    const loadRoomInformation = () => {
      roomIdSelected.value = store.room.getIdSelected()
    }

    const getFetchInformation = ():RoomGetMessageInput => {
      return {
        roomGetMessageInput: {
          id: roomIdSelected.value,
          skip: message.skip,
          limit: message.limit
        }
      }
    }

    const whenChangingRoom = () => {
      message.skip = 0
      message.limit = 10
      message.moreAvailable = false
      message.pageAvailable = 1
      message.page = 1
      message.values = []
    }

    loadRoomInformation()

    onBeforeRouteUpdate(() => {
      loadRoomInformation()
      whenChangingRoom()
      refetch(getFetchInformation())
    })

    onMounted(() => {
      mitt.roomMessageAdded.listen((messageAdded) => {
        message.values.unshift(messageAdded)
        autoScrollToBottom()
      })
    })

    const { onResult, refetch } = useQuery<RoomGetMessageOutput, RoomGetMessageInput>(RoomMessages, getFetchInformation())

    onResult(({ data }) => {
      if (data.roomMessage.result) {
        message.pageAvailable = data.roomMessage.value.pageAvailable
        message.moreAvailable = data.roomMessage.value.moreAvailable
        message.values = [...message.values, ...data.roomMessage.value.messages]
        autoScrollToBottom()
      }
    })

    const isMe = (id:string):boolean => {
      return myId === id
    }

    const { mutate } = useMutation<RoomAddMessageOutput, RoomAddMessageInput>(AddRoomMessage)

    const onSubmitForm = async () => {
      try {
        if (!form.message && mediasSelected.value.length === 0) return

        form.loading = true

        const { data } = await mutate({
          roomAddMessageInput: {
            id: store.room.getIdSelected(),
            message: form.message
          }
        })

        if (!data) {
          throw new Error('Unable to get data')
        }

        if (!data.roomAddMessage.result) {
          showErrorSwal(data.roomAddMessage.message)
          return
        }
        resetForm()
      } catch (error) {
        showErrorSwal(error.message)
      } finally {
        form.loading = false
      }
    }

    const resetForm = () => {
      form.message = ''
      form.medias = []
      mediasSelected.value = []
    }

    const onClickUploadFile = () => {
      const fileInput = document.querySelector('#tchatFileInput')
      if (fileInput) {
        (fileInput as any).click()
      }
    }

    const onAddFiles = (e: any) => {
      Array.from(e.target.files as FileList).forEach((file) => {
        loadMediaSelected(file)
      })
    }

    const loadMediaSelected = (file: File) => {
      var reader = new FileReader()

      reader.onload = function (event:any) {
        mediasSelected.value.push({
          title: file.name,
          type: file.type.includes('image') ? 'image' : 'video',
          src: event.target.result as string,
          media: file
        })
      }

      reader.readAsDataURL(file)
    }

    const onDeleteFileSelected = (name:string) => {
      mediasSelected.value = mediasSelected.value.filter(x => x.title !== name)
    }

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

    const loadMore = async () => {
      message.page += 1
      message.skip = message.limit * message.page - message.limit
      await refetch({
        roomGetMessageInput: {
          id: roomIdSelected.value,
          skip: message.skip,
          limit: message.limit
        }
      })
      autoScrollToBottomUp()
    }

    const debounceInfiniteHandler = debounce(() => loadMore(), 500)

    const onScrollUp = () => {
      if (!message.moreAvailable) return
      debounceInfiniteHandler()
    }

    return {
      onSubmitForm,
      form,
      onAddFiles,
      onClickUploadFile,
      message,
      isMe,
      messagesReversed,
      onScrollUp,
      onDeleteFileSelected,
      mediasSelected
    }
  }
})
</script>

<style>
</style>
