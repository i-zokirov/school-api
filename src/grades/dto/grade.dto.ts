import { Expose, Type } from 'class-transformer'
import { StudentDto } from 'src/students/dto/student.dto'
import { SubjectDto } from 'src/subjects/dto/subject.dto'
import { UserDto } from 'src/users/dto/user.dto'

export class GradeDto {
  @Expose()
  id: string

  @Expose()
  value: number

  @Expose()
  description: string

  @Expose()
  receivedDate: string

  @Expose()
  @Type(() => StudentDto)
  student: StudentDto

  @Expose()
  @Type(() => UserDto)
  teacher: UserDto

  @Expose()
  @Type(() => SubjectDto)
  subject: SubjectDto

  @Expose()
  updatedAt: string

  @Expose()
  createdAt: string
}
