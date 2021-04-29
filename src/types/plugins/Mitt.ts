import DialogContainerArgs from '../emitted/DialogContainerArgs'
import MessageItem from '../MessageItem'

export type DialogContainerCallBack = (args: DialogContainerArgs) => any;
export type RightDrawerCallBack = () => any;
export type RoomMessageAddedCallback = (message:MessageItem) => any;

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
    }
}

export default Mitt
