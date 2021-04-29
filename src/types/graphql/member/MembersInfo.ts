import { Member } from '../Items'

export type MembersInfoInput = {}

export type MembersInfoOuput = {
    membersInfo:{
        result:boolean
        message:string
        members:Member[]
    }
}
