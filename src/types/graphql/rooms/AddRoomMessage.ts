import RoomMessageItem from '../../RoomMessageItem'

type RoomAddMessageInput = {
  roomAddMessageInput: {
    id: string
    message: string
  }
}

type RoomAddMessageOutput = {
  roomAddMessage:{
    message: string
    result: boolean
    value: RoomMessageItem
  }
}

export {
  RoomAddMessageInput,
  RoomAddMessageOutput
}
