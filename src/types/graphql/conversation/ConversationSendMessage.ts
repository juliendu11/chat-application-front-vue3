export type ConversationSendMessageInput = {
    conversationSendMessageInput: {
        memberId: string
        message: string|null
        media: File|null
    }
}

export type ConversationSendMessageOutput = {
    conversationSendMessage: {
        result: boolean
        message: string
    }
}
