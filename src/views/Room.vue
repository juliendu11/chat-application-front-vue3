<template>
  <div class="tchat">
    <div class="tchat__header">
      <h3>{{ $route.params.name }}</h3>
    </div>
    <perfect-scrollbar>
      <div class="tchat__content"></div>
    </perfect-scrollbar>
    <div class="tchat__footer">
      <form @submit.prevent="onSubmitForm">
        <input id="tchatFileInput" type="file" hidden accept="video/*,image/*" @change="onAddFiles">
        <textarea placeholder="Type your message here" v-model="form.message"/>
        <div class="tchat__footer-btn">
          <div>
            <div class="tchat__icon" @click="onClickUploadFile">
              <i class="fa fa-file-image-o" aria-hidden="true"></i>
            </div>
          </div>
          <Button :loading="form.loading" :disabled="form.loading"> Send </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import AddRoomMessage from '@/graphql/rooms/mutations/AddRoomMessage.gql'
import { AddRoomMessageInput, AddRoomMessageOuput } from '@/types/graphql/rooms/AddRoomMessage'

import { showErrorSwal } from '../services/swal.service'
import { useStore } from '../store/Store'

export default defineComponent({
  name: 'Room',
  setup () {
    const store = useStore()

    const form = reactive({
      message: '',
      loading: false
    })

    const v$ = useVuelidate(
      {
        message: { required }
      },
      form
    )

    const { mutate } = useMutation<AddRoomMessageOuput, AddRoomMessageInput>(AddRoomMessage)

    const onSubmitForm = async () => {
      try {
        const isFormCorrect = await v$.value.$validate()
        if (!isFormCorrect) return

        form.loading = true

        const { data } = await mutate({
          addRoomMessageInput: {
            id: store.room.getIdSelected(),
            message: form.message
          }
        })

        if (!data) {
          throw new Error('Unable to get data')
        }

        if (!data.addRoomMessage.result) {
          showErrorSwal(data.addRoomMessage.message)
          return
        }
      } catch (error) {
        showErrorSwal(error.message)
      } finally {
        form.loading = false
      }
    }

    const onClickUploadFile = () => {
      const fileInput = document.querySelector('#tchatFileInput')
      if (fileInput) {
        (fileInput as any).click()
      }
    }

    const onAddFiles = () => {
      console.log('onAddFiles')
    }

    return {
      onSubmitForm,
      form,
      onAddFiles,
      onClickUploadFile
    }
  }
})
</script>

<style>
</style>
