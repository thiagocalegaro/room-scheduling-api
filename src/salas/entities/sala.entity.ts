// src/rooms/entities/room.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('salas')
export class Sala {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  codigo: string; 

  @Column({ type: 'text', nullable: false })
  tipo: string;

  @Column({ type: 'int', nullable: false})
  capacidade: number;
  
  @Column({ type: 'text', nullable: true })
  bloco: string;

  @Column({ type: 'boolean', default: true, nullable: true })
  isAtiva: boolean;

  @Column({ type: 'text', nullable: true })
  foto_url: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}