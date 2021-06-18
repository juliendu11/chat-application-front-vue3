<template>
  <div class="drawer">
    <div class="drawer__search">
      <div class="search-input">
        <i class="fa fa-search" aria-hidden="true"></i>
        <input type="text" placeholder="Search" />
      </div>
      <div class="filter">
        <i class="fa fa-filter" aria-hidden="true"></i>
      </div>
    </div>
    <nav class="drawer__menu">
      <ul>
        <li :class="{ active: selectedTab === 0 }" @click="onClickChangeTab(0)">
          Rooms
        </li>
        <li :class="{ active: selectedTab === 1 }" @click="onClickChangeTab(1)">
          Private message
        </li>
      </ul>
    </nav>
    <div class="drawer__content">
      <div v-show="selectedTab === 0">
        <perfect-scrollbar>
          <ConversationItem
            v-for="(room, i) in rooms"
            :key="i"
            @click="onClickOpenRoomConversation(room)"
            :title="room.name"
            :isNewMessage="roomIdsNewMessage.find(x=>x == room._id)"
            :from="room.last_message ? room.last_message.user.username : room.name"
            :message="room.last_message ? generateTextPreview(room.last_message.medias.length, room.last_message.message) : 'Hello there!'"
            :date="room.last_message? formatDateFromNow(room.last_message.date): ''"
            />
        </perfect-scrollbar>
        <div class="add-room">
          <Button :rounded="true" color="primary" @click="onClickAddRoom">
            <i class="fa fa-plus" aria-hidden="true"></i>
            <span class="ml-1">Add room</span>
          </Button>
        </div>
      </div>
      <div v-show="selectedTab === 1">
         <ConversationItem
            v-for="(conversation, i) in conversations"
            :key="i"
            @click="onClickOpenPrivateConversation(conversation)"
            :isNewMessage="pmIdsNewMessage.find(x=>x == conversation._id)"
            :from="getOtherMember(conversation.members).username"
            :profilPic="getOtherMember(conversation.members).profilPic"
            :message="generateTextPreview(conversation.last_message.medias.length, conversation.last_message.message)"
            :date="formatDateFromNow(conversation.last_message.date)"
            />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { formatDateFromNow } from '@/common/date'
import { useRouter } from 'vue-router'
import {
  useQuery,
  useResult,
  useSubscription,
  useApolloClient
} from '@vue/apollo-composable'
import { cloneDeep } from '@apollo/client/utilities'
import { useToast } from 'vue-toastification'

import { Conversation, Member, Room } from '@/types/graphql/Items'
import { RoomMessageAddedOuput } from '@/types/graphql/rooms/RoomMessageAdded'
import {
  ConversationsInput,
  ConversationsOutput
} from '@/types/graphql/conversation/Conversations'
import {
  NewMessageInput,
  NewMessageOutput
} from '@/types/graphql/conversation/NewMessage'
import {
  RoomsInput,
  RoomsOutput
} from '@/types/graphql/rooms/Rooms'

import Rooms from '@/graphql/rooms/queries/Rooms.gql'
import RoomAddedSub from '@/graphql/rooms/subscriptions/RoomAdded.gql'
import RoomMessageAddedSub from '@/graphql/rooms/subscriptions/RoomMessageAdded.gql'

import Conversations from '@/graphql/conversation/queries/Conversations.gql'
import ConversationNewMessage from '@/graphql/conversation/subscriptions/NewMessage.gql'

import { useMitt } from '../../plugins/mitt'
import DialogContainerNames from '../../enums/DialogContainerNames'
import { useStore } from '../../store/Store'

import ConversationItem from '@/components/ConversationItem.vue'

