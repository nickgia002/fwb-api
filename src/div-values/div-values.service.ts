import { Injectable } from '@nestjs/common';
import { PrismaServiceMysql } from 'src/prisma/prisma.service';
import { readDataFromExcel } from 'src/utils/read-file.xlsx';

@Injectable()
export class DivValuesService {
  constructor(private prismaService: PrismaServiceMysql) { }
  getDivValuesByDivCd(divCd: string) {
    return this.prismaService.divValues.findMany({
      where: {
        divCd,
      },
      select: {
        divValue: true,
        divValueName: true,
      },
    });
  }
}