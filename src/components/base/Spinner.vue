<template>
  <div class="spinner" :class="'spinner--'+color">
      <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Spinner',
  props: {
    color: {
      type: String,
      default: 'primary'
    }
  }
})
</script>

<style>

</style>
