import MessageItem from '../../MessageItem'

type RoomMessageInput = {
    getRoomMessageInput: {
        id: string
        limit: number
        skip: number
    }
}

type RoomMessageOuput = {
    roomMessage: {
        result: boolean,
        message: string
        value: {
            messages: MessageItem[]
            moreAvailable: boolean
            pageAvailable: number
        }
    }
}

export {
  RoomMessageInput,
  RoomMessageOuput
}
