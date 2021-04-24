import IStore from './IStore'
export class Member implements IStore<Member> {
    private email =''
    private username=''
    private id=''

    updateEmail (email:string):void {
      this.email = email
    }

    getEmail ():string {
      return this.email
    }

    updateUsername (username:string):void {
      this.username = username
    }

    getUsername ():string {
      return this.username
    }

    updateId (id:string):void {
      this.id = id
    }

    getId ():string {
      return this.id
    }

    init (data:Member):void {
      this.email = data.email
      this.username = data.username
      this.id = data.id
    }

    getData ():Member {
      return this
    }
}
