import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('recursos')
export class Recurso {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: false })
    nome: string;
}
