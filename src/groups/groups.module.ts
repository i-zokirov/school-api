import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'
import { StudentsModule } from 'src/students/students.module'
import { UsersModule } from 'src/users/users.module'
import { Group } from './entities/group.entity'
import { GroupsController } from './groups.controller'
import { GroupsService } from './groups.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Group]),
    AuthModule,
    UsersModule,
    StudentsModule
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService]
})
export class GroupsModule {}
