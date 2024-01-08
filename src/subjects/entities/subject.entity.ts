import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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
}
