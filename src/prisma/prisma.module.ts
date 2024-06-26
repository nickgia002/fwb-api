import { Global, Module } from '@nestjs/common';
import { PrismaServiceMysql } from './prisma.service';
import { PrismaServiceMssql } from './prisma.service';

@Global()
@Module({
  providers: [PrismaServiceMysql, PrismaServiceMssql],
  exports: [PrismaServiceMysql, PrismaServiceMssql],
})
export class PrismaModule {}
