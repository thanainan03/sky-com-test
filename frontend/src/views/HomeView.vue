<script lang="ts">
import { onMounted, inject, ref, reactive, watch } from 'vue'
import stringify from 'qs-stringify'
import { AxiosResponse, AxiosError } from 'axios'

import UserDialog from '@/components/UserDialog.vue'

import User from '../interfaces/user'

const columns = [
  {
    name: 'name',
    label: 'Name',
    align: 'left',
    field: 'name'
  },
  { name: 'username', align: 'left', label: 'Username', field: 'username' },
  { name: 'email', align: 'left', label: 'Email', field: 'email' },
  { name: 'phone', align: 'left', label: 'Phone', field: 'phone' },
  { name: 'website', align: 'left', label: 'Website', field: 'website' },
  { name: 'fullAddress', align: 'left', label: 'Address', field: 'fullAddress' },
  { name: 'manage', align: 'center', label: '', field : 'manage', customBody: true }
]

export default {
  components: {
    UserDialog
  },
  setup () {
    const $axios: any = inject('$axios')

    const rows = ref([])
    const search = ref('')
    const loading = ref(false)
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    })

    const showDialog = ref<boolean>(false)

    const onRequest = (props: any) => {
      const { page, rowsPerPage } = props.pagination
      const search = props.search || ''

      const query = {
        page,
        take: rowsPerPage === 0 ? 10000 : rowsPerPage,
        search
      }
      loading.value = true

      $axios.get(`api/users?${stringify(query)}`)
        .then((response: AxiosResponse) => {
          pagination.value.rowsNumber = response.data.total
          rows.value = response.data.data.map((d: any) => ({
              ...d,
              fullAddress: d.address ? `${d.address.street} ${d.address.suite} ${d.address.city} ${d.address.zipcode}` : '',
              manage: true
          }))
        })
        .catch((e: AxiosError) => {
          console.log(e)
        })
        .finally(() => {
          loading.value = false
          pagination.value.page = page
          pagination.value.rowsPerPage = rowsPerPage
        })

    }

    onMounted(() => {
      onRequest({
        pagination: pagination.value,
        search: ''
      })
    })

    watch(search, (val) => {
      onRequest({
        pagination: pagination.value,
        search: val
      })
    })

    const method = ref<string>('ADD')
    const editData = reactive({
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
    const add = (() => {
      method.value = 'ADD'
      showDialog.value = true
    })

    const edit = ((data: User) => {
      method.value = 'EDIT'
      Object.assign(editData, data)
      showDialog.value = true
    })

    const remove = ((data: User) => {
      loading.value = true
      $axios.delete(`/api/users/${data.id}`).then(() => {
        pagination.value.page = 1
        onRequest({
          pagination: pagination.value,
          search: search.value
        })
      }).catch((e: AxiosError) => {
        console.log(e)
      }).finally(() => {
        loading.value = false
      })
    })

    const onSubmitted = () => {
      if (method.value === 'ADD') {
        pagination.value.page = 1   
      }
      onRequest({
        pagination: pagination.value,
        search: search.value
      })
    }

    return {
      search,
      loading,
      pagination,
      columns,
      rows,

      showDialog,

      method,
      editData,

      onRequest,
      add,
      edit,
      remove,
      onSubmitted
    }
  }
}
</script>

<template>
  <main>
    <div class="q-pa-md">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="id"
        v-model:pagination="pagination"
        :loading="loading"
        :search="search"
        @request="onRequest"
      >
        <template v-slot:top>
          <span class="text-h6 q-mr-md">Users</span>
          <q-btn color="primary" :disable="loading" label="Add" @click="add" />
          <q-space />
          <q-input dense debounce="300" color="primary" v-model="search" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="column in columns" :key="column.name" :props="props">
              <template v-if="!column.customBody">
                {{ props.row[column.field] }}
              </template>
              <template v-else>
                <template v-if="column.name === 'manage'">
                  <q-btn color="amber" round icon="edit" size="sm" :disable="loading" @click="edit(props.row)" />
                  <q-btn color="red" round icon="delete" size="sm" :disable="loading" class="q-ml-sm" @click="remove(props.row)" />
                </template>
              </template>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <UserDialog v-model="showDialog" :method="method" :edit-data="editData" @submited="onSubmitted" />
  </main>
</template>

