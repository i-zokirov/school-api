import { Expose, Type } from 'class-transformer'
import { StudentDto } from 'src/students/dto/student.dto'

export class UserDto {
  @Expose()
  id: string
  @Expose()
  firstName: string
  @Expose()
  lastName: string
  @Expose()
  email: string
  @Expose()
  updatedAt: string
  @Expose()
  createdAt: string
  @Expose()
  role: string
  @Expose()
  @Type(() => StudentDto)
  studentProfile: null | StudentDto
}
