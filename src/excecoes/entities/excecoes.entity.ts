import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,

} from 'typeorm';
import { Sala } from '../../salas/entities/sala.entity';
import { TipoExcecao } from '../enums/tipo-excecao.enum';
@Entity('excecoes')
export class Excecao {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Sala, (sala) => sala.excecoes)
    @JoinColumn({ name: 'codigo_sala' })
    sala: Sala;

    @Column({ type: 'timestamp', nullable: false })
    inicio: string;

    @Column({ type: 'timestamp', nullable: false })
    fim: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    sala_codigo: string;

    @Column({ type: 'enum', enum: TipoExcecao, nullable: false })
    tipo: TipoExcecao;

    @Column({ type: 'varchar', length: 100, nullable: false })
    motivo: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
