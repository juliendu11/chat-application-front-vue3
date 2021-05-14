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

import ConversationSendMessage from '@/graphql/conversation/mutations/ConversationSendMessage.gql'
import ConversationMessage from '@/graphql/conversation/queries/ConversationMessage.gql'
import { ConversationMessageInput, ConversationMessageOutput } from '@/types/graphql/conversation/ConversationMessage'
import { ConversationSendMessageInput, ConversationSendMessageOutput } from '@/types/graphql/conversation/ConversationSendMessage'
import { MessageReactive } from '@/types/reactive/Room'

import { showErrorSwal } from '../services/swal.service'
import { useStore } from '../store/Store'

import MessageItem from '@/components/MessageItem.vue'
import { useMitt } from '../plugins/mitt'

export default defineComponent({
  name: 'PrivateMessage',
  components: { MessageItem },
  setup () {
    const store = useStore()
    const mitt = useMitt()

    const myId = store.member.getId()
    const conversationIdSelected = ref('')

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
      conversationIdSelected.value = store.conversation.getIdSelected()
    }

    const getFetchInformation = ():ConversationMessageInput => {
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

    loadRoomInformation()

    onBeforeRouteUpdate(() => {
      loadRoomInformation()
      whenChangingRoom()
      refetch(getFetchInformation())
    })

    onMounted(() => {
      mitt.conversationMessageAdded.listen((messageAdded) => {
        message.values.unshift(messageAdded)
        autoScrollToBottom()
      })
    })

    const { onResult, refetch } = useQuery<ConversationMessageOutput, ConversationMessageInput>(ConversationMessage, getFetchInformation(), { fetchPolicy: 'cache-and-network' })

    onResult(({ data }) => {
      if (data && data.conversationMessages.result) {
        message.pageAvailable = data.conversationMessages.value.pageAvailable
        message.moreAvailable = data.conversationMessages.value.moreAvailable
        message.values = [...message.values, ...data.conversationMessages.value.messages]
        autoScrollToBottom()
      }
    })

    const isMe = (id:string):boolean => {
      return myId === id
    }

    const { mutate } = useMutation<ConversationSendMessageOutput, ConversationSendMessageInput>(ConversationSendMessage)

    const onSubmitForm = async () => {
      try {
        const isFormCorrect = await v$.value.$validate()
        if (!isFormCorrect) return

        form.loading = true

        const { data } = await mutate({
          conversationSendMessageInput: {
            memberId: store.conversation.getMemberIdSelected(),
            message: form.message
          }
        })

        if (!data) {
          throw new Error('Unable to get data')
        }

        if (!data.conversationSendMessage.result) {
          showErrorSwal(data.conversationSendMessage.message)
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
