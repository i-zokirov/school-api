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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthUser } from 'src/decorators/auth-user'
import { Roles } from 'src/decorators/roles'
import Serialize from 'src/decorators/serialize'
import { GroupsService } from 'src/groups/groups.service'
import { AuthenticationGuard } from 'src/guards/authentication.guard'
import { AuthorizationGuard } from 'src/guards/authorization.guard'
import { StudentsService } from 'src/students/students.service'
import { SubjectsService } from 'src/subjects/subjects.service'
import { UserRole } from 'src/types/enums'
import { User } from 'src/users/entities/user.entity'
import { CreateGradeDto } from './dto/create-grade.dto'
import { GradeDto } from './dto/grade.dto'
import { Grade } from './entities/grade.entity'
import { GradesService } from './grades.service'

@Controller()
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiBearerAuth('jwt')
@ApiTags('Grades')
export class GradesController {
  constructor(
    private readonly gradesService: GradesService,
    private readonly studentsService: StudentsService,
    private readonly subjectsService: SubjectsService,
    private readonly groupsService: GroupsService
  ) {}

  @Post('students/:student_id/grades')
  @Roles(UserRole.Teacher)
  @Serialize(GradeDto)
  @ApiOperation({
    summary: 'Create a grade',
    description:
      'Only users with a teacher role are allowed to create grades and only for students who share a group with them'
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
      where: { id: student_id },
      relations: ['group']
    })

    if (!student) throw new NotFoundException('Student not found')

    if (!student.group) {
      throw new NotFoundException('Student is not in a group')
    }

    const group = await this.groupsService.findOne({
      where: { id: student.group.id },
      relations: ['teachers', 'subjects']
    })

    if (!group) throw new NotFoundException('Group not found')

    const teacher = group.teachers.find((t) => t.id === authUser.id)

    if (!teacher) {
      throw new UnauthorizedException(
        'You are not allowed to create grades for this student. Reason: You are not in the same group as this student.'
      )
    }

    const subject = await this.subjectsService.findOne({
      where: { id: subject_id }
    })

    if (!subject) throw new NotFoundException('Subject not found')

    if (!group.subjects.some((s) => s.id === subject.id)) {
      throw new UnauthorizedException(
        'You are not allowed to create grades for this student from this subject. Reason: This subject is not in the same group as this student'
      )
    }

    dto.student = student
    dto.subject = subject
    dto.teacher = authUser
    dto.group = group

    return this.gradesService.create(dto)
  }

  @Get('students/:student_id/grades')
  @Roles(UserRole.Teacher, UserRole.Director, UserRole.Student)
  @Serialize(GradeDto)
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
      relations: ['student', 'subject', 'teacher', 'group'],
      order: {
        receivedDate: 'DESC'
      }
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
  @Serialize(GradeDto)
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
      relations: ['student', 'subject', 'teacher', 'group'],
      order: {
        receivedDate: 'DESC'
      }
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

  @Get('groups/:group_id/grades')
  @Roles(UserRole.Teacher, UserRole.Director)
  @Serialize(GradeDto)
  @ApiOperation({ summary: 'Get all grades for a group' })
  findAllForGroup(@Param('group_id') group_id: string) {
    return this.gradesService.findAll({
      where: {
        group: {
          id: group_id
        }
      },
      relations: ['student', 'subject', 'teacher', 'group'],
      order: {
        receivedDate: 'DESC'
      }
    })
  }

  @Get('groups/:group_id/grades/average')
  @Roles(UserRole.Teacher, UserRole.Director)
  @ApiOperation({ summary: 'Get the average grade for a group' })
  findAverageForGroup(@Param('group_id') group_id: string) {
    return this.gradesService.findGroupAverageGrade(group_id)
  }

  @Get('groups/:group_id/grades/subjects/average')
  @Roles(UserRole.Teacher, UserRole.Director)
  @ApiOperation({
    summary: 'Get the average grade for a group for all subjects seperately'
  })
  findAverageForSubjectsForGroup(@Param('group_id') group_id: string) {
    return this.gradesService.findGroupAverageGradesForAllSubjects(group_id)
  }

  @Get('groups/:group_id/grades/subjects/:subject_id')
  @Roles(UserRole.Teacher, UserRole.Director)
  @Serialize(GradeDto)
  @ApiOperation({ summary: 'Get all grades for a group for a subject' })
  findBySubjectIdForGroup(
    @Param('group_id') group_id: string,
    @Param('subject_id') subject_id: string
  ) {
    return this.gradesService.findAll({
      where: {
        group: {
          id: group_id
        },
        subject: {
          id: subject_id
        }
      },
      relations: ['student', 'subject', 'teacher', 'group'],
      order: {
        receivedDate: 'DESC'
      }
    })
  }
}
