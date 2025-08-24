import { Body, Controller, Get, Post } from '@nestjs/common';
import { SalasService } from './salas.service';
import { CreateSalaDto } from './dto/create-sala.dto';

@Controller('salas')
export class SalasController {
    constructor(private readonly salasService: SalasService) {}

    @Post()
    create(@Body() createSalaDto : CreateSalaDto) {
        return this.salasService.create(createSalaDto);
    }

    @Get()
    findAllAtiva() {
        return this.salasService.findAllAtiva();
    }
}
