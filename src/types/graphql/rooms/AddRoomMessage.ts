import RoomMessageItem from '../../RoomMessageItem'

type AddRoomMessageInput = {
  addRoomMessageInput: {
    id: string
    message: string
  }
}

type AddRoomMessageOuput = {
  message: string
  result: boolean
  value: RoomMessageItem
}

export {
  AddRoomMessageInput,
  AddRoomMessageOuput
}
