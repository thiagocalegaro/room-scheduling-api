import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TipoExcecao } from '../enums/tipo-excecao.enum';

export class CreateExcecaoDto {
  @IsDateString({}, { message: 'data_hora_inicio deve ser uma data ISO 8601 válida' })
  @IsNotEmpty()
  inicio: string;

  @IsDateString({}, { message: 'data_hora_fim deve ser uma data ISO 8601 válida' })
  @IsNotEmpty()
  fim: string;

  @IsString()
  @IsNotEmpty()
  motivo: string;

  @IsEnum(TipoExcecao, { message: 'O tipo deve ser BLOQUEIO ou EXTRA' })
  @IsNotEmpty()
  tipo: TipoExcecao;

  @IsString()
  @IsNotEmpty()
  codigo_sala: string;
}