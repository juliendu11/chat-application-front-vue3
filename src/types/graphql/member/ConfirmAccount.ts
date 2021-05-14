type MemberConfirmMemberInput = {
    memberConfirmAccountInput: {
        email: string
        token: string
    }
}

type MemberConfirmMemberOutput = {
    memberConfirmAccount: {
        message: string
        result: boolean
    }
}

export {
  MemberConfirmMemberInput,
  MemberConfirmMemberOutput
}
