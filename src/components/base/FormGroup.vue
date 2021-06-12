<template>
  <div class="form__group" :class="{'form__group--error': errors.length !== 0}">
    <label v-if="label" for="id">{{ label }}</label>
    <slot/>
    <input
      :name="name"
      :id="id"
      :type="type"
      :class="disabled ? 'disabled' : ''"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
      :value="modelValue"
    />
     <span class="form__error" v-if="errors.length !== 0">{{
            errors[0]
          }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'FormGroup',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    modelValue: {
      type: String,
      default: ''
    },
    errors: {
      type: Object as PropType<string[]>,
      default: () => null
    }
  }
})
</script>

<style>
</style>
