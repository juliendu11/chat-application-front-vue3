type MemberResetPasswordInput = {
    memberResetPasswordInput: {
        email: string
        newPassword: string
        token: string
    }
}

type MemberResetPasswordOutput = {
    memberResetPassword: {
        message: string
        result: boolean
    }
}

export {
  MemberResetPasswordInput,
  MemberResetPasswordOutput
}
