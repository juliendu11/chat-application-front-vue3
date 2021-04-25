type MessageItem = {
    date: Date
    user:{
        _id:string
      username:string
      profilPic:string
      email:string
    }
    text: string
}

export default MessageItem
