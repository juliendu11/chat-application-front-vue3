import MessageItem from '../MessageItem'

/* eslint-disable camelcase */
type Member = {
    _id:string
    email:string
    username:string
    profilPic:string
    isOnline:boolean
}

type Room = {
    _id: string
    last_message: MessageItem
    name: string
}

type Conversation = {
    _id:string
    last_message:MessageItem[]
    members:Member[]
}

export {
  Room,
  Member,
  Conversation
}
