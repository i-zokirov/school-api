import { Expose } from 'class-transformer'

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
}
