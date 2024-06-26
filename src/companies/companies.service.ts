import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { UserJwt } from 'src/auth/auth.interface';
import {
  DEFAULT_LIMIT_FOR_PAGINATION,
  DEFAULT_OFFSET,
  DEFAULT_ORDER_DIRECTION_ASC,
  DEFAULT_ORDER_DIRECTION_DESC,
  USER_ROLE,
} from 'src/constants/common';
import { RoleAndCompanyInforConflictException } from 'src/exceptions/role-and-company-infor-conflict-exception';
//import { CompanyExistingException } from 'src/exceptions/Company-existing.exception';
import { CompanyNotFoundException } from 'src/exceptions/Company-not-found-exception';

import { PrismaServiceMysql } from 'src/prisma/prisma.service';
import { PrismaServiceMssql } from 'src/prisma/prisma.service';

import { BcryptService } from 'src/shared/bcrypt/bcrypt.service';
import { makeResponse, randomString } from 'src/utils';

import { CreateCompanyDto } from './dto/request/create-Company.dto';
import { UpdateCompanyDto } from './dto/request/update-Company.dto';
import { CompaniesQueryDto, AllCompaniesQueryDto } from './dto/request/companies-query.dto';
import { CompanyItemListDto } from './dto/response/companies.dto';
import { COMPANY_ORDER_BY } from './companies.constant';
import { ResponseException } from 'src/shared/exception/common.exception';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly prismaService: PrismaServiceMysql,
    private readonly bcryptService: BcryptService,
  ) {}

  async findByCompanyId(id: number) {
    return this.prismaService.company.findFirst({
      where: {
        id,
      },
    });
  }

  async findByMasterCompanyId(id: number) {
    return this.prismaService.company.findUnique({
      where: {
        id,
      },
    });
  }


  // async checkRoleAndCompanyInfor(roleDiv: USER_ROLE, companyId?: string) {
  //   switch (roleDiv) {
  //     case USER_ROLE.FW:
  //       return !Boolean(companyId);
  //     case USER_ROLE.SUBCONTRACTOR:
  //     case USER_ROLE.STOPPNGPOINT:
  //       if (!companyId) {
  //         return false;
  //       }
  //       // const company = await this.companiesService.findCompanyByCd(companyId);
  //       // return Boolean(company);
  //       return true;
  //   }
  // }

  async getListCompany(searchParams: CompaniesQueryDto, currentUser: UserJwt) {
    // console.log('getListCompany start!');
    // console.table(searchParams);
    // console.table(currentUser);

    // 権限チェック
    if (currentUser.roleDiv !== USER_ROLE.FW) {
      throw new ForbiddenException();
    }

    const where: { [key: string]: any } = {};
    if (searchParams.companyId) {
      where.campanyId = {
        contains: searchParams.companyId,
      };
    }
    if (searchParams.companyName) {
      where.companyName = {
        contains: searchParams.companyName,
      };
    }

    // Logic pagination
    const pagination = {
      take:
        +searchParams.perPage > 0
          ? +searchParams.perPage
          : DEFAULT_LIMIT_FOR_PAGINATION,
      skip: DEFAULT_OFFSET,
      orderBy: undefined,
    };
    if (+searchParams.offset >= 0) {
      pagination.skip = +searchParams.offset * pagination.take;
    }
    const sortDir =
      searchParams.sortDir &&
      [DEFAULT_ORDER_DIRECTION_DESC, DEFAULT_ORDER_DIRECTION_ASC].includes(
        searchParams.sortDir.toLowerCase(),
      )
        ? searchParams.sortDir.toLowerCase()
        : DEFAULT_ORDER_DIRECTION_DESC;
    if (searchParams.sortBy) {
      if (searchParams.sortBy !== COMPANY_ORDER_BY.COMPANY_NAME) {
        pagination.orderBy = {
          [searchParams.sortBy]: sortDir,
        };
      } else {
        pagination.orderBy = {
          company: {
            companyName: sortDir,
          },
        };
      }
    } else {
      pagination.orderBy = {
        [COMPANY_ORDER_BY.CREATED_AT]: sortDir,
      };
    }

    const [total, companies] = await Promise.all([
      this.prismaService.company.count({
        where,
      }),
      this.prismaService.company.findMany({
        where,
        ...pagination,
        include: {
          companyIndexes: {
            select: {
              companyId: true,
            },
          },
        },
      }),
    ]);

    // console.log('getListCompany all');
    // console.table(companies);

    // Format company response
    const formattedCompanies = companies.map((company) => {
      const omitFields = [
        'createdBy',
        'updatedBy',
      ];
      return {
        ...omit(company, omitFields),
        companyDiv: +company.companyDiv,
      } as CompanyItemListDto;
    });

    return {
      items: formattedCompanies,
      total,
      perPage: pagination.take,
      currentPage:
        +searchParams.offset >= 0
          ? +searchParams.offset + 1
          : DEFAULT_OFFSET + 1,
    };
  }

  // コンボ用所属組織リスト 
  async getAllListCompany(searchParams: AllCompaniesQueryDto, currentUser: UserJwt) {
    // console.log('getAllListCompany start!');
    // console.table(searchParams);

    // 権限チェック
    if (currentUser.roleDiv !== USER_ROLE.FW) {
      throw new ForbiddenException();
    }

    // 検索条件
    const where: { [key: string]: any } = {};
    // if (searchParams.authority) {
    //   where.companyDiv = {
    //     contains: searchParams.authority,
    //   };
    // }

    // const [companies] = await Promise.all([
    //     this.prismaService.company.findMany()
    //   ]
    // );
    
    //const companies = await this.prismaService.company.findMany();

      const [companies] = await Promise.all([
        this.prismaService.company.findMany({
          where,
        include: {
          companyIndexes: {
            select: {
              companyId: true,
            },
          },
        },
      }),
    ]);

    // Format company response
    const formattedCompanies = companies.map((company) => {
      const omitFields = [
        'createdBy',
        'updatedBy',
      ];
      return {
        ...omit(company, omitFields),
        companyDiv: +company.companyDiv,
      } as CompanyItemListDto;
    });

    return formattedCompanies;
  }

  // 所属会社新規作成
  async createCompany(company: CreateCompanyDto, currentUser: UserJwt) {
    // 権限チェック
    if (currentUser.roleDiv !== USER_ROLE.FW) {
      throw new ForbiddenException();
    }

    // Check user existing
    // const foundCompany = await this.prismaService.company.findFirst({});
    // if (foundCompany) {
    // } else {
    //   console.log('createCompany BAD_REQUEST');

    //   throw new ResponseException(
    //     HttpStatus.BAD_REQUEST,
    //     'CompanyId already exists',
    //     [],
    //     'COMPANY_ID_EXISTS',
    //   );
    // }

    await this.prismaService.$transaction(
      async (trx) => {
        const createdCompany = await trx.company.create({
          data: {
            companyName: company.companyName,
            companyNameKana: company.companyNameKana || '',
            companyDiv: company.companyDiv.toString(),
          },
        });

        console.table(company);

      },
      {
        timeout: 10000,
      },
    );

    return makeResponse(HttpStatus.OK);
  }

  // 所属会社更新
  async updateCompany(
    updatingCompany: UpdateCompanyDto,
    id: number,
    currentUser: UserJwt,
  ) {
    // console.log('updateCompany start!');
    // console.table(updatingCompany);

    // 権限確認
    if (currentUser.roleDiv !== USER_ROLE.FW) {
      throw new ForbiddenException();
    }

    const company = await this.findByMasterCompanyId(id);
    if (!company) {
      throw new CompanyNotFoundException(HttpStatus.BAD_REQUEST);
    }

    await this.prismaService.$transaction(
      async (trx) => {
        const omitFields = [
          'id',
          'createdBy',
        ];
        const updatedCompany = await trx.company.update({
          where: {
            id,
          },
          data: {
            ...omit(updatingCompany, omitFields),
            companyDiv: updatingCompany.companyDiv.toString(),
            updatedBy: currentUser.id,
          },
        });

      },
      {
        timeout: 10000,
      },
    );

    return makeResponse(HttpStatus.OK);
  }

  async deleteCompany(id: number) {
    const company = await this.findByMasterCompanyId(id);
    if (!company) {
      throw new BadRequestException(
        'The user to be deleted could not be found in the database',
      );
    }
    await this.prismaService.company.delete({
      where: {
        id,
      },
    });
    return makeResponse(HttpStatus.OK);
  }


  async getCompanyDetail(id: number, requestUserRole: number) {
    // console.log('getCompanyDetail start!');
    // console.log('id:' + id);
    // console.table(requestUserRole);

    const Company = await this.findByMasterCompanyId(id);

    // console.table(Company);

    Company.companyDiv = Company.companyDiv.trim();

    if (!Company) {
      throw new NotFoundException();
    }

    if (this.isViolateRoleScope(requestUserRole, +Company.companyDiv)) {
      throw new ForbiddenException();
    }

    const data = {
      ...Company,
    };

    return data;
  }

  isViolateRoleScope(authUserRole: number, targetUserRole: number) {
    if (authUserRole === USER_ROLE.FW) {
      return false;
    }

    return true;
  }
}
