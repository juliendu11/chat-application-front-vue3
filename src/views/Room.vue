<template>
   <Tchat :header="$route.params.name" :myId="myId" :messagesReversed="messagesReversed" v-model:message="form.message" :loading="form.loading"
  :mediasSelected="mediasSelected" @submit="onSubmitForm" @scoll-up="onScrollUp"  @on-delete-file="onDeleteFileSelected" @on-add-files="onAddFiles"/>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { onBeforeRouteUpdate } from 'vue-router'

import AddRoomMessage from '@/graphql/rooms/mutations/AddRoomMessage.gql'
import RoomMessages from '@/graphql/rooms/queries/RoomMessages.gql'
import { RoomAddMessageInput, RoomAddMessageOutput } from '@/types/graphql/rooms/AddRoomMessage'
import { RoomGetMessageInput, RoomGetMessageOutput } from '@/types/graphql/rooms/RoomMessage'

import { showErrorSwal } from '../services/swal.service'
import { useStore } from '../store/Store'

import Tchat from '@/components/Tchat.vue'

import { useMitt } from '../plugins/mitt'

import { mediaBusinessLogic, formBusinessLogic, messageBusinessLogic } from './tchat'
import { debounce } from 'ts-debounce'

export default defineComponent({
  name: 'Room',
  components: { Tchat },
  setup () {
    const store = useStore()
    const mitt = useMitt()

    const { mediasSelected, onAddFiles, onDeleteFileSelected } = mediaBusinessLogic()
    const { form, resetForm } = formBusinessLogic(mediasSelected)
    const { message } = messageBusinessLogic()

    const myId = store.member.getId()
    const roomIdSelected = ref('')

    const messagesReversed = computed(() => {
      return message.values.slice().reverse()
    })

    const loadEntityInformation = () => {
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

    loadEntityInformation()

    onBeforeRouteUpdate(() => {
      loadEntityInformation()
      refetch(getFetchInformation())
    })

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

    onMounted(() => {
      mitt.roomMessageAdded.listen((messageAdded) => {
        message.values.unshift(messageAdded)
        autoScrollToBottom()
      })
    })

    const { onResult, refetch } = useQuery<RoomGetMessageOutput, RoomGetMessageInput>(RoomMessages, getFetchInformation())

    onResult(({ data }) => {
      if (data.roomMessage.result) {
        const useAutoScroll = message.values.length === 0

        message.pageAvailable = data.roomMessage.value.pageAvailable
        message.moreAvailable = data.roomMessage.value.moreAvailable
        message.values = [...message.values, ...data.roomMessage.value.messages]

        if (useAutoScroll) {
          autoScrollToBottom()
        }
      }
    })

    const { mutate } = useMutation<RoomAddMessageOutput, RoomAddMessageInput>(AddRoomMessage)

    const onSubmitForm = async () => {
      try {
        if (!form.message && mediasSelected.value.length === 0) return

        form.loading = true

        if (mediasSelected.value.length !== 0) {
          form.medias = mediasSelected.value.map(x => x.media)
        }

        const { data } = await mutate({
          roomAddMessageInput: {
            id: store.room.getIdSelected(),
            message: form.message,
            medias: form.medias
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
      onDeleteFileSelected,
      mediasSelected,
      myId
    }
  }
})
</script>

<style>
</style>
