import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmConfigService } from './config/typeorm.config'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';
import { SubjectsModule } from './subjects/subjects.module';
import { GradesModule } from './grades/grades.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    UsersModule,
    AuthModule,
    GroupsModule,
    SubjectsModule,
    GradesModule,
    StudentsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
