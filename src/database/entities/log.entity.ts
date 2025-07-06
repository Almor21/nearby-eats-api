import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  route: string;

  @Column({ type: 'jsonb', nullable: true })
  body: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  response: Record<string, any>;

  @Column({ nullable: true })
  method: string;

  @Column({ type: 'int', nullable: true })
  statusCode: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
