import { Module } from '@nestjs/common';
import { ExcecoesService } from './excecoes.service';
import { ExcecoesController } from './excecoes.controller';

@Module({
  controllers: [ExcecoesController],
  providers: [ExcecoesService],
})
export class ExcecoesModule {}
