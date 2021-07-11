<template>
    <div class="card">
        <div class="card__header">
            <h3>Add room</h3>
        </div>
        <div class="card__body">
           <FormGroup v-model="state.name" label="Name" id="name" type="text" name="name" @blur="v$.name.$touch()"
          @input="v$.name.$touch()"
          :errors="nameErrors"/>
        </div>
        <div class="card__actions">
            <Button :disabled="state.loading" type="btn-clean" @click="onClickCancel">Cancel</Button>
            <Button :disabled="state.loading" :loading="state.loading" @click="onClickAddNewRoom">Add new room</Button>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useMutation } from '@vue/apollo-composable'

import CreateRoom from '@/graphql/rooms/mutations/CreateRoom.gql'

import { RoomCreateInput, RoomCreateOutput } from '@/types/graphql/rooms/CreateRoom'
import { showErrorSwal, showSuccessSwal } from '../services/swal.service'

export default defineComponent({
  name: 'AddRoomDialog',
  emits: ['close'],
  setup (_, { emit }) {
    const state = reactive({
      name: '',
      isPrivate: false,
      loading: false
    })

    const onClickCancel = () => {
      emit('close')
    }

    const v$ = useVuelidate(
      {
        name: { required }
      },
      state
    )

    const nameErrors = computed<string[]>(() => {
      const errors: string[] = []
      if (!v$.value.name.$dirty) return errors
      if (v$.value.name.required.$invalid) {
        errors.push('Name is required')
      }
      return errors
    })

    const { mutate } = useMutation<RoomCreateOutput, RoomCreateInput>(CreateRoom)

    const onClickAddNewRoom = async () => {
      try {
        const isFormCorrect = await v$.value.$validate()
        if (!isFormCorrect) return

        state.loading = true

        const { data } = await mutate({
          roomCreateInput: {
            name: state.name,
            isPrivate: state.isPrivate
          }
        })

        if (!data) {
          throw new Error('Unable to get data')
        }

        if (!data.roomCreate.result) {
          showErrorSwal(data.roomCreate.message)
          return
        }

        showSuccessSwal('The room has been added successfully')
        onClickCancel()
      } catch (error) {
        showErrorSwal(error.message)
      } finally {
        state.loading = false
      }
    }

    return {
      state,
      onClickCancel,
      onClickAddNewRoom,
      nameErrors,
      v$
    }
  }
})
</script>

<style>

</style>
