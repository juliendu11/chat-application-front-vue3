type MessageItem = {
    date: Date
    user:{
        _id:string
        username:string,
        isYou:boolean
    }
    text: string
}

export default MessageItem
