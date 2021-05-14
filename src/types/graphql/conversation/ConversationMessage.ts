import MessageItem from '../../MessageItem'

export type ConversationMessageInput = {
    conversationMessageInput: {
        id: string
        limit: number
        skip: number
    }
}

export type ConversationMessageOutput = {
    conversationMessages: {
        result: boolean,
        message: string
        value: {
            messages: MessageItem[]
            moreAvailable: boolean
            pageAvailable: number
        }
    }
}
