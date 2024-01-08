import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min
} from 'class-validator'

export class CreateGradeDto {
  @ApiProperty({
    type: Number,
    example: 5,
    description: 'The value of the grade',
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  value: number

  @ApiPropertyOptional({
    type: String,
    example: 'Very good',
    description: 'The description of the grade',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({
    type: String,
    example: '2021-01-01',
    description: 'The date when the grade was received. Defaults to today',
    required: false
  })
  @IsOptional()
  @IsString()
  receivedDate?: string

  @ApiProperty({
    type: String,
    example: 'subject_id',
    description: 'The id of the subject',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  subject_id: string
}
