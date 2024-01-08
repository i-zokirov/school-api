import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateGroupDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Group name',
    example: 'Group 1'
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiPropertyOptional({
    type: [String],
    required: false,
    description: 'Students ids',
    example: ['Student ID 1', 'Student ID 2']
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  students: string[]

  @ApiPropertyOptional({
    type: [String],
    required: false,
    description: 'Teachers ids',
    example: ['Teacher ID 1', 'Teacher ID 2']
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  teachers: string[]
}
