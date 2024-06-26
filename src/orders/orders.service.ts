import {
  Injectable,
  Logger,
 } from '@nestjs/common';
import { PrismaServiceMssql } from 'src/prisma/prisma.service';
import { PrismaServiceMysql } from 'src/prisma/prisma.service';
import { OrdersQueryDto } from './dto/request/orders-query.dto';
import { UserJwt } from 'src/auth/auth.interface';
import { OrderDto } from './dto/response/orders.dto';
import { ORDER_LIMIT_FOR_PAGENATION } from 'src/constants/common';
import {
  DEFAULT_OFFSET,
  DEFAULT_ORDER_DIRECTION_ASC,
  DEFAULT_ORDER_DIRECTION_DESC,
  USER_ROLE,
} from 'src/constants/common';
import { ORDER_ORDER_BY } from './orders.constant';


@Injectable()
export class OrdersService {
  private logger = new Logger(OrdersService.name);
  constructor(
    private prismaService: PrismaServiceMssql,
    private prismaServiceMysql: PrismaServiceMysql,
  ) { }

  async getOrders(
    query: OrdersQueryDto,
    currUser: UserJwt
  ) {
    this.logger.log(`query: ${JSON.stringify(query)}`);
    const where: { [key: string]: any } = {};
    if (query.company) {
    }
    if (query.stoppingPoint && query.stoppingPoint.length > 0) {
      where.ChukeiId = {
        in: query.stoppingPoint,
      }
    }
    if (query.factory && query.factory.length > 0) {
      where.OR = [
        {
          KozoKojoId: {
            in: query.factory,
          },
        },
        {
          HagaraKojoId: {
            in: query.factory,
          },
        },
        {
          IDSGohanKojoId: {
            in: query.factory,
          },
        },
        {
          LVLNobuchiKojoId: {
            in: query.factory,
          },
        },
      ]
    }
    if (query.propertyNo) {
      where.BukenNo = {
        contains: query.propertyNo,
      }
    }
    if (query.constructionNo) {
      where.KoujiNo = {
        contains: query.constructionNo,
      }
    }

    const pagination = {
      take:
        +query.perPage > 0
          ? +query.perPage
          : ORDER_LIMIT_FOR_PAGENATION,
      skip: DEFAULT_OFFSET,
      orderBy: undefined,
    };
    if (+query.offset >= 0) {
      pagination.skip = +query.offset * pagination.take;
    }
    const sortDir =
      query.sortDir &&
      [DEFAULT_ORDER_DIRECTION_DESC, DEFAULT_ORDER_DIRECTION_ASC].includes(
        query.sortDir.toLowerCase(),
      )
        ? query.sortDir.toLowerCase()
        : DEFAULT_ORDER_DIRECTION_DESC;
        if (query.sortBy) {
          if (ORDER_ORDER_BY[query.sortBy]) {
            pagination.orderBy = {
              [ORDER_ORDER_BY[query.sortBy]]: sortDir,
            };
          }
        } else {
          pagination.orderBy = {
            [ORDER_ORDER_BY['propertyNo']]: sortDir,
          };
        }
    
    const [total, datas] = await Promise.all([
      this.prismaService.viewShukaGembaHanyuPublication.count({
        where,
      }),
      this.prismaService.viewShukaGembaHanyuPublication.findMany({
        where,
        ...pagination,
      }),
    ]);

    const formattedOrders: OrderDto[] = datas.map(rec =>{
      return {
        ...rec,
        propertyNo: rec.BukenNo,
        constructionNo: rec.KoujiNo,
        siteMap: rec.SharedLink,
        siteName: rec.GembaName,
        buildingNo: rec.Goutou,
        numOfBuildings: String(rec.Tousu),
        structure: String(rec.Kouzo),
        tsubos: String(rec.NobeyukaMenseki1),
        builder: rec.TorihikiName,
        constructionCompany: rec.KoujitenName,
        directorName: rec.KantokuName,
        telephoneNumber: rec.KantokuTel,
        approveDate: rec.KakoShoninHenkyakuDate,
        planned1fStructure: rec.KozoYotei,
        vehicle: rec.HanyuSharyoName,
        wrecker: rec.JotoBinWreckerName,
        supervisoryInstructions: rec.Biko,
        confirm: rec.IsKakutei,
        hagaraFactory: rec.HagaraKojoNameRyaku,
        hagaraShipmentDate: rec.HagaraShukaDate,
        hagaraStoppingPointArriveAt: rec.HagaraChukeiDate,
        structureFactory: rec.KozoKojoNameRyaku,
        structureShipmentDate: rec.KouzoShukaDate,
        structureStoppingPointArriveAt: rec.KouzoChukeiDate,
        subcontractor: rec.SozaiGaichuNameRyaku,
        subcontractorShipmentDate: rec.SozaiTumikomiDate,
        subcontractorStoppingPointArriveAt: rec.SozaiTumiorosiDate,
        idsPlant: rec.IDSGohanKojoNameRyaku,
        lvlPlant: rec.LVLNobuchiKojoNameRyaku,
        installationDate1: rec.Bin1Date,
        time1: rec.Bin1Time,
        itemsDelivered1: rec.Bin1HanyuButu,
        featherPattern1: rec.Bin1IsHagara,
        installationDate2: rec.Bin2Date,
        time2: rec.Bin2Time,
        itemsDelivered2: rec.Bin2HanyuButu,
        featherPattern2: rec.Bin2IsHagara,
        installationDate3: rec.Bin3Date,
        time3: rec.Bin3Time,
        itemsDelivered3: rec.Bin3HanyuButu,
        featherPattern3: rec.Bin3IsHagara,
        installationDate4: rec.Bin4Date,
        time4: rec.Bin4Time,
        itemsDelivered4: rec.Bin4HanyuButu,
        featherPattern4: rec.Bin4IsHagara,
        installationDate5: rec.Bin5Date,
        time5: rec.Bin5Time,
        itemsDelivered5: rec.Bin5HanyuButu,
        featherPattern5: rec.Bin5IsHagara,
        installationDate6: rec.Bin6Date,
        time6: rec.Bin6Time,
        itemsDelivered6: rec.Bin6HanyuButu,
        featherPattern6: rec.Bin6IsHagara,
      }
    });

    return {
      items: formattedOrders,
      total,
      perPage: pagination.take,
      currentPage:
        +query.offset >= 0
          ? +query.offset + 1
          : DEFAULT_OFFSET + 1,
    };
  }

}
