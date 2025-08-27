import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ExcecoesService } from './excecoes.service';
import { CreateExcecaoDto } from './dto/create-excecao.dto';
import { UpdateExcecaoDto } from './dto/update-excecao.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/usuarios/enums/role.enum';

@Controller('excecoes')
export class ExcecoesController {
  constructor(private readonly excecoesService: ExcecoesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  create(@Body() createExcecaoDto: CreateExcecaoDto) {
    return this.excecoesService.create(createExcecaoDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.excecoesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.excecoesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() updateExcecaoDto: UpdateExcecaoDto) {
    return this.excecoesService.update(+id, updateExcecaoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.excecoesService.remove(+id);
  }
}
