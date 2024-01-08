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

  @Column({ type: Number })
  value: number

  @Column({ type: String, nullable: true })
  description: string | null

  @Column({ type: Date, default: new Date() })
  receivedDate: string

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  student: Student

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  teacher: User

  @ManyToOne(() => Subject, { onDelete: 'SET NULL' })
  subject: Subject

  @UpdateDateColumn()
  updatedAt: string

  @CreateDateColumn()
  createdAt: string
}
