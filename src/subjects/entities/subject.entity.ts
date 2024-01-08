import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: String })
  name: string

  @Column({ type: String, default: '', nullable: true })
  description: string

  @Column({ type: String, default: '', nullable: true })
  subjectCode: string

  @UpdateDateColumn()
  updatedAt: string

  @CreateDateColumn()
  createdAt: string
}
