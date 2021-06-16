import IStore from './IStore'

export class Conversation implements IStore<Conversation> {
    private conversationIdSelected =''
    private conversationMemberIdSelected =''
    private conversationMemberUsernameSelected =''

    updateIdSelected (conversationIdSelected:string):void {
      this.conversationIdSelected = conversationIdSelected
    }

    getIdSelected ():string {
      return this.conversationIdSelected
    }

    updateMemberIdSelected (conversationMemberIdIdSelected:string):void {
      this.conversationMemberIdSelected = conversationMemberIdIdSelected
    }

    getMemberIdSelected ():string {
      return this.conversationMemberIdSelected
    }

    updateUsernameSelected (conversationMemberUsernameSelected:string):void {
      this.conversationMemberUsernameSelected = conversationMemberUsernameSelected
    }

    getMemberUsernameSelected ():string {
      return this.conversationMemberUsernameSelected
    }

    init (data:Conversation):void {
      this.conversationIdSelected = data.conversationIdSelected
      this.conversationMemberIdSelected = data.conversationMemberIdSelected
      this.conversationMemberUsernameSelected = data.conversationMemberUsernameSelected
    }

    clear () {
      this.conversationIdSelected = ''
      this.conversationMemberIdSelected = ''
      this.conversationMemberUsernameSelected = ''
    }

    getData ():Conversation {
      return this
    }
}
