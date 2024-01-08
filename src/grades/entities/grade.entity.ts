import { Group } from 'src/groups/entities/group.entity'
import { Student } from 'src/students/entities/student.entity'
import { Subject } from 'src/subjects/entities/subject.entity'
import { User } from 'src/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  value: number

  @Column({ type: 'varchar', nullable: true })
  description: string | null

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  receivedDate: string

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  student: Student

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  teacher: User

  @ManyToOne(() => Subject, { onDelete: 'SET NULL' })
  subject: Subject

  @ManyToOne(() => Group, { onDelete: 'SET NULL' })
  group: Group

  @UpdateDateColumn()
  updatedAt: string

  @CreateDateColumn()
  createdAt: string
}
