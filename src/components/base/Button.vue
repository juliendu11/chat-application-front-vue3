<template>
    <button type="submit" :class="getClass">
        <div v-if="loading" class="btn__loading">
        <div class="loader"></div>
                <slot/>
        </div>
        <slot v-else/>
    </button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'Button',
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    type: {
      type: String,
      default: 'btn'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const getClass = computed(() => {
      let _class = `btn btn--${props.color}`
      if (props.type === 'btn') {
        _class = `btn btn--${props.color}`
      }
      if (props.type === 'btn-clean') {
        _class = `btn-clean btn-clean--${props.color}`
      }
      if (props.disabled) {
        _class += ' disabled'
      }
      if (props.rounded) {
        _class += ' btn-rounded '
      }

      return _class
    })

    return {
      getClass
    }
  }
})
</script>

<style>

</style>
