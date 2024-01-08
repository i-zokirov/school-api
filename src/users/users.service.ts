import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  create(createUserDto: CreateUserDto) {
    const user = this.repository.create(createUserDto)
    return this.repository.save(user)
  }

  findAll(query?: FindManyOptions<User>) {
    return this.repository.find(query)
  }

  findOne(query?: FindOneOptions<User>) {
    return this.repository.findOne(query)
  }

  async updateById(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.repository.findOne({ where: { id } })
    if (!user) throw new NotFoundException(`User with id ${id} not found`)
    Object.assign(user, updateUserDto)
    return this.repository.save(user)
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto) {
    Object.assign(user, updateUserDto)
    return this.repository.save(user)
  }

  async removeById(id: string) {
    const user = await this.repository.findOne({ where: { id } })
    if (!user) throw new NotFoundException(`User with id ${id} not found`)
    return this.repository.remove(user)
  }

  async removeUser(user: User) {
    return this.repository.remove(user)
  }
}
