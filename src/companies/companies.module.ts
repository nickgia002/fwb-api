import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';

@Module({
  exports: [CompaniesService],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
