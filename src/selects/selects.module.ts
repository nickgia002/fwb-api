import { Module } from '@nestjs/common';
import { SelectsService } from './selects.service';
import { SelectsController } from './selects.controller';

@Module({
  providers: [SelectsService],
  exports: [SelectsService],
  controllers: [SelectsController],
})
export class SelectsModule {}
