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

import UserPic from '@/components/UserPic.vue'
import { useRouter } from 'vue-router'
import { Member } from '../../types/graphql/Items'

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

    const onClickSendMessage = () => {
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
