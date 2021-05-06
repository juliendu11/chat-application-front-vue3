import DialogContainerArgs from '../emitted/DialogContainerArgs'
import MemberOnlineStatusChangedArgs from '../emitted/MemberOnlineStatusChangedArgs'
import { Member } from '../graphql/Items'
import MessageItem from '../MessageItem'

export type DialogContainerCallBack = (args: DialogContainerArgs) => any;
export type RightDrawerCallBack = () => any;
export type RoomMessageAddedCallback = (message:MessageItem) => any;
export type ConversationMessageAddedCallback = (message:MessageItem) => any;
export type MemberOnlineStatusChangedCallback = (args:MemberOnlineStatusChangedArgs) => any;

type Mitt = {
    dialogContainer:{
        emit:(args:DialogContainerArgs)=>void
        listen: (handler:DialogContainerCallBack) => void
    },
    rightDrawer:{
        emit:()=>void
        listen: (handler:RightDrawerCallBack) => void
    },
    roomMessageAdded:{
        emit:(message:MessageItem) => void
        listen:(handler:RoomMessageAddedCallback) => void
    },
    conversationMessageAdded:{
        emit:(message:MessageItem) => void
        listen:(handler:ConversationMessageAddedCallback) => void
    },
    memberOnlineStatusChanged:{
        emit:(args:MemberOnlineStatusChangedArgs) => void,
        listen: (handler: MemberOnlineStatusChangedCallback) =>void
    }
}

export default Mitt
