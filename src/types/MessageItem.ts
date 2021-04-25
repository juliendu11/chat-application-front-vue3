type MessageItem = {
    date: Date
    user:{
        _id:string
      username:string
      profilPic:string
      email:string
    }
    message: string
}

export default MessageItem
