import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { AuthUser } from 'src/decorators/auth-user'
import { Roles } from 'src/decorators/roles'
import Serialize from 'src/decorators/serialize'
import ValidateRoutParams from 'src/decorators/validate-params'
import { AuthenticationGuard } from 'src/guards/authentication.guard'
import { AuthorizationGuard } from 'src/guards/authorization.guard'
import { UserRole } from 'src/types/enums'
import { User } from 'src/users/entities/user.entity'
import { StudentDto } from './dto/student.dto'
import { UpdateStudentDto } from './dto/update-student.dto'
import { StudentsService } from './students.service'

@Controller('students')
@Serialize(StudentDto)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiBearerAuth('jwt')
@ValidateRoutParams()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Roles(UserRole.Director, UserRole.Teacher)
  @ApiOperation({ summary: 'Get all students' })
  findAll() {
    return this.studentsService.findAll({ relations: ['user'] })
  }

  @Get(':student_id')
  @Roles(UserRole.Director, UserRole.Teacher, UserRole.Student)
  @ApiOperation({ summary: 'Get a student by student_id' })
  async findOne(
    @Param('student_id') student_id: string,
    @AuthUser() authUser: User
  ) {
    if (
      authUser.role === UserRole.Student &&
      (!authUser.studentProfile || authUser.studentProfile.id !== student_id)
    )
      throw new UnauthorizedException(
        'You are not allowed to access this resource'
      )

    return this.studentsService.findOne({
      where: { id: student_id },
      relations: ['user']
    })
  }

  @Patch(':student_id')
  @Roles(UserRole.Director)
  @ApiOperation({ summary: 'Update a student by id' })
  async update(
    @Param('student_id') student_id: string,
    @Body() updateStudentDto: UpdateStudentDto
  ) {
    return this.studentsService.update(student_id, updateStudentDto)
  }

  @Delete(':student_id')
  @Roles(UserRole.Director)
  @ApiOperation({ summary: 'Delete a student by id' })
  async remove(@Param('student_id') student_id: string) {
    return this.studentsService.remove(student_id)
  }
}
