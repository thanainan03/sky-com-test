<script lang="ts">
import { ref, watch } from 'vue'

export default {
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  setup (props: any, context: any) {
    const value = ref<string>(props.modelValue)
    watch(() => props.modelValue, (val: string) => {
      value.value = val
    })
    watch(() => value.value, (val: string) => {
      context.emit('update:modelValue', val)
    })

    return {
      value
    }
  }
}
</script>

<template>
  <q-input v-model="value" :name="name" :label="label" />
  <div class="text-caption text-red-14 h-20px">{{ errorMessage }}</div>
</template>

<style scoped>
  .h-20px {
    height: 20px !important;
  }
</style>