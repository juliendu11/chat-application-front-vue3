<template>
  <div class="home" :class="{'close-drawer': drawerClosed}">
    <DialogWrapper />
    <Header class="home__header" />
    <Drawer class="home__drawer" />
    <RightDrawer />
    <main class="home__content">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import {
  useMutation,
  useQuery,
  useSubscription
} from '@vue/apollo-composable'

import MyInformation from '@/graphql/member/queries/MyInformation.gql'
import MemberOnline from '@/graphql/member/subscriptions/MemberOnline.gql'
import MemberOffline from '@/graphql/member/subscriptions/MemberOffline.gql'

import PushNotificationPublicKey from '@/graphql/web-push/queries/PushNotificationPublicKey.gql'
import PushNotificationSubscribe from '@/graphql/web-push/mutations/PushNotificationSubscribe.gql'

import {
  MemberOnlineInput,
  MemberOnlineOutput
} from '@/types/graphql/member/MemberOnline'
import {
  MemberOfflineInput,
  MemberOfflineOutput
} from '@/types/graphql/member/MemberOffline'

import {
  MemberMyInfoInput,
  MemberMyInfoOutput
} from '@/types/graphql/member/MemberMyInfo'

import { PushNotificationPublicKeyOutput } from '@/types/graphql/web-push/PushNotificationPublicKey'
import { PushNotificationSubscribeInput, PushNotificationSubscribeOutput } from '@/types/graphql/web-push/PushNotificationSubscribe'

import Drawer from '@/components/TheDrawer.vue'
import RightDrawer from '@/components/TheRightDrawer.vue'
import Header from '@/components/TheHeader.vue'
import DialogWrapper from '@/components/DialogWrapper.vue'
import { useStore } from '../store/Store'

import { useMitt } from '@/plugins/mitt'

import { urlBase64ToUint8Array } from '@/helpers/unit-convert'
import { showErrorSwal } from '@/services/swal.service'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'Home',
  components: {
    Drawer,
    Header,
    DialogWrapper,
    RightDrawer
  },
  setup () {
    const store = useStore()
    const mitt = useMitt()
    const route = useRoute()

    const windowWidth = ref(0)

    const { onResult: onResultPushNotificationPck } = useQuery<PushNotificationPublicKeyOutput>(PushNotificationPublicKey)

    const { onResult } = useQuery<MemberMyInfoOutput, MemberMyInfoInput>(
      MyInformation
    )

    onResult((result) => {
      if (result.data && result.data.memberMyInformation.result) {
        store.member.updateEmail(result.data.memberMyInformation.value.email)
        store.member.updateUsername(result.data.memberMyInformation.value.username)
        store.member.updateId(result.data.memberMyInformation.value._id)
        store.member.updateProfilPic(result.data.memberMyInformation.value.profilPic)
      }
    })

    const { result: memberOnlineResult } = useSubscription<
      MemberOnlineOutput,
      MemberOnlineInput
    >(MemberOnline)

    watch(memberOnlineResult, (val) => {
      mitt.memberOnlineStatusChanged.emit({
        member: val.memberOnline,
        isOnline: true
      })
    })

    const { result: memberOfflineResult } = useSubscription<
      MemberOfflineOutput,
      MemberOfflineInput
    >(MemberOffline)

    watch(memberOfflineResult, (val) => {
      mitt.memberOnlineStatusChanged.emit({
        member: val.memberOffline,
        isOnline: false
      })
    })

    const { mutate } = useMutation<PushNotificationSubscribeOutput, PushNotificationSubscribeInput>(PushNotificationSubscribe)

    onResultPushNotificationPck(async (result) => {
      if (!result.data) return
      if (result.data.pushNotificationPublicKey.result) {
        await subscribeWebPush(result.data.pushNotificationPublicKey.value)
      }
    })

    const subscribeWebPush = async (publicKey:string) => {
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        return
      }
      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          const registration = await navigator.serviceWorker.ready
          let subscription = await registration.pushManager.getSubscription()
          if (subscription) {
            return
          }
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey)
          })

          const _sub = subscription.toJSON()
          if (!_sub || !_sub.keys || !_sub.endpoint) return

          await saveSubscription(_sub.keys.auth, _sub.keys.p256dh, _sub.endpoint)
        }
      }
    }

    const saveSubscription = async (auth:string, p256dh:string, endpoint:string) => {
      try {
        const { data } = await mutate({
          pushNotificationSubscribeInput: {
            auth,
            p256dh,
            endpoint
          }
        })

        if (!data) {
          throw new Error('Unable to get data for save subscription')
        }

        if (!data.pushNotificationSubscribe.result) {
          throw new Error(data.pushNotificationSubscribe.message)
        }
      } catch (error) {
        showErrorSwal(`Unable to save push notification subscription, you cannot receive push notification, error message: ${error.message}`)
      }
    }

    windowWidth.value = window.innerWidth

    window.addEventListener('resize', () => {
      windowWidth.value = window.innerWidth
    })

    const drawerClosed = computed(() => {
      return windowWidth.value <= 768 && route.path !== '/'
    })

    return {
      drawerClosed
    }
  }
})
</script>
