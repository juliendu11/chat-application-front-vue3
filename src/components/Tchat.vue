<template>
  <div class="tchat">
    <div class="tchat__header">
       <Button :isIcon="true" type="btn-clean" color="primary" @click="onClickReturn">
         <i class="fa fa-chevron-left" aria-hidden="true"></i>
       </Button>
      <h3>{{ header }}</h3>
    </div>
    <perfect-scrollbar id="scrollBar" :class="{'ps--grow':mediasSelected.length !== 0}" @ps-y-reach-start="onScrollUp">
      <div class="tchat__content">
        <MessageItem
          v-for="(message, z) in messagesReversed"
          :key="z"
          :message="message"
          :isRight="isMe(message.user._id)"
        />
      </div>
    </perfect-scrollbar>
    <div class="tchat__footer" :class="{'tchat__footer--grow':mediasSelected.length !== 0}">
      <form @submit.prevent="onSubmitForm">
        <input
          id="tchatFileInput"
          type="file"
          hidden
          accept="video/*,image/*"
          multiple
          @change="onAddFiles"
        />
        <div class="tchat__files-selected-zone">
          <FileSelected v-for="(file, i) in mediasSelected" :key="i" :file="file" @on-delete="onDeleteFileSelected"/>
        </div>
        <textarea placeholder="Type your message here" v-model="formMessage" />
        <div class="tchat__footer-btn">
          <div>
            <div class="tchat__icon" @click="onClickUploadFile">
              <i class="fa fa-file-image-o" aria-hidden="true"></i>
            </div>
          </div>
          <Button :loading="loading" :disabled="loading">
            Send
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import MessageItemType from '@/types/MessageItem'
import { computed, defineComponent, PropType } from 'vue'

import MessageItem from '@/components/MessageItem.vue'
import FileSelected from '@/components/FileSelected.vue'
import { MediaSelected } from '@/types/MediaSelected'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Tchat',
  components: {
    MessageItem, FileSelected
  },
  props: {
    header: {
      type: String,
      default: ''
    },
    messagesReversed: {
      type: Object as PropType<MessageItemType[]>,
      required: true
    },
    message: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    myId: {
      type: String,
      required: true
    },
    mediasSelected: {
      type: Object as PropType<MediaSelected[]>,
      required: true
    }
  },
  emits: ['submit', 'scoll-up', 'update:message', 'on-delete-file', 'on-add-files'],
  setup (props, { emit }) {
    const router = useRouter()

    const formMessage = computed({
      get: () => props.message,
      set: (val) => {
        emit('update:message', val)
      }
    })

    const isMe = (id:string):boolean => {
      return props.myId === id
    }

    const onScrollUp = () => {
      emit('scoll-up')
    }

    const onSubmitForm = () => {
      emit('submit')
    }

    const onAddFiles = (e:any) => {
      emit('on-add-files', e)
    }

    const onDeleteFileSelected = (name: string) => {
      emit('on-delete-file', name)
    }

    const onClickUploadFile = () => {
      const fileInput = document.querySelector('#tchatFileInput')
      if (fileInput) {
        (fileInput as any).click()
      }
    }

    const onClickReturn = () => {
      router.push('/')
    }

    return {
      onScrollUp,
      onSubmitForm,
      onAddFiles,
      onDeleteFileSelected,
      onClickUploadFile,
      formMessage,
      isMe,
      onClickReturn
    }
  }
})
</script>
