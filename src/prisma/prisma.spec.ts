import { Test, TestingModule } from '@nestjs/testing';
import { PrismaServiceMysql } from './prisma.service';

describe('Prisma', () => {
  let provider: PrismaServiceMysql;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaServiceMysql],
    }).compile();

    provider = module.get<PrismaServiceMysql>(PrismaServiceMysql);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
