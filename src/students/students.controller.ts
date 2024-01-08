import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import Serialize from 'src/decorators/serialize'
import { AuthenticationGuard } from 'src/guards/authentication.guard'
import { CreateStudentDto } from './dto/create-student.dto'
import { StudentDto } from './dto/student.dto'
import { UpdateStudentDto } from './dto/update-student.dto'
import { StudentsService } from './students.service'

@Controller('students')
@Serialize(StudentDto)
@UseGuards(AuthenticationGuard)
@ApiBearerAuth('jwt')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto)
  }

  @Get()
  findAll() {
    return this.studentsService.findAll({ relations: ['user'] })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne({ where: { id } })
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id)
  }
}
