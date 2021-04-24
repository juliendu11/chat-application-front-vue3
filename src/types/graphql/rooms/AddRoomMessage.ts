import RoomMessageItem from '../../RoomMessageItem'

type AddRoomMessageInput = {
  addRoomMessageInput: {
    id: string
    message: string
  }
}

type AddRoomMessageOuput = {
  addRoomMessage:{
    message: string
    result: boolean
    value: RoomMessageItem
  }
}

export {
  AddRoomMessageInput,
  AddRoomMessageOuput
}
