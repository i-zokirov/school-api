import { Expose } from 'class-transformer'

export class SubjectDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  subjectCode: string

  @Expose()
  description: string

  @Expose()
  createdAt: string

  @Expose()
  updatedAt: string
}
