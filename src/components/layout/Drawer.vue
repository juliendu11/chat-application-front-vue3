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
            <span>{{ room.last_message ? room.last_message.user.username : room.name }}</span>
            <p>
              {{  room.last_message ? room.last_message.message  :"Hello there!" }}
            </p>
          </div>
          <div class="conversation-item__extra">
            <span> {{ room.last_message ? formatDateFromNow(room.last_message.date) : "" }}</span>
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
          v-for="(pm, z) in privateMessages"
          :key="z"
          @click="onClickOpenPrivateConversation(pm.username)"
        >
          <div class="conversation-item__header">
            <img :src="pm.profilPic" :alt="pm.username" />
            <i class="fa fa-circle" aria-hidden="true"></i>
          </div>
          <div class="conversation-item__content">
            <span>{{ pm.username }}</span>
            <p>
              {{ pm.message }}
            </p>
          </div>
          <div class="conversation-item__extra">
            <span>{{ formatDateFromNow(pm.date) }}</span>
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
import { useQuery, useResult, useSubscription, useApolloClient } from '@vue/apollo-composable'
import { cloneDeep } from '@apollo/client/utilities'

import PrivateMessageItem from '@/types/PrivateMessageItem'
import { Room } from '@/types/graphql/Items'
import { RoomMessageAddedOuput } from '@/types/graphql/rooms/RoomMessageAdded'

import Rooms from '@/graphql/rooms/queries/Rooms.gql'
import RoomAddedSub from '@/graphql/rooms/subscriptions/RoomAdded.gql'
import RoomMessageAddedSub from '@/graphql/rooms/subscriptions/RoomMessageAdded.gql'

import { useMitt } from '../../plugins/mitt'
import DialogContainerNames from '../../enums/DialogContainerNames'
import { useStore } from '../../store/Store'

export default defineComponent({
  name: 'Drawer',
  setup () {
    const router = useRouter()
    const mitt = useMitt()
    const store = useStore()

    const { resolveClient } = useApolloClient()
    const client = resolveClient()

    const selectedTab = ref(0)

    const onClickChangeTab = (tab: number) => {
      selectedTab.value = tab
    }

    const { result: getRoomsResult, subscribeToMore } = useQuery<{rooms:Room[]}>(Rooms)
    const rooms = useResult(getRoomsResult)

    subscribeToMore({
      document: RoomAddedSub,
      updateQuery: (previousResult, { subscriptionData }:any) => {
        const _previousResult = cloneDeep(previousResult)
        _previousResult.rooms.push(subscriptionData.data.roomAdded)
        return _previousResult
      }
    })

    const { result } = useSubscription<RoomMessageAddedOuput>(RoomMessageAddedSub)

    watch(result, (val) => {
      console.log('aaa')
      if (val.roomMessageAdded) {
        const data = client.readQuery<{rooms:Room[]}>({ query: Rooms })
        if (!data) return

        const roomsCopy = cloneDeep(data.rooms)
        const correspondingRoom = roomsCopy.find(x => x._id === val.roomMessageAdded.id)

        if (correspondingRoom) {
          correspondingRoom.last_message = val.roomMessageAdded.message
        }

        if (store.room.getIdSelected()) {
          // Update room query
        }

        client.writeQuery({
          query: Rooms,
          data: {
            rooms: roomsCopy
          }
        })
      }
    })

    const privateMessages = ref<PrivateMessageItem[]>([
      {
        username: 'test',
        date: new Date(),
        message: 'Hello',
        profilPic: 'https://randomuser.me/api/portraits/men/14.jpg'
      }
    ])

    const onClickOpenRoomConversation = (room: Room) => {
      store.room.updateIdSelected(room._id)
      store.room.updateNameSelected(room.name)
      router.push('/rooms/' + room.name)
    }

    const onClickOpenPrivateConversation = (username: string) => {
      router.push('/messages/' + username)
    }

    const onClickAddRoom = () => {
      mitt.dialogContainer.emit({
        name: DialogContainerNames.ADD_ROOM,
        exitFunc: () => { return 1 }
      })
    }

    return {
      selectedTab,
      onClickChangeTab,
      rooms,
      privateMessages,
      formatDateFromNow,
      onClickOpenRoomConversation,
      onClickOpenPrivateConversation,
      onClickAddRoom
    }
  }
})
</script>

<style>
</style>
