<template>
    <div class="contact-card">
      <div class="contact-card__header">
        <span class="contact-card__indicator" :class="{'contact-card__indicator--online':user.isOnline}">
          <i class="fa fa-circle" aria-hidden="true"></i>
        </span>
      </div>
        <div class="contact-card__body">
            <UserPic :image="user.profilPic" :username="user.username"/>
            <h4>{{user.username}}</h4>
            <span>{{user.email}}</span>
        </div>
        <div class="contact-card__actions">
             <Button
             type="btn-outline"
          color="dark"
          @click="onClickSendMessage"
        >
          Send message
        </Button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { useApolloClient } from '@vue/apollo-composable'

import UserPic from '@/components/UserPic.vue'
import { Member } from '../../types/graphql/Items'
import { useStore } from '@/store/Store'
import { ConversationsInput, ConversationsOutput } from '@/types/graphql/conversation/Conversations'

import Conversations from '@/graphql/conversation/queries/Conversations.gql'

export default defineComponent({
  name: 'ContactCard',
  components: { UserPic },
  props: {
    user: {
      type: Object as PropType<Member>,
      required: true
    }
  },
  setup (props) {
    const router = useRouter()
    const store = useStore()
    const { resolveClient } = useApolloClient()

    const client = resolveClient()

    const searchCorrespondingConversation = () => {
      const data = client.readQuery<ConversationsOutput, ConversationsInput>({ query: Conversations })
      if (data && data.conversations) {
        return data.conversations.value.find(x => x.members.find(y => y._id === props.user._id))
      }
      return null
    }

    const onClickSendMessage = () => {
      const correspondingConversation = searchCorrespondingConversation()
      if (correspondingConversation) {
        store.conversation.updateIdSelected(correspondingConversation._id)
      }
      store.conversation.updateMemberIdSelected(props.user._id)

      router.push('/messages/' + props.user.username)
    }

    return {
      onClickSendMessage
    }
  }
})
</script>

<style>

</style>
