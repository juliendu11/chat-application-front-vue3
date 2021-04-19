<template>
  <div class="switch__container">
    <span>{{ label }}:</span>
    <label class="switch">
      <input
        type="checkbox"
        :value="modelValue"
        :checked="modelValue"
        :name="name"
        @input="onUpdateValue"
      />
      <span class="switch__slider round"></span>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Switch',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup (_, { emit }) {
    const onUpdateValue = (event: any) => {
      const isChecked = event.target.checked
      if (typeof isChecked === 'string') {
        emit('update:modelValue', isChecked === 'true')
      } else {
        emit('update:modelValue', isChecked)
      }
    }

    return { onUpdateValue }
  }
})
</script>

<style>
</style>
