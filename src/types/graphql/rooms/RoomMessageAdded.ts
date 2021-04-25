import MessageItem from '../../MessageItem'

type RoomMessageAddedOuput = {
    roomMessageAdded:{
        id:string
        message:MessageItem
    }
}

export {
  RoomMessageAddedOuput
}
