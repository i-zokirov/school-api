import { Expose, Type } from 'class-transformer'
import { StudentDto } from 'src/students/dto/student.dto'
import { UserDto } from 'src/users/dto/user.dto'

export class GroupDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  @Type(() => StudentDto)
  students: StudentDto[]

  @Expose()
  @Type(() => UserDto)
  teachers: UserDto[]

  @Expose()
  @Type(() => UserDto)
  createdBy: UserDto

  @Expose()
  updatedAt: string
  @Expose()
  createdAt: string
}
