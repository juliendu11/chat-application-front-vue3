<template>
  <div class="auth-page">
    <div class="auth-page__header">
      <img src="/logo.png" alt="" />
    </div>
    <div class="auth-page__container">
      <h2>Reset password</h2>
      <div class="auth-page__secondary">
        <a href="#" class="btn-link btn-link--primary" @click="onClickLogin">Log in</a>
      </div>
      <form class="form" @submit.prevent="onSubmitForm">
         <FormGroup
          v-model="state.password"
          type="password"
          id="password"
          name="password"
          label="Password"
          @blur="v$.password.$touch()"
          @input="v$.password.$touch()"
          :errors="passwordErrors"
        />
        <FormGroup
          v-model="state.rePassword"
          type="password"
          id="password"
          name="password"
          label="Password"
          @blur="v$.rePassword.$touch()"
          @input="v$.rePassword.$touch()"
          :errors="rePasswordErrors"
        />
        <Button
          color="primary"
          :disabled="state.loading"
          :loading="state.loading"
        >
          Sign in
        </Button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { showErrorSwal, showSuccessSwal } from '@/services/swal.service'
import { useRoute, useRouter } from 'vue-router'

import ResetPassword from '@/graphql/member/mutations/ResetPassword.gql'
import { MemberForgotPasswordInput, MemberForgotPasswordOutput } from '@/types/graphql/member/ResetPassword'
import { useMutation } from '@vue/apollo-composable'

export default defineComponent({
  name: 'ResetPassword',
  setup () {
    const router = useRouter()
    const route = useRoute()

    const state = reactive({
      password: '',
      repassword: '',
      email: '',
      token: '',
      loading: false
    })

    onMounted(() => {
      if (route.query.email && route.query.token) {
        state.email = route.query.email as string
        state.token = route.query.token as string
      } else {
        showErrorSwal('Missing parameters')
      }
    })

    const v$ = useVuelidate(
      {
        password: { required },
        repassword: { required }
      },
      state
    )

    const { mutate } = useMutation<MemberForgotPasswordOutput, MemberForgotPasswordInput>(ResetPassword)

    const onSubmitForm = async () => {
      try {
        const isFormCorrect = await v$.value.$validate()
        if (!isFormCorrect) return

        state.loading = true

        const { data } = await mutate({
          memberForgotPasswordInput: {
            email: state.email,
            newPassword: state.repassword,
            token: state.token
          }
        })

        if (!data) {
          throw new Error('Unable to get data')
        }

        if (!data.memberForgotPassword.result) {
          showErrorSwal(data.memberForgotPassword.message)
          return
        }
        showSuccessSwal(data.memberForgotPassword.message)
      } catch (error) {
        showErrorSwal(error.message)
      } finally {
        state.loading = false
      }
    }

    const onClickLogin = () => {
      router.push('/login')
    }

    const passwordErrors = computed<string[]>(() => {
      const errors: string[] = []
      if (!v$.value.password.$dirty) return errors
      if (v$.value.password.required.$invalid) {
        errors.push('Password is required')
      }
      return errors
    })

    const rePasswordErrors = computed<string[]>(() => {
      const errors: string[] = []
      if (!v$.value.repassword.$dirty) return errors
      if (v$.value.repassword.required.$invalid) {
        errors.push('Re-password is required')
      }
      return errors
    })

    return {
      state,
      onSubmitForm,
      v$,
      passwordErrors,
      rePasswordErrors,
      onClickLogin
    }
  }
})
</script>
