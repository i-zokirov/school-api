import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import { UpdateGroupDto } from './dto/update-group.dto'
import { Group } from './entities/group.entity'

@Injectable()
export class GroupsService {
  constructor(@InjectRepository(Group) private repository: Repository<Group>) {}

  create(createGroupDto: Partial<Group>) {
    const group = this.repository.create(createGroupDto)
    return this.repository.save(group)
  }

  findAll(options?: FindManyOptions<Group>) {
    return this.repository.find(options)
  }

  findOne(options?: FindOneOptions<Group>) {
    return this.repository.findOne(options)
  }

  async updateOneById(id: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.findOne({ where: { id } })
    if (!group) {
      throw new NotFoundException(`Group with id ${id} not found`)
    }
    Object.assign(group, updateGroupDto)
    return this.repository.save(group)
  }

  save(group: Group) {
    return this.repository.save(group)
  }

  async removeOneById(id: string) {
    const group = await this.findOne({ where: { id } })
    if (!group) {
      throw new NotFoundException(`Group with id ${id} not found`)
    }
    return this.repository.remove(group)
  }
}
