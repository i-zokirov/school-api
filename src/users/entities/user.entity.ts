import * as bcrypt from 'bcryptjs'
import { Student } from 'src/students/entities/student.entity'
import { UserRole } from 'src/types/enums'
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: String })
  firstName: string

  @Column({ type: String })
  lastName: string

  @Column({ unique: true })
  email: string

  @Column({
    type: String,
    enum: [...Object.values(UserRole)],
    default: UserRole.Student
  })
  role: string

  @Column({ type: String })
  password: string

  @OneToOne(() => Student, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  studentProfile: Student | null

  @UpdateDateColumn()
  updatedAt: string

  @CreateDateColumn()
  createdAt: string

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase()
  }

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password)
  }
}
