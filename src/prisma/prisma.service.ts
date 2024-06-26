import { Injectable,  Logger, OnModuleInit } from '@nestjs/common';
import { Prisma as PrismaMysql, PrismaClient as PrismaClientMysql } from '.prisma/generated/mysql';
import { Prisma as PrismaMssql, PrismaClient as PrismaClientMssql } from '.prisma/generated/mssql';

@Injectable()
export class PrismaServiceMysql 
extends PrismaClientMysql<PrismaMysql.PrismaClientOptions, PrismaMysql.LogLevel>
implements OnModuleInit {
  // private readonly logger = new Logger(PrismaServiceMysql.name);
  // constructor() {
  //   super({ log: ['query', 'info', 'warn', 'error'] });
  // }
  async onModuleInit() {
    // this.$on('query', (event) => {
    //   this.logger.log(
    //     `Query: ${event.query}`,
    //     `Params: ${event.params}`,
    //     `Duration: ${event.duration} ms`,
    //   );
    // });
    // this.$on('info', (event) => {
    //   this.logger.log(`message: ${event.message}`);
    // });
    // this.$on('error', (event) => {
    //   this.logger.log(`error: ${event.message}`);
    // });
    // this.$on('warn', (event) => {
    //   this.logger.log(`warn: ${event.message}`);
    // });
    await this.$connect();
  }
}

export class PrismaServiceMssql 
extends PrismaClientMssql<PrismaMssql.PrismaClientOptions, PrismaMssql.LogLevel>
implements OnModuleInit {
  // private readonly logger = new Logger(PrismaServiceMssql.name);
  // constructor() {
  //   super({ log: ['query', 'info', 'warn', 'error'] });
  // }
  async onModuleInit() {
    // this.$on('query', (event) => {
    //   this.logger.log(
    //     `Query: ${event.query}`,
    //     `Params: ${event.params}`,
    //     `Duration: ${event.duration} ms`,
    //   );
    // });
    // this.$on('info', (event) => {
    //   this.logger.log(`message: ${event.message}`);
    // });
    // this.$on('error', (event) => {
    //   this.logger.log(`error: ${event.message}`);
    // });
    // this.$on('warn', (event) => {
    //   this.logger.log(`warn: ${event.message}`);
    // });
    await this.$connect();
  }
}