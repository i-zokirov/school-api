import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import { Grade } from './entities/grade.entity'

@Injectable()
export class GradesService {
  constructor(@InjectRepository(Grade) private repository: Repository<Grade>) {}

  create(createGradeDto: Partial<Grade>) {
    const grade = this.repository.create(createGradeDto)
    return this.repository.save(grade)
  }

  findAll(options?: FindManyOptions<Grade>) {
    return this.repository.find(options)
  }

  findOne(options?: FindOneOptions<Grade>) {
    return this.repository.findOne(options)
  }

  findGroupAverageGrade(group_id: string) {
    return this.repository
      .createQueryBuilder('grade')
      .select('AVG(grade.value)', 'average')
      .where('grade.group.id = :group_id', { group_id })
      .getRawOne()
  }

  findGroupAverageGradesForAllSubjects(group_id: string) {
    return this.repository
      .createQueryBuilder('grade')
      .select('AVG(grade.value)', 'average')
      .addSelect('subject.name', 'subject')
      .addSelect('subject.id', 'id')
      .leftJoin('grade.subject', 'subject')
      .where('grade.group.id = :group_id', { group_id })
      .groupBy('subject.id')
      .getRawMany()
  }

  findGroupAverageGradeForASubject(group_id: string, subject_id: string) {
    return this.repository
      .createQueryBuilder('grade')
      .select('AVG(grade.value)', 'average')
      .where('grade.group.id = :group_id', { group_id })
      .andWhere('grade.subject.id = :subject_id', { subject_id })
      .getRawOne()
  }

  findStudentAverageGrade(student_id: string) {
    return this.repository
      .createQueryBuilder('grade')
      .select('AVG(grade.value)', 'average')
      .where('grade.student.id = :student_id', { student_id })
      .getRawOne()
  }

  findStudentAverageGradesForAllSubjects(student_id: string) {
    return this.repository
      .createQueryBuilder('grade')
      .select('AVG(grade.value)', 'average')
      .addSelect('subject.name', 'subject')
      .addSelect('subject.id', 'id')
      .leftJoin('grade.subject', 'subject')
      .where('grade.student.id = :student_id', { student_id })
      .groupBy('subject.id')
      .orderBy('subject.name')
      .getRawMany()
  }

  findStudentAverageGradeForASubject(student_id: string, subject_id: string) {
    return this.repository
      .createQueryBuilder('grade')
      .select('AVG(grade.value)', 'average')
      .where('grade.student.id = :student_id', { student_id })
      .andWhere('grade.subject.id = :subject_id', { subject_id })
      .getRawOne()
  }
}
