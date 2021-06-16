<template>
  <div class="tchat">
    <div class="tchat__header">
      <h3>{{ $route.params.username }}</h3>
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
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref
} from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { onBeforeRouteUpdate } from 'vue-router'
import { debounce } from 'ts-debounce'

import ConversationSendMessage from '@/graphql/conversation/mutations/ConversationSendMessage.gql'
import ConversationMessage from '@/graphql/conversation/queries/ConversationMessage.gql'

import {
  ConversationMessageInput,
  ConversationMessageOutput
} from '@/types/graphql/conversation/ConversationMessage'
import {
  ConversationSendMessageInput,
  ConversationSendMessageOutput
} from '@/types/graphql/conversation/ConversationSendMessage'
import { MessageReactive } from '@/types/reactive/Room'
import { FormReactive } from '@/types/reactive/PrivateMessage'
import { MediaSelected } from '@/types/MediaSelected'

import { showErrorSwal } from '../services/swal.service'
import { useStore } from '../store/Store'

import MessageItem from '@/components/MessageItem.vue'
import FileSelected from '@/components/FileSelected.vue'
import { useMitt } from '../plugins/mitt'

export default defineComponent({
  name: 'PrivateMessage',
  components: { MessageItem, FileSelected },
  setup () {
    const store = useStore()
    const mitt = useMitt()

    const myId = store.member.getId()
    const conversationIdSelected = ref('')

    const mediasSelected = ref<MediaSelected[]>([])

    const form = reactive<FormReactive>({
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

    const loadConversationInformation = () => {
      conversationIdSelected.value = store.conversation.getIdSelected()
    }

    const getFetchInformation = (): ConversationMessageInput => {
      return {
        conversationMessageInput: {
          id: conversationIdSelected.value,
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

    loadConversationInformation()

    onBeforeRouteUpdate(() => {
      loadConversationInformation()
      whenChangingRoom()
      refetch(getFetchInformation())
    })

    onMounted(() => {
      mitt.conversationMessageAdded.listen((messageAdded) => {
        message.values.unshift(messageAdded)
        autoScrollToBottom()
      })
    })

    const { onResult, refetch } = useQuery<
      ConversationMessageOutput,
      ConversationMessageInput
    >(ConversationMessage, getFetchInformation(), {
      fetchPolicy: 'cache-and-network'
    })

    onResult(({ data }) => {
      if (data && data.conversationMessages.result) {
        message.pageAvailable = data.conversationMessages.value.pageAvailable
        message.moreAvailable = data.conversationMessages.value.moreAvailable
        message.values = [
          ...message.values,
          ...data.conversationMessages.value.messages
        ]
        autoScrollToBottom()
      }
    })

    const isMe = (id: string): boolean => {
      return myId === id
    }

    const { mutate } = useMutation<
      ConversationSendMessageOutput,
      ConversationSendMessageInput
    >(ConversationSendMessage)

    const onSubmitForm = async () => {
      try {
        if (!form.message && mediasSelected.value.length === 0) return

        form.loading = true

        if (mediasSelected.value.length !== 0) {
          form.medias = mediasSelected.value.map(x => x.media)
        }

        const { data } = await mutate({
          conversationSendMessageInput: {
            memberId: store.conversation.getMemberIdSelected(),
            message: form.message,
            medias: form.medias
          }
        })

        if (!data) {
          throw new Error('Unable to get data')
        }

        if (!data.conversationSendMessage.result) {
          showErrorSwal(data.conversationSendMessage.message)
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
        conversationMessageInput: {
          id: conversationIdSelected.value,
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

    return {
      onSubmitForm,
      form,
      onAddFiles,
      onClickUploadFile,
      message,
      isMe,
      messagesReversed,
      onScrollUp,
      mediasSelected,
      onDeleteFileSelected
    }
  }
})
</script>

<style>
</style>
