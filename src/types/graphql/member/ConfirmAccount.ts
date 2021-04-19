type ConfirmAccountInput = {
    confirmAccountInput: {
        email: string
        token: string
    }
}

type ConfirmAccountOutput = {
    confirmAccount: {
        message: string
        result: boolean
    }
}

export {
  ConfirmAccountInput,
  ConfirmAccountOutput
}
