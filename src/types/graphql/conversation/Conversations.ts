/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable camelcase */
import { Conversation } from '../Items'

export type ConversationsInput = {}

export type ConversationsOutput = {
    conversations:{
        result:boolean,
        message:string
        value:Conversation[]
    }
}
