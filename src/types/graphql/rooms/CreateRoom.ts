import { Room } from '../Items'

type RoomCreateInput = {
    roomCreateInput:{
        name:string
        isPrivate:boolean
    }
}

type RoomCreateOutput = {
    roomCreate:{
        message:string
        result:boolean
        value:Room
    }
}

export {
  RoomCreateInput,
  RoomCreateOutput
}
