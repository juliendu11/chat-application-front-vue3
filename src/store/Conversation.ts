import IStore from './IStore'

export class Conversation implements IStore<Conversation> {
    private conversationIdSelected =''
    private conversationMemberIdIdSelected =''

    updateIdSelected (conversationIdSelected:string):void {
      this.conversationIdSelected = conversationIdSelected
    }

    getIdSelected ():string {
      return this.conversationIdSelected
    }

    updateMemberIdSelected (conversationMemberIdIdSelected:string):void {
      this.conversationMemberIdIdSelected = conversationMemberIdIdSelected
    }

    getMemberIdSelected ():string {
      return this.conversationMemberIdIdSelected
    }

    init (data:Conversation):void {
      this.conversationIdSelected = data.conversationIdSelected
      this.conversationMemberIdIdSelected = data.conversationMemberIdIdSelected
    }

    getData ():Conversation {
      return this
    }
}
