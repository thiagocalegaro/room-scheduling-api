import { Injectable } from '@nestjs/common';
import { CreateExcecaoDto } from './dto/create-excecao.dto';
import { UpdateExcecaoDto } from './dto/update-excecao.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Excecao } from './entities/excecoes.entity';
import { SalasService } from '../salas/salas.service';
import { EscopoExcecao } from './dto/create-excecao.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class ExcecoesService {
  
  findAll() {
    return `This action returns all exceptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exception`;
  }

  update(id: number, updateExcecaoDto: UpdateExcecaoDto) {
    return `This action updates a #${id} exception`;
  }

  remove(id: number) {
    return `This action removes a #${id} exception`;
  }

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Excecao)
    private excecoesRepository: Repository<Excecao>,
    private salasService: SalasService, 
  ) {}

  async create(dto: CreateExcecaoDto): Promise<Excecao | Excecao[]> {
    switch (dto.escopo) {
      case EscopoExcecao.SALA_UNICA:
        return this.criarParaSalaUnica(dto);

      case EscopoExcecao.BLOCO:
        return this.criarParaBloco(dto);

      case EscopoExcecao.TODAS:
        return this.criarParaTodas(dto);

      default:
        throw new BadRequestException('Escopo da exceção inválido.');
    }
  }

  private async criarParaSalaUnica(dto: CreateExcecaoDto): Promise<Excecao> {
    if (!dto.codigo_sala) {
      throw new BadRequestException('O campo "codigo_sala" é obrigatório para este escopo.');
    }
    const sala = await this.salasService.findOne(dto.codigo_sala);
    if (!sala) {
      throw new NotFoundException(`Sala com código ${dto.codigo_sala} não encontrada.`);
    }

    const novaExcecao = this.excecoesRepository.create({
      inicio: new Date(dto.inicio),
      fim: new Date(dto.fim),
      motivo: dto.motivo,
      tipo: dto.tipo,
      sala: sala,
    });
    return this.excecoesRepository.save(novaExcecao);
  }

  private async criarParaBloco(dto: CreateExcecaoDto): Promise<Excecao[]> {
    if (!dto.bloco) {
      throw new BadRequestException('O campo "bloco" é obrigatório para este escopo.');
    }
    const salasDoBloco = await this.salasService.findByBloco(dto.bloco);
    if (salasDoBloco.length === 0) {
      throw new NotFoundException(`Nenhuma sala encontrada para o bloco ${dto.bloco}.`);
    }
    
    // A lógica de transação aqui é crucial para garantir que a exceção
    // seja aplicada a TODAS as salas do bloco, ou a nenhuma.
    // (O esqueleto da transação é o mesmo do createRecorrente)
    const excecoesCriadas: Excecao[] = [];
    for (const sala of salasDoBloco) {
      // cria e salva uma exceção para cada sala...
    }
    return excecoesCriadas;
  }
  
  private async criarParaTodas(dto: CreateExcecaoDto): Promise<Excecao[]> {
    const todasAsSalas = await this.salasService.findAll();
    const excecoesCriadas: Excecao[] = [];
    return excecoesCriadas;
  }
}
