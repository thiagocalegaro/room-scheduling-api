import { Module } from '@nestjs/common';
import { SalasController } from './salas.controller';
import { SalasService } from './salas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sala } from './entities/sala.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sala])], 
  controllers: [SalasController],
  providers: [SalasService]
})
export class SalasModule {}
