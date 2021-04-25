import MessageItem from '../MessageItem'

type MessageReactive = {
    skip: number,
    limit: number,
    values: MessageItem[],
    moreAvailable: boolean,
    pageAvailable: number
}

export {
  MessageReactive
}
