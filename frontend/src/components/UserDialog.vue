<script lang="ts">
import { ref, watch, inject } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { AxiosError } from 'axios'

import CommonInput from './CommonInput.vue'

import User from '../interfaces/user'

export default {
  components: {
    CommonInput
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    method: {
      type: String,
      default: 'ADD'
    },
    editData: {
      type : Object as () => User,
      default: () => ({
        id: 0,
        name: '',
        username: '',
        email: '',
        phone: '',
        website: '',
        address: {
          street: '',
          suite: '',
          city: '',
          zipcode: ''
        }
      })
    }
  },
  setup (props: any, context: any) {
    const showDialog = ref<boolean>(props.modelValue)
    watch(() => props.modelValue, (val: boolean) => {
      showDialog.value = val
      if (val && props.method === 'EDIT') {
        name.value = props.editData.name
        username.value = props.editData.username
        email.value = props.editData.email
        phone.value = props.editData.phone
        website.value = props.editData.website
        street.value = props.editData.address.street
        suite.value = props.editData.address.suite
        city.value = props.editData.address.city
        zipcode.value = props.editData.address.zipcode
      }
    })
    watch(() => showDialog.value, (val: boolean) => {
      context.emit('update:modelValue', val)
    })

    // Define a validation schema
    const schema = yup.object({
      name: yup.string().required(),
      username: yup.string().required(),
      email: yup.string().required().email(),
      phone: yup.string().required(),
      website: yup.string().required().url(),
      street: yup.string().required(),
      suite: yup.string().required(),
      city: yup.string().required(),
      zipcode: yup.string().required()
    })

    // Create a form context with the validation schema
    const { handleSubmit, resetForm, errors } = useForm({
    validationSchema: schema
    })

    // No need to define rules for fields
    const { value: name } = useField('name')
    const { value: username } = useField('username')
    const { value: email } = useField('email')
    const { value: phone } = useField('phone')
    const { value: website } = useField('website')
    const { value: street } = useField('street')
    const { value: suite } = useField('suite')
    const { value: city } = useField('city')
    const { value: zipcode } = useField('zipcode')

    const $axios: any = inject('$axios')
    const loading = ref<boolean>(false)
    const onSubmit = handleSubmit((values, { resetForm }) => {
      loading.value = true
      const data: User = {
        name: values.name || '',
        username: values.username || '',
        email: values.email || '',
        phone: values.phone || '',
        website: values.website || '',
        address: {
          street: values.street,
          suite: values.suite,
          city: values.city,
          zipcode: values.zipcode
        }
      }

      $axios({
        method: props.method === 'ADD' ? 'POST' : 'PUT',
        url: props.method === 'ADD' ? '/api/users' : `/api/users/${props.editData.id}`,
        data
      }).then(() => {
        context.emit('update:modelValue', false)
        context.emit('submited')
        resetForm()
      }).catch((e: AxiosError) => {
        console.log(e)
      }).finally(() => {
        loading.value = false
      })
    })

    return {
      showDialog,

      errors,
      
      name,
      username,
      email,
      phone,
      website,
      street,
      suite,
      city,
      zipcode,

      loading,

      onSubmit,
      resetForm
    }
  }
}
</script>

<template>
  <q-dialog
    v-model="showDialog"
    @hide="$emit('update:modelValue', false)"
  >
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">{{ method === 'ADD' ? 'Add' : 'Edit' }} User</div>
      </q-card-section>

      <form @submit="onSubmit">
        <q-card-section class="q-pt-none">
          <div class="text-subtitle1 text-bold">Info</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <CommonInput v-model="name" name="name" label="Name" :error-message="errors.name || ''" />
            </div>
            <div class="col-12 col-md-6">
              <CommonInput v-model="username" name="username" label="Username" :error-message="errors.username || ''" />
            </div>
            <div class="col-12 col-md-6">
              <CommonInput v-model="email" name="email" label="Email" :error-message="errors.email || ''" />
            </div>
            <div class="col-12 col-md-6">
              <CommonInput v-model="phone" name="phone" label="Phone" :error-message="errors.phone || ''" />
            </div>
            <div class="col-12">
              <CommonInput v-model="website" type="url" name="website" label="Website" :error-message="errors.website || ''" />
            </div>
          </div>

          <div class="text-subtitle1 text-bold q-mt-md">Address</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <CommonInput v-model="street" name="street" label="Street" :error-message="errors.street || ''" />
            </div>
            <div class="col-12 col-md-6">
              <CommonInput v-model="suite" name="suite" label="Suite" :error-message="errors.suite || ''" />
            </div>
            <div class="col-12 col-md-6">
              <CommonInput v-model="city" name="city" label="City" :error-message="errors.city || ''" />
            </div>
            <div class="col-12 col-md-6">
              <CommonInput v-model="zipcode" name="zipcode" label="Zipcode" :error-message="errors.zipcode || ''" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat color="primary" label="CANCEL" :disabled="loading" v-close-popup @click="resetForm()" />
          <q-btn type="submit" flat color="primary" :disabled="loading" label="SUBMIT" />
        </q-card-actions>
      </form>
    </q-card>
  </q-dialog>
</template>

