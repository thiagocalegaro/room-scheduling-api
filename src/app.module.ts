import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsModule } from './rooms/rooms.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [RoomsModule, ItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
