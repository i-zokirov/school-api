import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'
import { GroupsModule } from 'src/groups/groups.module'
import { StudentsModule } from 'src/students/students.module'
import { SubjectsModule } from 'src/subjects/subjects.module'
import { UsersModule } from 'src/users/users.module'
import { Grade } from './entities/grade.entity'
import { GradesController } from './grades.controller'
import { GradesService } from './grades.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Grade]),
    AuthModule,
    UsersModule,
    StudentsModule,
    SubjectsModule,
    GroupsModule
  ],
  controllers: [GradesController],
  providers: [GradesService],
  exports: [GradesService]
})
export class GradesModule {}
