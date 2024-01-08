import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import nanoid from 'src/utils/nanoid'
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import { CreateSubjectDto } from './dto/create-subject.dto'
import { UpdateSubjectDto } from './dto/update-subject.dto'
import { Subject } from './entities/subject.entity'

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject) private repository: Repository<Subject>
  ) {}
  create(createSubjectDto: CreateSubjectDto) {
    const subject = this.repository.create({
      ...createSubjectDto,
      subjectCode: nanoid()
    })
    return this.repository.save(subject)
  }

  findAll(options?: FindManyOptions<Subject>) {
    return this.repository.find(options)
  }

  findOne(options: FindOneOptions<Subject>) {
    return this.repository.findOne(options)
  }

  async updateOneById(id: string, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.repository.findOne({ where: { id } })
    if (!subject) throw new NotFoundException(`Subject with id ${id} not found`)
    Object.assign(subject, updateSubjectDto)
    return this.repository.save(subject)
  }

  async removeOneById(id: string) {
    const subject = await this.repository.findOne({ where: { id } })
    if (!subject) throw new NotFoundException(`Subject with id ${id} not found`)
    return this.repository.remove(subject)
  }
}
