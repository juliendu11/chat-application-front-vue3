type MemberForgotPasswordInput = {
    memberForgotPasswordInput: {
        email: string
newPassword: string
token: string
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
