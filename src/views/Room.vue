<template>
  <div class="tchat">
    <div class="tchat__header">
      <h3>{{ $route.params.name }}</h3>
    </div>
    <perfect-scrollbar  id="scrollBar"  @ps-y-reach-start="onScrollUp">
      <div class="tchat__content">
        <MessageItem v-for="(message, z) in messagesReversed" :key="z" :message="message" :isRight="isMe(message.user._id)"/>
      </div>
    </perfect-scrollbar>
    <div class="tchat__footer">
      <form @submit.prevent="onSubmitForm">
        <input id="tchatFileInput" type="file" hidden accept="video/*,image/*" @change="onAddFiles">
        <textarea placeholder="Type your message here" v-model="form.message"/>
        <div class="tchat__footer-btn">
          <div>
            <div class="tchat__icon" @click="onClickUploadFile">
              <i class="fa fa-file-image-o" aria-hidden="true"></i>
            </div>
          </div>
          <Button :loading="form.loading" :disabled="form.loading"> Send </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { onBeforeRouteUpdate } from 'vue-router'
import { debounce } from 'ts-debounce'

import AddRoomMessage from '@/graphql/rooms/mutations/AddRoomMessage.gql'
import RoomMessages from '@/graphql/rooms/queries/RoomMessages.gql'
import { AddRoomMessageInput, AddRoomMessageOuput } from '@/types/graphql/rooms/AddRoomMessage'
import { RoomMessageInput, RoomMessageOuput } from '@/types/graphql/rooms/RoomMessage'
import { MessageReactive } from '@/types/reactive/Room'

import { showErrorSwal } from '../services/swal.service'
import { useStore } from '../store/Store'

import MessageItem from '@/components/MessageItem.vue'
import { useMitt } from '../plugins/mitt'

export default defineComponent({
  name: 'Room',
  components: { MessageItem },
  setup () {
    const store = useStore()
    const mitt = useMitt()

    const myId = store.member.getId()
    const roomIdSelected = ref('')

    const form = reactive({
      message: '',
      loading: false
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

    const v$ = useVuelidate(
      {
        message: { required }
      },
      form
    )

    const loadRoomInformation = () => {
      roomIdSelected.value = store.room.getIdSelected()
    }

    loadRoomInformation()

    onBeforeRouteUpdate(() => {
      loadRoomInformation()
    })

    onMounted(() => {
      mitt.roomMessageAdded.listen((messageAdded) => {
        message.values.unshift(messageAdded)
        autoScrollToBottom()
      })
    })

    const { onResult, refetch } = useQuery<RoomMessageOuput, RoomMessageInput>(RoomMessages, {
      getRoomMessageInput: {
        id: roomIdSelected.value,
        skip: message.skip,
        limit: message.limit
      }
    })

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

    const { mutate } = useMutation<AddRoomMessageOuput, AddRoomMessageInput>(AddRoomMessage)

    const onSubmitForm = async () => {
      try {
        const isFormCorrect = await v$.value.$validate()
        if (!isFormCorrect) return

        form.loading = true

        const { data } = await mutate({
          addRoomMessageInput: {
            id: store.room.getIdSelected(),
            message: form.message
          }
        })

        if (!data) {
          throw new Error('Unable to get data')
        }

        if (!data.addRoomMessage.result) {
          showErrorSwal(data.addRoomMessage.message)
          return
        }
      } catch (error) {
        showErrorSwal(error.message)
      } finally {
        form.loading = false
      }
    }

    const onClickUploadFile = () => {
      const fileInput = document.querySelector('#tchatFileInput')
      if (fileInput) {
        (fileInput as any).click()
      }
    }

    const onAddFiles = () => {
      console.log('onAddFiles')
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
        getRoomMessageInput: {
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
      onScrollUp
    }
  }
})
</script>

<style>
</style>
