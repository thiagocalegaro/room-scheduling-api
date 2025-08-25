import { PartialType } from '@nestjs/mapped-types';
import { CreateExcecaoDto } from './create-excecao.dto';

export class UpdateExcecaoDto extends PartialType(CreateExcecaoDto) {}
