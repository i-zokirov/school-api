import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import { CreateStudentDto } from './dto/create-student.dto'
import { UpdateStudentDto } from './dto/update-student.dto'
import { Student } from './entities/student.entity'

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private repository: Repository<Student>
  ) {}

  create(createStudentDto: CreateStudentDto) {
    const { user_id } = createStudentDto
    const student = this.repository.create({
      user: { id: user_id }
    })
    return this.repository.save(student)
  }

  findAll(options?: FindManyOptions<Student>) {
    return this.repository.find(options)
  }

  findOne(options?: FindOneOptions<Student>) {
    return this.repository.findOne(options)
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.repository.findOne({ where: { id } })
    if (!student) throw new NotFoundException(`Student with id ${id} not found`)
    Object.assign(student, updateStudentDto)
    return this.repository.save(student)
  }

  async remove(id: string) {
    const student = await this.repository.findOne({ where: { id } })
    if (!student) throw new NotFoundException(`Student with id ${id} not found`)
    return this.repository.remove(student)
  }
}
