<template>
  <Tchat :header="$route.params.username" :myId="myId" :messagesReversed="messagesReversed" v-model:message="form.message" :loading="form.loading"
  :mediasSelected="mediasSelected" @submit="onSubmitForm" @scoll-up="onScrollUp"  @on-delete-file="onDeleteFileSelected" @on-add-files="onAddFiles"/>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  ref
} from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { onBeforeRouteUpdate } from 'vue-router'

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

import { showErrorSwal } from '../services/swal.service'
import { useStore } from '../store/Store'

import Tchat from '@/components/Tchat.vue'

import { useMitt } from '../plugins/mitt'

import { mediaBusinessLogic, formBusinessLogic, messageBusinessLogic } from './tchat'
import { debounce } from 'ts-debounce'

export default defineComponent({
  name: 'PrivateMessage',
  components: { Tchat },
  setup () {
    const store = useStore()
    const mitt = useMitt()

    const { mediasSelected, onAddFiles, onDeleteFileSelected } = mediaBusinessLogic()
    const { form, resetForm } = formBusinessLogic(mediasSelected)
    const { message } = messageBusinessLogic()

    const myId = store.member.getId()
    const conversationIdSelected = ref('')

    const messagesReversed = computed(() => {
      return message.values.slice().reverse()
    })

    const loadEntityInformation = () => {
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

    loadEntityInformation()

    onBeforeRouteUpdate(() => {
      loadEntityInformation()
      refetch(getFetchInformation())
    })

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
        const useAutoScroll = message.values.length === 0

        message.pageAvailable = data.conversationMessages.value.pageAvailable
        message.moreAvailable = data.conversationMessages.value.moreAvailable
        message.values = [
          ...message.values,
          ...data.conversationMessages.value.messages
        ]

        if (useAutoScroll) {
          autoScrollToBottom()
        }
      }
    })

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

    const onMessageChanged = (value:string) => {
      form.message = value
    }

    const autoScrollToBottomUp = () => {
      const scrollBar = document.querySelector('#scrollBar')
      if (scrollBar) {
        scrollBar.scroll({
          top: 800,
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

    const onScrollUp = () => {
      if (!message.moreAvailable) return
      debounceInfiniteHandler()
    }

    const debounceInfiniteHandler = debounce(() => loadMore(), 500)

    return {
      onSubmitForm,
      form,
      onAddFiles,
      message,
      messagesReversed,
      onScrollUp,
      mediasSelected,
      onDeleteFileSelected,
      myId,
      onMessageChanged
    }
  }
})
</script>

<style>
</style>