export default defineComponent({
  name: 'Drawer',
  components: { ConversationItem },
  setup () {
    const router = useRouter()
    const mitt = useMitt()
    const store = useStore()
    const toast = useToast()

    const { resolveClient } = useApolloClient()
    const client = resolveClient()

    const roomIdsNewMessage = ref<string[]>([])
    const pmIdsNewMessage = ref<string[]>([])

    const selectedTab = ref(0)

    const onClickChangeTab = (tab: number) => {
      selectedTab.value = tab
    }

    const { result: getRoomsResult, subscribeToMore } = useQuery<RoomsOutput, RoomsInput>(Rooms)
    const rooms = useResult(getRoomsResult, [], data => data.rooms.value)

    subscribeToMore({
      document: RoomAddedSub,
      updateQuery: (previousResult, { subscriptionData }: any) => {
        const _previousResult = cloneDeep(previousResult)
        _previousResult.rooms.value.push(subscriptionData.data.roomAdded)
        return _previousResult
      }
    })

    const {
      result: roomMessageAddedResult
    } = useSubscription<RoomMessageAddedOuput>(RoomMessageAddedSub)

    watch(roomMessageAddedResult, (val) => {
      if (val.roomMessageAdded) {
        const data = client.readQuery<RoomsOutput, RoomsInput>({ query: Rooms })
        if (!data) return

        const roomsCopy = cloneDeep(data.rooms.value)
        const correspondingRoom = roomsCopy.find(
          (x) => x._id === val.roomMessageAdded.id
        )

        if (correspondingRoom) {
          correspondingRoom.last_message = val.roomMessageAdded.message
        }

        if (store.room.getIdSelected() !== val.roomMessageAdded.id) {
          roomIdsNewMessage.value.push(val.roomMessageAdded.id)
        }

        mitt.roomMessageAdded.emit(val.roomMessageAdded.message)

        client.writeQuery({
          query: Rooms,
          data: {
            rooms: {
              ...data.rooms,
              value: roomsCopy
            }
          }
        })
      }
    })

    const { result: conversationResult } = useQuery<
      ConversationsOutput,
      ConversationsInput
    >(Conversations)

    const { result: conversationMessageAddedResult } = useSubscription<
      NewMessageOutput,
      NewMessageInput
    >(ConversationNewMessage)

    watch(conversationMessageAddedResult, (val) => {
      const data = client.readQuery<ConversationsOutput, ConversationsInput>({
        query: Conversations
      })
      if (!data) return

      const conversationsCopy = cloneDeep(data.conversations.value)
      const correspondingConversation = conversationsCopy.find(
        (x) => x._id === val.conversationNewMessage._id
      )

      if (correspondingConversation) {
        correspondingConversation.last_message =
          val.conversationNewMessage.last_message
      }

      if (store.conversation.getIdSelected() !== val.conversationNewMessage._id) {
        pmIdsNewMessage.value.push(val.conversationNewMessage._id)
      }

      mitt.conversationMessageAdded.emit(
        val.conversationNewMessage.last_message
      )

      // If is not me
      if (val.conversationNewMessage.last_message.user._id !== store.member.getId()) {
        let message = `${val.conversationNewMessage.last_message.user.username}: `

        if (val.conversationNewMessage.last_message.message && val.conversationNewMessage.last_message.medias.length !== 0) {
          message += `${val.conversationNewMessage.last_message.message} +${val.conversationNewMessage.last_message.medias.length} medias`
        } else if (!val.conversationNewMessage.last_message.message && val.conversationNewMessage.last_message.medias.length !== 0) {
          message += `${val.conversationNewMessage.last_message.medias.length} medias`
        } else if (val.conversationNewMessage.last_message.message && val.conversationNewMessage.last_message.medias.length === 0) {
          message += `${val.conversationNewMessage.last_message.message}`
        }

        toast.info(message)
      }

      client.writeQuery({
        query: Conversations,
        data: {
          conversations: {
            ...data.conversations,
            value: conversationsCopy
          }
        }
      })
    })

    const conversations = useResult(conversationResult, [], data => data.conversations.value)

    const onClickOpenRoomConversation = (room: Room) => {
      store.room.updateIdSelected(room._id)
      store.room.updateNameSelected(room.name)

      roomIdsNewMessage.value = roomIdsNewMessage.value.filter(x => x !== room._id)

      router.push('/rooms/' + room.name)
    }

    const onClickOpenPrivateConversation = (conversation: Conversation) => {
      const member = getOtherMember(conversation.members)

      store.conversation.updateIdSelected(conversation._id)
      store.conversation.updateMemberIdSelected(member._id)
      store.conversation.updateUsernameSelected(member.username)

      pmIdsNewMessage.value = pmIdsNewMessage.value.filter(x => x !== conversation._id)

      router.push('/messages/' + member.username)
    }

    const onClickAddRoom = () => {
      mitt.dialogContainer.emit({
        name: DialogContainerNames.ADD_ROOM,
        exitFunc: () => {
          return 1
        }
      })
    }

    const getOtherMember = (members: Member[]) => {
      return members.filter((x) => x._id !== store.member.getId())[0]
    }

    const isOnline = (member:Member) => {
      return member.isOnline
    }

    const generateTextPreview = (numberOfMedias:number, text:string) => {
      if (numberOfMedias === 0) {
        return text
      }

      if (!text) {
        return `${numberOfMedias} medias`
      }

      return `${text} +${numberOfMedias} medias`
    }

    return {
      selectedTab,
      onClickChangeTab,
      rooms,
      conversations,
      formatDateFromNow,
      onClickOpenRoomConversation,
      onClickOpenPrivateConversation,
      onClickAddRoom,
      getOtherMember,
      isOnline,
      pmIdsNewMessage,
      roomIdsNewMessage,
      generateTextPreview
    }
  }
})
</script>

<style>
</style>
