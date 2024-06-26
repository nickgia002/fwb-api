import {
  Injectable,
  Logger,
 } from '@nestjs/common';
import { PrismaServiceMssql } from 'src/prisma/prisma.service';
import { PrismaServiceMysql } from 'src/prisma/prisma.service';
import { SelectDto } from './dto/response/selects.dto';
import { UserJwt } from 'src/auth/auth.interface';
import { USER_ROLE } from 'src/constants/common';

@Injectable()
export class SelectsService {
  private logger = new Logger(SelectsService.name);
  constructor(
    private prismaService: PrismaServiceMssql,
    private prismaServiceMysql: PrismaServiceMysql,
  ) { }

  async getKojo(requestUser: UserJwt, companyId: string) {
    let condition = []
    if (requestUser.roleDiv === USER_ROLE.SUBCONTRACTOR) {
      condition = await this.prismaServiceMysql.companyIndexes.findMany(
        {
          select: {
            kojoId: true,
          },
          where: {
            companyId: +requestUser.companyId
          }
        }
      )
    } else if (companyId) {
      condition = await this.prismaServiceMysql.companyIndexes.findMany(
        {
          select: {
            chukeiId: true,
          },
          where: {
            companyId: +companyId
          }
        }
      )
    }
    const data = await this.prismaService.mstKojo.findMany(
      {
        select: {
          KojoId: true,
          KojoName: true,
        },
        where: condition?.length > 0 ? {KojoId: Number(condition)} : {}
      }
    );
    const res: SelectDto[] = data.map((rec) => ({
      value: '' + rec.KojoId,
      label: rec.KojoName,
    }));
    return res;
  }

  async getChukei(requestUser: UserJwt, companyId: string) {
    let condition = []
    if (requestUser.roleDiv === USER_ROLE.STOPPINGPOINT) {
      condition = await this.prismaServiceMysql.companyIndexes.findMany(
        {
          select: {
            chukeiId: true,
          },
          where: {
            companyId: +requestUser.companyId
          }
        }
      )
    } else if (companyId) {
      condition = await this.prismaServiceMysql.companyIndexes.findMany(
        {
          select: {
            chukeiId: true,
          },
          where: {
            companyId: +companyId
          }
        }
      )
    }
    const data = await this.prismaService.mstHaisoChukei.findMany(
      {
        select: {
          HaisoChukeiId: true,
          HaisoChukeiName: true,
        },
        where: condition?.length > 0 ? {HaisoChukeiId: Number(condition)} : {}
      }
    );
    const res: SelectDto[] = data.map((rec) => ({
      value: '' + rec.HaisoChukeiId,
      label: rec.HaisoChukeiName,
    }));
    return res;
  }

  async getTorihiki() {
    const data = await this.prismaService.mstTorihiki.findMany(
      {
        select: {
          TorihikiId: true,
          TorihikiName: true,
        }
      }
    );
    const res: SelectDto[] = data.map((rec) => ({
      value: '' + rec.TorihikiId,
      label: rec.TorihikiName,
    }));
    return res;
  }

}
