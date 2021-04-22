import { Room } from '../Items'

type CreateRoomInput = {
    createRoomInput:{
        name:string
        isPrivate:boolean
    }
}

type CreateRoomOutput = {
    createRoom:{
        message:string
        result:boolean
        value:Room
    }
}

export {
  CreateRoomInput,
  CreateRoomOutput
}
