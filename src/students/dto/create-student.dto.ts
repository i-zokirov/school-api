import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsUUID } from 'class-validator'

export class CreateStudentDto {
  @ApiProperty({
    type: String,
    description: 'User id of the student',
    required: true
  })
  @IsNotEmpty()
  @IsUUID()
  user_id: string
}
