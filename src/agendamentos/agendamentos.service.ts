import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, MoreThan, Repository } from 'typeorm';
import { addWeeks } from 'date-fns';
import { Agendamento } from './entities/agendamento.entity';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { CreateAgendamentoRecorrenteDto } from './dto/create-agendamento-recorrente.dto';
import { SalasService } from '../salas/salas.service'; // Importe os serviços
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AgendamentosService {
  // O construtor deve vir primeiro por convenção
  constructor(
    @InjectRepository(Agendamento)
    private agendamentosRepository: Repository<Agendamento>,
    private salasService: SalasService, // Injete os serviços necessários
    private usuariosService: UsuariosService,
    private dataSource: DataSource,
  ) {}
  
  // MÉTODO CREATE PARA AGENDAMENTO ÚNICO (IMPLEMENTADO)
  async create(dto: CreateAgendamentoDto): Promise<Agendamento> {
    const dataAgendamento = new Date(dto.data);
    const isDisponivel = await this.verificarDisponibilidade(
      dto.codigo_sala,
      dataAgendamento,
      dto.hora_inicio,  
      dto.hora_fim,
    );

    if (!isDisponivel) {
      throw new ConflictException(`A sala já está ocupada neste horário.`);
    }

    const sala = await this.salasService.findOne(dto.codigo_sala);
    if (!sala) {
      throw new NotFoundException(`Sala com código ${dto.codigo_sala} não encontrada.`);
    }

    const usuario = await this.usuariosService.findOne(dto.id_usuario);
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${dto.id_usuario} não encontrado.`);
    }

    const novoAgendamento = this.agendamentosRepository.create({
      data: dataAgendamento,
      sala, // Atribui o objeto Sala completo
      usuario, // Atribui o objeto Usuario completo
      hora_inicio: dto.hora_inicio,
      hora_fim: dto.hora_fim,
    });

    return this.agendamentosRepository.save(novoAgendamento);
  }

  // LÓGICA DE VERIFICAÇÃO DE CONFLITO CORRIGIDA
  async verificarDisponibilidade(
    codigo_sala: string,
    data: Date,
    hora_inicio: string,
    hora_fim: string,
  ): Promise<boolean> {
    const conflitos = await this.agendamentosRepository.count({
      where: {
        sala: { codigo: codigo_sala },
        data: data,
        // Verifica se existe algum agendamento que começa ANTES do fim do novo agendamento
        // E que termina DEPOIS do início do novo agendamento.
        // Esta é a forma correta de checar sobreposição de horários.
        hora_inicio: LessThan(hora_fim),
        hora_fim: MoreThan(hora_inicio),
      },
    });
    return conflitos === 0;
  }

  async createRecorrente(dto: CreateAgendamentoRecorrenteDto): Promise<Agendamento[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Busca as entidades relacionadas ANTES do loop
      const sala = await this.salasService.findOne(dto.codigo_sala);
      if (!sala) {
        throw new NotFoundException(`Sala com código ${dto.codigo_sala} não encontrada.`);
      }

      const usuario = await this.usuariosService.findOne(dto.id_usuario);
      if (!usuario) {
        throw new NotFoundException(`Usuário com ID ${dto.id_usuario} não encontrado.`);
      }

      const agendamentosCriados: Agendamento[] = [];
      const dataInicial = new Date(dto.data);

      for (let i = 0; i < dto.numero_de_semanas; i++) {
        const dataDaSemana = addWeeks(dataInicial, i);

        const isDisponivel = await this.verificarDisponibilidade(
          dto.codigo_sala,
          dataDaSemana,
          dto.hora_inicio,
          dto.hora_fim,
        );
        if (!isDisponivel) {
          throw new ConflictException(`A sala já está ocupada na data ${dataDaSemana.toISOString().split('T')[0]}`);
        }

        const novoAgendamento = queryRunner.manager.create(Agendamento, {
          data: dataDaSemana.toISOString().split('T')[0], // Converte para string 'YYYY-MM-DD'
          hora_inicio: dto.hora_inicio,
          hora_fim: dto.hora_fim,
          sala, // Atribui o objeto Sala, não o ID
          usuario, // Atribui o objeto Usuario, não o ID
        });

        const agendamentoSalvo = await queryRunner.manager.save(novoAgendamento);
        agendamentosCriados.push(agendamentoSalvo);
      }

      await queryRunner.commitTransaction();
      return agendamentosCriados;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // Métodos findAll, findOne, remove (ainda como placeholders)
  findAll() {
    return this.agendamentosRepository.find({ relations: ['sala', 'usuario'] });
  }

  findOne(id: number) {
    return this.agendamentosRepository.findOne({ where: { id }, relations: ['sala', 'usuario'] });
  }

  remove(id: number) {
    return this.agendamentosRepository.delete(id);
  }
}
