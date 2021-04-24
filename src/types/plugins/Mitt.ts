import DialogContainerArgs from '../emitted/DialogContainerArgs'
export type DialogContainerCallBack = (args: DialogContainerArgs) => any;
export type RightDrawerCallBack = () => any;

type Mitt = {
    dialogContainer:{
        emit:(args:DialogContainerArgs)=>void
        listen: (handler:DialogContainerCallBack) => void
    },
    rightDrawer:{
        emit:()=>void
        listen: (handler:RightDrawerCallBack) => void
    }
}

export default Mitt
