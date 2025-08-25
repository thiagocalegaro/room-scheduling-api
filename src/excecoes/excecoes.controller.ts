import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExcecoesService } from './excecoes.service';
import { CreateExcecaoDto } from './dto/create-excecao.dto';
import { UpdateExcecaoDto } from './dto/update-excecao.dto';

@Controller('excecoes')
export class ExcecoesController {
  constructor(private readonly excecoesService: ExcecoesService) {}

  @Post()
  create(@Body() createExcecaoDto: CreateExcecaoDto) {
    return this.excecoesService.create(createExcecaoDto);
  }

  @Get()
  findAll() {
    return this.excecoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.excecoesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExcecaoDto: UpdateExcecaoDto) {
    return this.excecoesService.update(+id, updateExcecaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.excecoesService.remove(+id);
  }
}
