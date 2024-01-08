import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateSubjectDto {
  @ApiProperty({
    description: 'The name of the subject',
    example: 'Math',
    required: true,
    type: String
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiPropertyOptional({
    description: 'The description of the subject',
    example: 'Mathematics',
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  description?: string
}
