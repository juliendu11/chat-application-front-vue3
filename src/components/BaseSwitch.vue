<template>
  <span class="switch" :class="getClass">
    <label>
      <input
        :value="modelValue"
        :disabled="disabled"
        type="checkbox"
        :checked="modelValue"
        :name="name"
         @input="onUpdateValue"
      />
      <span></span>
    </label>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
export default defineComponent({
  name: 'Switch',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'primary'
    },
    isOutline: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const getClass = computed(() => {
      let _class = 'switch switch-' + props.color
      if (props.isOutline) {
        _class = 'switch switch-outline-' + props.color
      }
      if (props.disabled) {
        _class += ' disabled'
      }
      if (props.size) {
        _class += ' switch-' + props.size
      }
      return _class
    })
    const onUpdateValue = (event:any) => {
      const isChecked = event.target.checked
      if (typeof isChecked === 'string') {
        emit('update:modelValue', isChecked === 'true')
      } else {
        emit('update:modelValue', isChecked)
      }
    }
    return { getClass, onUpdateValue }
  }
})
</script>
