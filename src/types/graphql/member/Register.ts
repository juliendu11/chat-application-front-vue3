type RegisterMemberInput= {
    registerMemberInput:{
        email: string
        password: string
        username: string
    }

}

type RegisterMemberOutput = {
    register:{
        result:boolean,
        message:string
    }
}

export {
  RegisterMemberInput,
  RegisterMemberOutput
}
