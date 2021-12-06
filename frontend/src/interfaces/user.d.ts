import Address from './address.d.ts'

export default interface User {
  id?: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: Address
}