<template>
    <div class="card">
        <div class="card__header">
            <h3>Add room</h3>
        </div>
        <div class="card__body">
           <FormGroup v-model="state.name" label="Name" id="name" type="text" name="name"/>
            <Switch v-model="state.isPrivate" label="Is private"/>
        </div>
        <div class="card__actions">
            <Button type="btn-clean">Cancel</Button>
            <Button>Add new room</Button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'AddRoomDialog',
  setup () {
    const state = reactive({
      name: '',
      isPrivate: false
    })

    return {
      state
    }
  }
})
</script>

<style>

</style>
