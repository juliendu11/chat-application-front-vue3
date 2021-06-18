<template>
  <div class="auth-page">
    <div class="auth-page__header">
      <img src="/logo.png" alt="" />
    </div>
    <div class="auth-page__container">
      <div v-if="!state.loading">
        <i v-show="!state.error" class="fa fa-check-circle text-success" aria-hidden="true"></i>
        <i v-show="state.error" class="fa fa-ban text-danger" aria-hidden="true"></i>
      </div>
      <Spinner  v-else/>
      <p v-if="state.message">{{ state.message }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'

import { useRoute } from 'vue-router'

import ConfirmAccount from '@/graphql/member/mutations/ConfirmAccount.gql'
import {
  MemberConfirmMemberInput,
  MemberConfirmMemberOutput
} from '@/types/graphql/member/ConfirmAccount'
import { useMutation } from '@vue/apollo-composable'

import Spinner from '@/components/base/Spinner.vue'

export default defineComponent({
  name: 'Confirm',
  components: { Spinner },
  setup () {
    const route = useRoute()

    const state = reactive({
      email: '',
      token: '',
      loading: false,

      title: 'Account confirmation in progress',
      error: false,
      message: ''
    })

    onMounted(() => {
      if (route.query.email && route.query.token) {
        state.email = route.query.email as string
        state.token = route.query.token as string
      } else {
        showErrorMessage('Missing parameters')
      }
    })

    const showErrorMessage = (message: string) => {
      state.title = 'Sorry, an error occured'
      state.error = true
      state.message = message
    }

    const showSuccessMessage = (message: string) => {
      state.title = 'Congratulations'
      state.error = false
      state.message = message
    }

    const { mutate } = useMutation<MemberConfirmMemberOutput, MemberConfirmMemberInput>(ConfirmAccount)

    const onSubmitForm = async () => {
      try {
        state.loading = true

        const { data } = await mutate({
          memberConfirmAccountInput: {
            email: state.email,
            token: state.token
          }
        })

        if (!data) {
          throw new Error('Unable to get data')
        }

        if (!data.memberConfirmAccount.result) {
          showErrorMessage(data.memberConfirmAccount.message)
          return
        }
        showSuccessMessage(data.memberConfirmAccount.message)
      } catch (error) {
        showErrorMessage(error.message)
      } finally {
        state.loading = false
      }
    }

    onMounted(() => {
      onSubmitForm()
    })

    return {
      state,
      onSubmitForm
    }
  }
})
</script>
