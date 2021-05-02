/* eslint-disable camelcase */
import MessageItem from '../../MessageItem'
import { Member } from '../Items'

// eslint-disable-next-line @typescript-eslint/ban-types
export type NewMessageInput = {}

export type NewMessageOutput = {
    conversationNewMessage: {
        last_message: MessageItem
        _id: string
        members: Member[]
    }
}
