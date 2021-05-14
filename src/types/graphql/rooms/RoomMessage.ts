import MessageItem from '../../MessageItem'

type RoomGetMessageInput = {
    roomGetMessageInput: {
        id: string
        limit: number
        skip: number
    }
}

type RoomGetMessageOutput = {
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
  RoomGetMessageInput,
  RoomGetMessageOutput
}
