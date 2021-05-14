type MemberRegisterInput= {
    memberRegisterMemberInput:{
        email: string
        password: string
        username: string
    }

}

type MemberRegisterOutput = {
    memberRegister:{
        result:boolean,
        message:string
    }
}

export {
  MemberRegisterInput,
  MemberRegisterOutput
}
