import { App, inject } from 'vue'
import mitt, { Emitter } from 'mitt'
import MittPlugin, { DialogContainerCallBack, RightDrawerCallBack } from '@/types/plugins/Mitt'
import DialogContainerArgs from '@/types/emitted/DialogContainerArgs'

export const emitter = mitt()

export const MittSymbol = Symbol('mitt')

export const DIALOG_CONTAINER_EMITTER = 'dialog-container'
export const RIGHT_DRAWER_EMITTER = 'right-drawer'

export function useMitt (): MittPlugin {
  const mitt = inject(MittSymbol)
  if (!mitt) {
    throw new Error('Unable to get mitt')
  }

  return {
    dialogContainer: {
      emit: (args: DialogContainerArgs) => { (mitt as Emitter).emit(DIALOG_CONTAINER_EMITTER, args) },
      listen: (handler: DialogContainerCallBack) => { (mitt as Emitter).on(DIALOG_CONTAINER_EMITTER, (n) => handler(n)) }
    },
    rightDrawer: {
      emit: () => { (mitt as Emitter).emit(RIGHT_DRAWER_EMITTER) },
      listen: (handler: RightDrawerCallBack) => { (mitt as Emitter).on(RIGHT_DRAWER_EMITTER, handler) }
    }
  }
}

export default (app:App):void => {
  app.provide(MittSymbol, emitter)
}
