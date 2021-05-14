type MemberForgotPasswordInput = {
    memberForgotPasswordInput: {
        email: string
    }
}

type MemberForgotPasswordOutput = {
    memberForgotPassword: {
        message: string
        result: boolean
    }
}

export {
  MemberForgotPasswordInput,
  MemberForgotPasswordOutput
}
