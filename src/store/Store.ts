import { inject } from 'vue'
import { Conversation } from './Conversation'
import { Member } from './Member'
import { Room } from './Room'

export const StoreSymbol = Symbol('store')

const LOCAL_STORAGE_NAME = 'store'

class Store {
  member:Member = new Member()
  room:Room = new Room()
  conversation:Conversation = new Conversation()

  constructor () {
    this.rehydrate()

    window.addEventListener('unload', () => {
      this.saveData()
    })
  }

  saveData () {
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(this))
  }

  rehydrate () {
    const data = localStorage.getItem(LOCAL_STORAGE_NAME)
    if (data) {
      const parsed:this = JSON.parse(data)
      this.member.init(parsed.member)
      this.room.init(parsed.room)
      this.conversation.init(parsed.conversation)
    }
  }
}

export const store = new Store()

export function useStore ():Store {
  const store = inject(StoreSymbol)
  if (!store) {
    throw new Error('Unable to get store')
  }

  return store as Store
}
