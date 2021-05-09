import { Room } from '../Items'

export type RoomsInput = {}

export type RoomsOutput = {
    rooms:{
        message:string
        result:string
        value:Room[]
    }
}
