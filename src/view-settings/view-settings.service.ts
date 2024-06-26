import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserJwt } from 'src/auth/auth.interface';
import { PrismaServiceMysql } from 'src/prisma/prisma.service';
import { readDataFromExcel } from 'src/utils/read-file.xlsx';
import { ViewSettingsDto } from './response/view-settings.dto'
import { UserNotFoundException } from 'src/exceptions/user-not-found-exception';
import { makeResponse } from 'src/utils';


@Injectable()
export class ViewSettingsService {

  private logger = new Logger(ViewSettingsService.name);
  constructor(private prismaService: PrismaServiceMysql) { }
  
  getViewSetting(
    viewType: string,
    requestUser: UserJwt
  ) {
    this.logger.log(JSON.stringify(requestUser));
    return this.prismaService.viewSettings.findFirst({
      where: {
        userId: requestUser.userId,
        viewType,
      },
    });
  }

  async saveSetting(
    viewType: string,
    viewSettingsDto: ViewSettingsDto,
    currentUser: UserJwt,
  ) {

    const user = this.prismaService.user.findFirst({
      where: {
        userId: currentUser.userId,
      }
    });
    if (!user) {
      throw new UserNotFoundException(HttpStatus.BAD_REQUEST);
    }

    const setting = await this.prismaService.viewSettings.findFirst({
      where: {
        userId: currentUser.userId,
        viewType,
      }
    })

    await this.prismaService.$transaction(
      async (trx) => {
        const omitFields = [
          'id',
          'userId',
          'password',
          'createdBy',
          'companyId',
          'supplierId',
          'teadingCompanyId'
        ];
        if (setting) {
          const saveSetting = await trx.viewSettings.update({
            where: {
              id: setting.id,
            },
            data: {
              viewSettings: viewSettingsDto.viewSettings,
            },
          });
        } else {
          const saveSetting = await trx.viewSettings.create({
            data: {
              userId: currentUser.userId,
              viewSettings: viewSettingsDto.viewSettings,
              viewType,
            },
            });
        }      
      },
      {
        timeout: 10000,
      },
    );

    return makeResponse(HttpStatus.OK);
  }
}