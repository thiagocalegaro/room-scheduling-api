import { Injectable } from '@nestjs/common';
import { CreateExcecaoDto } from './dto/create-excecao.dto';
import { UpdateExcecaoDto } from './dto/update-excecao.dto';

@Injectable()
export class ExcecoesService {
  create(createExcecaoDto: CreateExcecaoDto) {
    return 'This action adds a new exceptions';
  }

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
}
