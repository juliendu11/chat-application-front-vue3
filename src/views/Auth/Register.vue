<template>
  <div class="auth-page">
    <div class="auth-page__header">
      <img src="/logo.png" alt="" />
    </div>
    <div class="auth-page__container">
      <h2>Register</h2>
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
          <FormGroup
          v-model="state.username"
          label="Username"
          id="username"
          name="username"
          @blur="v$.username.$touch()"
          @input="v$.username.$touch()"
          :errors="usernameErrors"
        />
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
        <Button
          color="primary"
          :disabled="state.loading"
          :loading="state.loading"
        >
          Sign up
        </Button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

import { showErrorSwal, showSuccessSwal } from '@/services/swal.service'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'

import Register from '@/graphql/member/mutations/Register.gql'

import { RegisterMemberInput, RegisterMemberOutput } from '@/types/graphql/member/Register'

export default defineComponent({
  name: 'Register',
  setup () {
    const router = useRouter()
    const state = reactive({
      username: '',
      email: '',
      password: '',
      loading: false
    })

    const v$ = useVuelidate(
      {
        username: { required },
        email: { required, email },
        password: { required }
      },
      state
    )

    const { mutate } = useMutation<RegisterMemberOutput, RegisterMemberInput>(Register)

    const onSubmitForm = async () => {
      try {
        const isFormCorrect = await v$.value.$validate()
        if (!isFormCorrect) return

        state.loading = true

        const { data } = await mutate({
          registerMemberInput: {
            email: state.email,
            password: state.password,
            username: state.username
          }
        })

        if (!data) {
          throw new Error('Unable to get data')
        }

        if (!data.register.result) {
          showErrorSwal(data.register.message)
          return
        }

        showSuccessSwal(data.register.message)
      } catch (error) {
        showErrorSwal(error.message)
      } finally {
        state.loading = false
      }
    }

    const onClickLogin = () => {
      router.push('/login')
    }

    const usernameErrors = computed<string[]>(() => {
      const errors: string[] = []
      if (!v$.value.username.$dirty) return errors
      if (v$.value.username.required.$invalid) {
        errors.push('Username is required')
      }
      return errors
    })

    const emailErrors = computed<string[]>(() => {
      const errors: string[] = []
      if (!v$.value.email.$dirty) return errors
      if (v$.value.email.required.$invalid) {
        errors.push('Email is required')
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
      usernameErrors,
      emailErrors,
      passwordErrors,
      onClickLogin
    }
  }
})
</script>
