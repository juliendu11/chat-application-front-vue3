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
          color="gray"
        >
          Send message
        </Button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import UserPic from '@/components/UserPic.vue'

export default defineComponent({
  name: 'ContactCard',
  components: { UserPic },
  props: {
    user: {
      type: Object
    }
  }
})
</script>

<style>

</style>
