import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateSubjectDto {
  @ApiProperty({
    description: 'The name of the subject',
    example: 'Math',
    required: true,
    type: String
  })
  name: string

  @ApiPropertyOptional({
    description: 'The description of the subject',
    example: 'Mathematics',
    required: false,
    type: String
  })
  description?: string
}
