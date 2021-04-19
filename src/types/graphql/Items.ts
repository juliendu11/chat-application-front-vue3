/* eslint-disable camelcase */
type Member = {
    _id:string
    email:string
}

type Message = {
    date: Date
    message: string
    user: Member
}

type Room = {
    _id: string
    last_message: Message
    name: string
}

export {
  Message,
  Room,
  Member
}
