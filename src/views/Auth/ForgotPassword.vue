<template>
  <div class="auth-page">
    <div class="auth-page__header">
      <img src="/logo.png" alt="" />
    </div>
    <div class="auth-page__container">
      <h2>Forgot password</h2>
      <div class="auth-page__secondary">
         <span class="text-muted">Already an account ?</span>
        <a href="#" class="btn-link btn-link--primary" @click="onClickLogin">Log in</a>
      </div>
      <form class="form" @submit.prevent="onSubmitForm">
        <FormGroup
          v-model="state.email"
          label="Email"
          id="email"
          name="email"
          @blur="v$.email.$touch()"
          @input="v$.email.$touch()"
          :errors="emailErrors"
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
import { computed, defineComponent, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email as emailValidator } from '@vuelidate/validators'

import { showErrorSwal, showSuccessSwal } from '@/services/swal.service'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'

import { ForgotPasswordInput, ForgotPasswordOutput } from '@/types/graphql/member/ForgotPassword'
import ForgotPassword from '@/graphql/member/mutations/ForgotPassword.gql'

export default defineComponent({
  name: 'ForgotPassword',
  setup () {
    const router = useRouter()

    const state = reactive({
      email: '',
      loading: false
    })

    const v$ = useVuelidate(
      {
        email: { required, email: emailValidator }
      },
      state
    )

    const { mutate } = useMutation<ForgotPasswordOutput, ForgotPasswordInput>(ForgotPassword)

    const onSubmitForm = async () => {
      try {
        const isFormCorrect = await v$.value.$validate()
        if (!isFormCorrect) return

        state.loading = true

        const { data } = await mutate({
          forgotPasswordInput: {
            email: state.email
          }
        })

        if (!data) {
          throw new Error('Unable to get data')
        }

        if (!data.forgotPassword.result) {
          showErrorSwal(data.forgotPassword.message)
          return
        }

        showSuccessSwal(data.forgotPassword.message)
      } catch (error) {
        showErrorSwal(error.message)
      } finally {
        state.loading = false
      }
    }

    const onClickLogin = () => {
      router.push('/login')
    }

    const emailErrors = computed<string[]>(() => {
      const errors: string[] = []
      if (!v$.value.email.$dirty) return errors
      if (v$.value.email.required.$invalid) {
        errors.push('Email is required')
      }
      return errors
    })

    return {
      state,
      onSubmitForm,
      v$,
      emailErrors,
      onClickLogin
    }
  }
})
</script>
