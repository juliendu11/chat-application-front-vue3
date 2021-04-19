type ForgotPasswordInput = {
    forgotPasswordInput: {
        email: string
    }
}

type ForgotPasswordOutput = {
    forgotPassword: {
        message: string
        result: boolean
    }
}

export {
  ForgotPasswordInput,
  ForgotPasswordOutput
}
