import { Injectable } from '@nestjs/common';
import { CreateExcecaoDto } from './dto/create-excecao.dto';
import { UpdateExcecaoDto } from './dto/update-excecao.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Excecao } from './entities/excecoes.entity';
import { SalasService } from '../salas/salas.service';
import { EscopoExcecao } from './dto/create-excecao.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { ExcluirExcecaoGlobalDto } from './dto/delete-excecao-global.dto';

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
      inicio: dto.inicio,
      fim: dto.fim,
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const excecoesCriadas: Excecao[] = [];

    try {
        for (const sala of salasDoBloco) {
            const novaExcecao = this.excecoesRepository.create({
                inicio: dto.inicio,
                fim: dto.fim,
                motivo: dto.motivo,
                tipo: dto.tipo,
                sala: sala, 
            });

            const excecaoSalva = await queryRunner.manager.save(novaExcecao);
            excecoesCriadas.push(excecaoSalva);
        }

        await queryRunner.commitTransaction();
        return excecoesCriadas;

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException('Falha ao criar exceções para o bloco.', error);
    } finally {
        await queryRunner.release();
    }
  }
  
  private async criarParaTodas(dto: CreateExcecaoDto): Promise<Excecao[]> {
    const todasAsSalas = await this.salasService.findAll();
    if (todasAsSalas.length === 0) {
      throw new NotFoundException('Nenhuma sala encontrada no sistema.');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const excecoesCriadas: Excecao[] = [];

    try {
        for (const sala of todasAsSalas) {
            const novaExcecao = this.excecoesRepository.create({
                inicio: dto.inicio,
                fim: dto.fim,
                motivo: dto.motivo,
                tipo: dto.tipo,
                sala: sala, 
            });

            const excecaoSalva = await queryRunner.manager.save(novaExcecao);
            excecoesCriadas.push(excecaoSalva);
        }

        await queryRunner.commitTransaction();
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException('Falha ao criar exceções para o bloco.', error);
    } finally {
        await queryRunner.release();
    }

    return excecoesCriadas;
  }

  private async excluirExcecao(id: number): Promise<void> {
    const resultado = await this.excecoesRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Exceção com ID ${id} não encontrada.`);
    }
  }

  async excluirEmLote(dto: ExcluirExcecaoGlobalDto): Promise<DeleteResult> {
  const inicioDate = new Date(dto.inicio);
  const fimDate = new Date(dto.fim);

  const resultado = await this.excecoesRepository.delete({
    motivo: dto.motivo,
    inicio: inicioDate,
    fim: fimDate,
  });

  if (resultado.affected === 0) {
    throw new NotFoundException(`Nenhuma exceção correspondente encontrada para exclusão.`);
  }
  
  return resultado;
}
}
