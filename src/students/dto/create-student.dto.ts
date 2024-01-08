import { ApiProperty } from '@nestjs/swagger'
import { IsMongoId, IsNotEmpty } from 'class-validator'

export class CreateStudentDto {
  @ApiProperty({
    type: String,
    description: 'User id of the student',
    required: true
  })
  @IsNotEmpty()
  @IsMongoId()
  user_id: string
}
