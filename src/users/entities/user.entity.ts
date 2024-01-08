import * as bcrypt from 'bcryptjs'
import { Group } from 'src/groups/entities/group.entity'
import { Student } from 'src/students/entities/student.entity'
import { UserRole } from 'src/types/enums'
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  firstName: string

  @Column({ type: 'varchar' })
  lastName: string

  @Index()
  @Column({ unique: true })
  email: string

  @Index()
  @Column({
    type: 'varchar',
    enum: [...Object.values(UserRole)],
    default: UserRole.Student
  })
  role: string

  @Column({ type: 'varchar' })
  password: string

  @OneToOne(() => Student, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  studentProfile: Student | null

  @ManyToMany(() => Group, (group) => group.teachers, {
    onDelete: 'CASCADE'
  })
  groups: Group[]

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
    if (this.password) {
      this.password = await bcrypt.hash(this.password, salt)
    }
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password)
  }
}
