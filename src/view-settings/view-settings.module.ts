import { Module } from '@nestjs/common';
import { ViewSettingsService } from './view-settings.service';
import { ViewSettingsController } from './view-settings.controller';

@Module({
  providers: [ViewSettingsService],
  controllers: [ViewSettingsController],
  exports: [ViewSettingsService]
})
export class ViewSettingsModule { }
