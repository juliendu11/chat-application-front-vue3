type MemberLoginInput = {
    memberLoginInput:{
        id: string
password: string
    }
}

type MemberLoginOutput = {
    memberLogin:{
        result:boolean
        message:string
        token:string
    }
}

export {
  MemberLoginInput,
  MemberLoginOutput
}
