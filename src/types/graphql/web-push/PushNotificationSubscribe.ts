export type PushNotificationSubscribeInput = {
    pushNotificationSubscribeInput: {
        auth: string
        endpoint: string
        p256dh: string
    }
}

export type PushNotificationSubscribeOutput = {
    pushNotificationSubscribe: {
        result: boolean,
        message:string
    }
}
