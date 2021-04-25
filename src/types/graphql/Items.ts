import MessageItem from '../MessageItem'

/* eslint-disable camelcase */
type Member = {
    _id:string
    email:string
}

type Room = {
    _id: string
    last_message: MessageItem
    name: string
}

export {
  Room,
  Member
}
