export type ConversationSendMessageInput = {
    conversationSendMessageInput: {
        memberId: string
        message: string
    }
}

export type ConversationSendMessageOutput = {
    conversationSendMessage: {
        result: boolean
        message: string
    }
}
