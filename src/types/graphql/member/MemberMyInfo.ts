import MyMemberInfo from '@/types/MyMemberInfo'

export type MemberMyInfoInput = {}

export type MemberMyInfoOutput = {
    memberMyInformation:{
        result:boolean,
        message:'',
        value:MyMemberInfo
    }
}
