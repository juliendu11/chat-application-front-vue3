<template>
  <div class="tchat">
    <div class="tchat__header">
      <h3>{{ $route.params.name }}</h3>
    </div>
    <perfect-scrollbar>
    <div class="tchat__content">
      <div class="message-item">
        <img src="https://randomuser.me/api/portraits/men/62.jpg" alt="" />
        <div class="message-item__content">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            posuere ex sit amet tortor viverra, non efficitur ex efficitur. Ut
            placerat, massa bibendum molestie euismod, eros enim tempus mauris,
            at laoreet velit orci vel metus. Suspendisse potenti. Vestibulum
            blandit lacinia sem id hendrerit. Praesent ultrices est eget eros
            laoreet, sed gravida lectus luctus. Phasellus non velit sit amet ex
            luctus auctor. Nulla et nulla sapien. Nam luctus leo elit, a rhoncus
            quam vehicula nec. Integer at nisl sit amet lectus tincidunt dictum.
          </p>
          <span>1h</span>
        </div>
      </div>
      <div class="message-item message-item--right">
        <img src="https://randomuser.me/api/portraits/men/62.jpg" alt="" />
        <div class="message-item__content">
          <p>Fusce</p>
          <span>1m</span>
        </div>
      </div>
       <div class="message-item message-item--right">
        <img src="https://randomuser.me/api/portraits/men/62.jpg" alt="" />
        <div class="message-item__content">
          <p>Fusce</p>
          <span>1m</span>
        </div>
      </div>
       <div class="message-item message-item--right">
        <img src="https://randomuser.me/api/portraits/men/62.jpg" alt="" />
        <div class="message-item__content">
          <p>Fusce</p>
          <span>1m</span>
        </div>
      </div>
       <div class="message-item message-item--right">
        <img src="https://randomuser.me/api/portraits/men/62.jpg" alt="" />
        <div class="message-item__content">
          <p>Fusce</p>
          <span>1m</span>
        </div>
      </div>
       <div class="message-item message-item--right">
        <img src="https://randomuser.me/api/portraits/men/62.jpg" alt="" />
        <div class="message-item__content">
          <p>Fusce</p>
          <span>1m</span>
        </div>
      </div>
       <div class="message-item message-item--right">
        <img src="https://randomuser.me/api/portraits/men/62.jpg" alt="" />
        <div class="message-item__content">
          <p>Fusce</p>
          <span>1m</span>
        </div>
      </div>
       <div class="message-item message-item--right">
        <img src="https://randomuser.me/api/portraits/men/62.jpg" alt="" />
        <div class="message-item__content">
          <p>Fusce</p>
          <span>1m</span>
        </div>
      </div>
       <div class="message-item message-item--right">
        <img src="https://randomuser.me/api/portraits/men/62.jpg" alt="" />
        <div class="message-item__content">
          <p>Fusce</p>
          <span>1m</span>
        </div>
      </div>
       <div class="message-item message-item--right">
        <img src="https://randomuser.me/api/portraits/men/62.jpg" alt="" />
        <div class="message-item__content">
          <p>Fusce</p>
          <span>1m</span>
        </div>
      </div>
       <div class="message-item message-item--right">
        <img src="https://randomuser.me/api/portraits/men/62.jpg" alt="" />
        <div class="message-item__content">
          <p>Fusce</p>
          <span>1m</span>
        </div>
      </div>
    </div>
    </perfect-scrollbar>
    <div class="tchat__footer"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'

import MessageItem from '@/types/MessageItem'
export default defineComponent({
  name: 'Room',
  setup () {
    const messageToSend = ref('')
    const messages = ref([])

    const pagination = reactive({
      skip: 0,
      limit: 8,
      moreAvailable: true,
      pageCount: 5,
      page: 1
    })
  }
})
</script>

<style>
</style>
