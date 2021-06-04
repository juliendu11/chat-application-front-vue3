export type MemberRefreshTokenInput = {}

export type MemberRefreshTokenOutput = {
    memberRefreshToken: {
        result: boolean
        message: string
        newToken:string
    }
}
