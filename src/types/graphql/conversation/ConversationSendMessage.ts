export type ConversationSendMessageInput = {
    conversationSendMessageInput: {
        memberId: string
        message: string|null
        medias: File[]
    }
}

export type ConversationSendMessageOutput = {
    conversationSendMessage: {
        result: boolean
        message: string
    }
}
