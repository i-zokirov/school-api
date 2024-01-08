import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger'
import { AuthUser } from 'src/decorators/auth-user'
import { Roles } from 'src/decorators/roles'
import { AuthenticationGuard } from 'src/guards/authentication.guard'
import { AuthorizationGuard } from 'src/guards/authorization.guard'
import { StudentsService } from 'src/students/students.service'
import { SubjectsService } from 'src/subjects/subjects.service'
import { UserRole } from 'src/types/enums'
import { User } from 'src/users/entities/user.entity'
import { CreateGradeDto } from './dto/create-grade.dto'
import { Grade } from './entities/grade.entity'
import { GradesService } from './grades.service'

@Controller()
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiBearerAuth()
export class GradesController {
  constructor(
    private readonly gradesService: GradesService,
    private readonly studentsService: StudentsService,
    private readonly subjectsService: SubjectsService
  ) {}

  @Post('students/:student_id/grades')
  @Roles(UserRole.Teacher)
  @ApiOperation({
    summary: 'Create a grade',
    description: 'Only users with a teacher role are allowed to create grades'
  })
  @ApiBody({ type: CreateGradeDto })
  async create(
    @Body() createGradeDto: CreateGradeDto,
    @Param('student_id') student_id: string,
    @AuthUser() authUser: User
  ) {
    const { subject_id, ...rest } = createGradeDto

    const dto: Partial<Grade> = {
      ...rest
    }

    const student = await this.studentsService.findOne({
      where: { id: student_id }
    })

    if (!student) throw new NotFoundException('Student not found')

    const subject = await this.subjectsService.findOne({
      where: { id: subject_id }
    })

    if (!subject) throw new NotFoundException('Subject not found')

    dto.student = student
    dto.subject = subject
    dto.teacher = authUser

    return this.gradesService.create(dto)
  }

  @Get('students/:student_id/grades')
  @Roles(UserRole.Teacher, UserRole.Director, UserRole.Student)
  @ApiOperation({ summary: 'Get all grades for a student' })
  findAll(@Param('student_id') student_id: string, @AuthUser() authUser: User) {
    if (authUser.role === UserRole.Student && authUser.id !== student_id)
      throw new UnauthorizedException(
        'You are not allowed to view this resource'
      )
    return this.gradesService.findAll({
      where: {
        student: {
          id: student_id
        }
      },
      relations: ['student', 'subject', 'teacher']
    })
  }

  @Get('students/:student_id/grades/average')
  @Roles(UserRole.Teacher, UserRole.Director, UserRole.Student)
  @ApiOperation({ summary: 'Get the average grade for a student' })
  findAverage(
    @Param('student_id') student_id: string,
    @AuthUser() authUser: User
  ) {
    if (authUser.role === UserRole.Student && authUser.id !== student_id)
      throw new UnauthorizedException(
        'You are not allowed to view this resource'
      )
    return this.gradesService.findStudentAverageGrade(student_id)
  }

  @Get('students/:student_id/grades/subjects/average')
  @Roles(UserRole.Teacher, UserRole.Director, UserRole.Student)
  @ApiOperation({
    summary: 'Get the average grade for a student for all subjects seperately'
  })
  findAverageForSubjects(
    @Param('student_id') student_id: string,
    @AuthUser() authUser: User
  ) {
    if (authUser.role === UserRole.Student && authUser.id !== student_id)
      throw new UnauthorizedException(
        'You are not allowed to view this resource'
      )
    return this.gradesService.findStudentAverageGradesForAllSubjects(student_id)
  }

  @Get('students/:student_id/grades/subjects/:subject_id')
  @Roles(UserRole.Teacher, UserRole.Director, UserRole.Student)
  @ApiOperation({ summary: 'Get all grades for a student for a subject' })
  findBySubjectId(
    @Param('student_id') student_id: string,
    @Param('subject_id') subject_id: string,
    @AuthUser() authUser: User
  ) {
    if (authUser.role === UserRole.Student && authUser.id !== student_id)
      throw new UnauthorizedException(
        'You are not allowed to view this resource'
      )
    return this.gradesService.findAll({
      where: {
        student: {
          id: student_id
        },
        subject: {
          id: subject_id
        }
      },
      relations: ['student', 'subject', 'teacher']
    })
  }

  @Get('students/:student_id/grades/subjects/:subject_id/average')
  @Roles(UserRole.Teacher, UserRole.Director, UserRole.Student)
  @ApiOperation({
    summary: 'Get the average grade for a student for a subject'
  })
  findAverageBySubjectId(
    @Param('student_id') student_id: string,
    @Param('subject_id') subject_id: string,
    @AuthUser() authUser: User
  ) {
    if (authUser.role === UserRole.Student && authUser.id !== student_id)
      throw new UnauthorizedException(
        'You are not allowed to view this resource'
      )
    return this.gradesService.findStudentAverageGradeForASubject(
      student_id,
      subject_id
    )
  }
}
