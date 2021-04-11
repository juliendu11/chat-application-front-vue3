type LoginMemberInput = {
    loginMemberInput:{
        id: string
password: string
    }
}

type LoginMemberOutput = {
    login:{
        result:boolean
        message:string
        token:string
    }
}

export {
  LoginMemberOutput,
  LoginMemberInput
}
