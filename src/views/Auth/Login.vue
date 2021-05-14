<template>
  <div class="auth-page">
    <div class="auth-page__header">
      <img src="/logo.png" alt="" />
    </div>
    <div class="auth-page__container">
      <h2>Login</h2>
      <div class="auth-page__secondary">
        <span class="text-muted">New here ?</span>
        <a href="#" class=" btn-link btn-link--primary" @click.prevent="onClickCreateAccount">Create an account</a>
      </div>
      <form class="form" @submit.prevent="onSubmitForm">
        <FormGroup
          v-model="state.id"
          label="Email or username"
          id="id"
          name="id"
          @blur="v$.id.$touch()"
          @input="v$.id.$touch()"
          :errors="idErrors"
        />
        <FormGroup
          v-model="state.password"
          type="password"
          id="password"
          name="password"
          @blur="v$.password.$touch()"
          @input="v$.password.$touch()"
          :errors="passwordErrors"
        >
          <div class="d-flex align-center justify-content-between">
            <label for="password">Password</label>
            <a href="#" @click.prevent="onClickForgotPassword" class="btn-link btn-small btn-link--primary"
              >Forgot password?</a
            >
          </div>
        </FormGroup>
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
import { required } from '@vuelidate/validators'

import { showErrorSwal } from '@/services/swal.service'
import { useRouter } from 'vue-router'

import Login from '@/graphql/member/mutations/Login.gql'
import { MemberLoginInput, MemberLoginOutput } from '@/types/graphql/member/Login'
import { useMutation } from '@vue/apollo-composable'
import { setToken } from '../../services/token.service'

export default defineComponent({
  name: 'Login',
  setup () {
    const router = useRouter()

    const state = reactive({
      id: '',
      password: '',
      loading: false
    })

    const v$ = useVuelidate(
      {
        id: { required },
        password: { required }
      },
      state
    )

    const { mutate } = useMutation<MemberLoginOutput, MemberLoginInput>(Login)

    const onSubmitForm = async () => {
      try {
        const isFormCorrect = await v$.value.$validate()
        if (!isFormCorrect) return

        state.loading = true

        const { data } = await mutate({
          memberLoginInput: {
            id: state.id,
            password: state.password
          }
        })

        if (!data) {
          throw new Error('Unable to get data')
        }

        if (!data.memberLogin.result) {
          showErrorSwal(data.memberLogin.message)
          return
        }

        setToken(data.memberLogin.token)
        router.push('/')
      } catch (error) {
        showErrorSwal(error.message)
      } finally {
        state.loading = false
      }
    }

    const onClickCreateAccount = () => {
      router.push('/register')
    }

    const onClickForgotPassword = () => {
      router.push('/forgot-password')
    }

    const idErrors = computed<string[]>(() => {
      const errors: string[] = []
      if (!v$.value.id.$dirty) return errors
      if (v$.value.id.required.$invalid) {
        errors.push('Username or email is required')
      }
      return errors
    })
    const passwordErrors = computed<string[]>(() => {
      const errors: string[] = []
      if (!v$.value.password.$dirty) return errors
      if (v$.value.password.required.$invalid) {
        errors.push('Password is required')
      }
      return errors
    })

    return {
      state,
      onSubmitForm,
      v$,
      idErrors,
      passwordErrors,
      onClickCreateAccount,
      onClickForgotPassword
    }
  }
})
</script>
