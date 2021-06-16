type MessageMediaItem = {
  path: string
  type:string
}

type MessageItem = {
  date: Date;
  user: {
    _id: string;
    username: string;
    profilPic: string;
    email: string;
  };
  message: string;
  medias: MessageMediaItem[];
  isNew: boolean
  isView:boolean
};

export default MessageItem
