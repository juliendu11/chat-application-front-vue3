type ResetPasswordInput = {
    resetPasswordInput: {
        email: string
newPassword: string
token: string
    }
}

type ResetPasswordOutput = {
    resetPassword: {
        message: string
        result: boolean
    }
}

export {
  ResetPasswordInput,
  ResetPasswordOutput
}
