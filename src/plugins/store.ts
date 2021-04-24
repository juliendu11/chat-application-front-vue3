import { App } from 'vue'
import { StoreSymbol, store } from '../store/Store'

export default (app:App):void => {
  app.provide(StoreSymbol, store)
}
