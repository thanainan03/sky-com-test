import { getRepository, ILike } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { User } from '../entity/User'
import { Address } from '../entity/Address'

export class UserController {
  private userRepository = getRepository(User);
  private addressRepository = getRepository(Address);

  async all (request: Request, response: Response, next: NextFunction) {
    try {
      const page: number = +(request.query.page || 1)
      const take: number = +(request.query.take || 10)
      const search: string = request.query.search || ''

      let where = []
      if (search) {
        const searchLike: string = `%${search}%`
        where = [
          { name: ILike(searchLike) },
          { email: ILike(searchLike) }
        ]
      }

      const [data, total] = await this.userRepository.findAndCount({
        relations: ['address'],
        take,
        skip: take * (page - 1),
        where,
        order: {
          id: 'DESC'
        }
      })

      const firstPage: number = 1
      const lastPage: number = total > take ? Math.floor((total / take)) : 1

      return response.status(200).json({
        data, total, page, take, firstPage, lastPage
      })
    } catch (e) {
      console.log(e.message)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }

  async one (request: Request, response: Response, next: NextFunction) {
    try {
      const user = await this.userRepository.findOne(request.params.id, { relations: ['address'] })
      if (!user) {
        return response.status(404).send({ message: 'User Not found' })
      }
      return response.json(user)
    } catch (e) {
      console.log(e.message)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }

  async save (request: Request, response: Response, next: NextFunction) {
    try {
      const addressBody = request.body.address || {}
      const address = {
        street: addressBody.street || '',
        suite: addressBody.suite || '',
        city: addressBody.city || '',
        zipcode: addressBody.zipcode || ''
      }

      const user = {
        name: request.body.name || '',
        username: request.body.username || '',
        email: request.body.email || '',
        phone: request.body.phone || '',
        website: request.body.website || '',
        address: await this.addressRepository.save(address)
      }

      const result = await this.userRepository.save(user)
      return response.json(result)
    } catch (e) {
      console.log(e.message)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }

  async update (request: Request, response: Response, next: NextFunction) {
    try {
      const user = await this.userRepository.findOne(request.params.id, { relations: ['address'] })
      if (!user) {
        return response.status(404).send({ message: 'User Not found' })
      }

      const addressBody = request.body.address || {}
      const address = {
        street: addressBody.street || user.address.street,
        suite: addressBody.suite || user.address.suite,
        city: addressBody.city || user.address.city,
        zipcode: addressBody.zipcode || user.address.zipcode
      }

      await this.addressRepository.update(user.address.id, address)

      const newUser = {
        name: request.body.name || user.name,
        username: request.body.username || user.username,
        email: request.body.email || user.email,
        phone: request.body.phone || user.phone,
        website: request.body.website || user.website
      }

      await this.userRepository.update(user.id, newUser)
      return response.json(newUser)
    } catch (e) {
      console.log(e.message)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }

  async remove (request: Request, response: Response, next: NextFunction) {
    try {
      const userToRemove = await this.userRepository.findOne(request.params.id, { relations: ['address'] })
      if (!userToRemove) {
        return response.status(404).send({ message: 'User Not found' })
      }
      await this.userRepository.remove(userToRemove)

      if (userToRemove.address) {
        const addressToRemove = await this.addressRepository.findOne(userToRemove.address.id)
        if (addressToRemove) {
          await this.addressRepository.remove(addressToRemove)
        }
      }

      response.status(204).end()
    } catch (e) {
      console.log(e.message)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }
}
