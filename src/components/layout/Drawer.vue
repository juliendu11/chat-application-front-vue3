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
          <div
            class="conversation-item"
            v-for="(room, i) in rooms"
            :key="i"
            @click="onClickOpenRoomConversation(room)"
          >
            <div class="conversation-item__header">
              <span>{{ room.name }}</span>
            </div>
            <div class="conversation-item__content">
              <span>{{
                room.last_message ? room.last_message.user.username : room.name
              }}</span>
              <p>
                {{
                  room.last_message ? room.last_message.message : "Hello there!"
                }}
              </p>
            </div>
            <div class="conversation-item__extra">
              <span>
                {{
                  room.last_message
                    ? formatDateFromNow(room.last_message.date)
                    : ""
                }}</span
              >
            </div>
          </div>
        </perfect-scrollbar>
        <div class="add-room">
          <Button :rounded="true" color="primary" @click="onClickAddRoom">
            <i class="fa fa-plus" aria-hidden="true"></i>
            <span class="ml-1">Add room</span>
          </Button>
        </div>
      </div>
      <div v-show="selectedTab === 1">
        <div
          class="conversation-item"
          v-for="(conversation, z) in conversations"
          :key="z"
          @click="onClickOpenPrivateConversation(conversation)"
        >
          <div class="conversation-item__header" :class="{'conversation-item__header--online':isOnline(getOtherMember(conversation.members))}">
            <UserPic
              :username="getOtherMember(conversation.members).username"
              :image="getOtherMember(conversation.members).profilPic"
            />
            <i class="fa fa-circle" aria-hidden="true"></i>
          </div>
          <div class="conversation-item__content">
            <span>{{ getOtherMember(conversation.members).username }}</span>
            <p>
              {{ conversation.last_message.message }}
            </p>
          </div>
          <div class="conversation-item__extra">
            <span>{{ formatDateFromNow(conversation.last_message.date) }}</span>
          </div>
        </div>
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

import UserPic from '@/components/UserPic.vue'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'Drawer',
  components: { UserPic },
  setup () {
    const router = useRouter()
    const mitt = useMitt()
    const store = useStore()
    const toast = useToast()

    const { resolveClient } = useApolloClient()
    const client = resolveClient()

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

        if (store.room.getIdSelected()) {
          // Update room query
          mitt.roomMessageAdded.emit(val.roomMessageAdded.message)
        }

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

      if (store.conversation.getIdSelected()) {
        // Update conversation query
        mitt.conversationMessageAdded.emit(
          val.conversationNewMessage.last_message
        )
      }

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
      router.push('/rooms/' + room.name)
    }

    const onClickOpenPrivateConversation = (conversation: Conversation) => {
      const member = getOtherMember(conversation.members)

      store.conversation.updateIdSelected(conversation._id)
      store.conversation.updateMemberIdSelected(member._id)

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
      isOnline
    }
  }
})
</script>

<style>
</style>
