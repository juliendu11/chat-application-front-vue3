import { Member } from '../Items'

export type MembersOnlineInput ={}

export type MembersOnlineOutput = {
    membersOnline:{
        result:boolean,
        message:string
        values:Member[]
    }
}
