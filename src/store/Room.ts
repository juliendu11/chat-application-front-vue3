import IStore from './IStore'

export class Room implements IStore<Room> {
    private roomIdSelected =''
    private roomNameSelected =''

    updateIdSelected (roomIdSelected:string):void {
      this.roomIdSelected = roomIdSelected
    }

    getIdSelected ():string {
      return this.roomIdSelected
    }

    updateNameSelected (roomNameSelected:string):void {
      this.roomNameSelected = roomNameSelected
    }

    getNameSelected ():string {
      return this.roomNameSelected
    }

    init (data:Room):void {
      this.roomIdSelected = data.roomIdSelected
      this.roomNameSelected = data.roomNameSelected
    }

    getData ():Room {
      return this
    }
}
