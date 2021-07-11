<template>
  <div v-if="show" class="dialog-wrapper__mask" />
  <div class="right-drawer" :class="{'right-drawer--show':show}">
    <div class="right-drawer__header">
      <Button type="btn-text" :isIcon="true"  color="dark" @click="onClickClose">
        <i class="fa fa-times" aria-hidden="true"></i>
      </Button>
    </div>
    <UserPic :username="username" :image="profilPic"/>
    <h3>{{username}}</h3>
    <input id="fileInput" type="file" hidden accept="image/*" @change="onAddFiles">
    <Button color="primary" @click="onClickChangeImage"> Change image </Button>
    <div class="right-drawer__bottom">
    <Button type="btn-clean" color="primary" @click="onClickLogout"> Logout </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'

import UserPic from '@/components/UserPic.vue'
import { useMitt } from '../plugins/mitt'
import { getProfilInformation } from '@/common/profil'

import MemberUpdateProfilPic from '@/graphql/member/mutations/MemberUpdateProfilPic.gql'
import { MemberUpdateProfilPicInput, MemberUpdateProfilPicOutput } from '@/types/graphql/member/MemberUpdateProfilPic'
import { showErrorSwal, showSuccessSwal } from '../services/swal.service'
import { deleteToken } from '../services/token.service'

export default defineComponent({
  name: 'RightDrawer',
  components: { UserPic },
  setup () {
    const mitt = useMitt()

    const show = ref(false)

    const loading = ref(false)

    mitt.rightDrawer.listen(() => {
      show.value = true
    })

    const { mutate } = useMutation<MemberUpdateProfilPicOutput, MemberUpdateProfilPicInput>(MemberUpdateProfilPic)

    const onClickChangeImage = () => {
      const fileInput = document.querySelector('#fileInput')
      if (fileInput) {
        (fileInput as any).click()
      }
    }

    const updateProfilPic = async (file:File) => {
      try {
        loading.value = true
        const { data } = await mutate({
          membersUpdateProfilPicInput: {
            filesSelected: file
          }
        })

        if (!data) {
          throw new Error('Unable to get data')
        }

        if (!data.membersUpdateProfilPic.result) {
          showErrorSwal(data.membersUpdateProfilPic.message)
          return
        }

        showSuccessSwal('Congratulations you have updated your profile picture')
      } catch (error) {
        showErrorSwal(error.message)
      } finally {
        loading.value = false
      }
    }

    const onAddFiles = async (e:any) => {
      const file = (e.target.files as FileList).item(0)
      if (!file) return
      await updateProfilPic(file as File)
    }

    const onClickLogout = () => {
      deleteToken()
      window.location.reload()
    }

    const onClickClose = () => {
      show.value = false
    }

    return {
      show,
      onClickChangeImage,
      onAddFiles,
      ...getProfilInformation(),
      onClickLogout,
      onClickClose
    }
  }
})
</script>

<style>
</style>
