import DialogContainerArgs from '../emitted/DialogContainerArgs'
export type DialogContainerCallBack = (args: DialogContainerArgs) => any;

type Mitt = {
    dialogContainer:{
        emit:(args:DialogContainerArgs)=>void
        listen: (handler:DialogContainerCallBack) => void
    },
}

export default Mitt
