import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { UserJwt } from 'src/auth/auth.interface';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
// import { CompaniesService } from 'src/companies/companies.service';
import {
  DEFAULT_LIMIT_FOR_PAGINATION,
  DEFAULT_OFFSET,
  DEFAULT_ORDER_DIRECTION_ASC,
  DEFAULT_ORDER_DIRECTION_DESC,
  USER_ROLE,
} from 'src/constants/common';
import { RoleAndCompanyInforConflictException } from 'src/exceptions/role-and-company-infor-conflict-exception';
import { UserExistingException } from 'src/exceptions/user-existing.exception';
import { EmailService } from 'src/mailer/email.service';
import { CreateUserMailTemplateStrategy } from 'src/mailer/template/create-user';
import { PrismaServiceMysql } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/shared/bcrypt/bcrypt.service';
import { makeResponse, randomString } from 'src/utils';
import { UsersQueryDto } from './dto/request/users-query.dto';
import { UserItemListDto } from './dto/response/users.dto';
import { USER_ORDER_BY } from './users.constant';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserNotFoundException } from 'src/exceptions/user-not-found-exception';
import { UpdateUserMailTemplateStrategy } from 'src/mailer/template/update-user';
import { PasswordCreationMailTemplateStrategy } from 'src/mailer/template/password-creation';
import { ResponseException } from 'src/shared/exception/common.exception';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaServiceMysql,
    private readonly bcryptService: BcryptService,
    // private readonly companiesService: CompaniesService,
    private readonly emailService: EmailService,
    private readonly passwordCreationMailTemplateStrategy: PasswordCreationMailTemplateStrategy,
    private readonly updateUserMailTemplateStrategy: UpdateUserMailTemplateStrategy,
    private readonly createUserMailTemplateStrategy: CreateUserMailTemplateStrategy,
  ) {}

  async findByUserId(userId: string) {
    return this.prismaService.user.findFirst({
      where: {
        userId,
      },
    });
  }

  async findByMasterUserId(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmailAddress(mailAddress: string) {
    return this.prismaService.user.findFirst({
      where: {
        mailAddress: mailAddress,
      },
    });
  }

  async checkRoleAndCompanyInfor(roleDiv: USER_ROLE, companyId?: string) {
    switch (roleDiv) {
      case USER_ROLE.FW:
        return !Boolean(companyId);
      case USER_ROLE.SUBCONTRACTOR:
      case USER_ROLE.STOPPINGPOINT:
        if (!companyId) {
          return false;
        }
        // const company = await this.companiesService.findCompanyByCd(companyId);
        // return Boolean(company);
        return true;
    }
  }

  async getListUser(searchParams: UsersQueryDto, currentUser: UserJwt) {
    console.log('getListUser start!');
    console.table(searchParams);
    console.table(currentUser);

    if (
      currentUser.roleDiv !== USER_ROLE.FW
    ) {
      throw new ForbiddenException();
    }

    const where: { [key: string]: any } = {};
    if (searchParams.userId) {
      where.userId = {
        contains: searchParams.userId,
      };
    }
    if (searchParams.username) {
      where.username = {
        contains: searchParams.username,
      };
    }
    if (searchParams.mailAddress) {
      where.mailAddress = {
        contains: searchParams.mailAddress,
      };
    }

    if (searchParams.tel) {
      where.tel = {
        contains: searchParams.tel,
      };
    }

    if (searchParams.companyName) {
      where.OR = [
        {
          company: {
            companyName: {
              contains: searchParams.companyName,
            },
          },
        },
        {
          supplier: {
            supplierName: {
              contains: searchParams.companyName,
            },
          },
        },
        {
          tradingCompany: {
            tradingCompanyName: {
              contains: searchParams.companyName,
            },
          },
        },
      ];
    }
    if (searchParams.roleDiv) {
      where.roleDiv = searchParams.roleDiv;
    } else if (currentUser.roleDiv === USER_ROLE.FW) {
      where.roleDiv = {
        in: [
          USER_ROLE.FW.toString(),
          USER_ROLE.SUBCONTRACTOR.toString(),
          USER_ROLE.STOPPINGPOINT.toString(),
        ],
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
      if (searchParams.sortBy !== USER_ORDER_BY.COMPANY_NAME) {
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
        [USER_ORDER_BY.CREATED_AT]: sortDir,
      };
    }

    const [total, users] = await Promise.all([
      this.prismaService.user.count({
        where,
      }),
      this.prismaService.user.findMany({
        where,
        ...pagination,
        include: {
          company: {
            select: {
              companyName: true,
            },
          },
        },
      }),
    ]);

    // Format users response
    const formattedUsers = users.map((user) => {
      const omitFields = [
        'password',
        'company',
        'createdBy',
        'updatedBy',
        'companyCd',
      ];
      return {
        ...omit(user, omitFields),
        roleDiv: +user.roleDiv,
        companyName: user.company?.companyName,
      } as UserItemListDto;
    });

    return {
      items: formattedUsers,
      total,
      perPage: pagination.take,
      currentPage:
        +searchParams.offset >= 0
          ? +searchParams.offset + 1
          : DEFAULT_OFFSET + 1,
    };
  }

  // 新規ユーザー登録
  async createUser(user: CreateUserDto, currentUser: UserJwt) {
    // 権限チェック
    if (currentUser.roleDiv !== USER_ROLE.FW) {
      throw new ForbiddenException();
    }

    const findUserOrCondition: (
      | {
          mailAddress: string;
        }
      | {
          userId: string;
        }
    )[] = [{ userId: user.userId }];

    if (user.mailAddress) {
      findUserOrCondition.push({ mailAddress: user.mailAddress });
    }

    // Check user existing
    const foundUser = await this.prismaService.user.findFirst({
      where: {
        OR: findUserOrCondition,
      },
    });
    if (foundUser) {
      if (user.mailAddress == foundUser.mailAddress) {
        throw new ResponseException(
          HttpStatus.BAD_REQUEST,
          'Mail address already exists',
          [],
          'MAIL_ADDRESS_EXISTS',
        );
      } else {
        throw new ResponseException(
          HttpStatus.BAD_REQUEST,
          'UserId already exists',
          [],
          'USER_ID_EXISTS',
        );
      }
    }

    // Check company existing
    const isValidRoleAndCompanyInfor = await this.checkRoleAndCompanyInfor(
      user.roleDiv,
      user.companyId?.toString(),
    );
    if (!isValidRoleAndCompanyInfor) {
      throw new RoleAndCompanyInforConflictException();
    }

    // Create user and send mail
    const hashedPassword = await this.bcryptService.hashPassword(user.password);
    await this.prismaService.$transaction(
      async (trx) => {
        const createdUser = await trx.user.create({
          data: {
            userId: user.userId,
            username: user.username,
            usernameKana: user.usernameKana || '',
            roleDiv: user.roleDiv.toString(),
            companyId: user.companyId ? +user.companyId : null,
            tel: user.tel,
            mailAddress: user.mailAddress ? user.mailAddress : null,
            password: hashedPassword,
            createdBy: currentUser.id,
            updatedBy: currentUser.id,
          },
        });

        // メール送信
        // if (user.mailAddress) {
        //   await this.emailService.sendMail(
        //     this.createUserMailTemplateStrategy.buildTemplate(
        //       createdUser,
        //       user.password,
        //     ),
        //   );
        // }
      },
      {
        timeout: 10000,
      },
    );

    return makeResponse(HttpStatus.OK);
  }

  async updateUser(
    updatingUser: UpdateUserDto,
    id: number,
    currentUser: UserJwt,
  ) {

    if (currentUser.roleDiv !== USER_ROLE.FW) {
      throw new ForbiddenException();
    }

    const user = await this.findByMasterUserId(id);
    if (!user) {
      throw new UserNotFoundException(HttpStatus.BAD_REQUEST);
    }

    if (updatingUser.mailAddress) {
      const foundUser = await this.findByEmailAddress(updatingUser.mailAddress);
      if (foundUser && foundUser.id !== id) {
        throw new UserExistingException();
      }
    }

    const roleDiv = updatingUser.roleDiv ? updatingUser.roleDiv : +user.roleDiv;

    await this.prismaService.$transaction(
      async (trx) => {
        const omitFields = [
          'id',
          'userId',
          'password',
          'createdBy',
          'companyId',
        ];
        let companyId = user.companyId;
        if ([USER_ROLE.FW].includes(roleDiv)) {
          companyId = null;
        }
        const updatedUser = await trx.user.update({
          where: {
            id,
          },
          data: {
            ...omit(updatingUser, omitFields),
            mailAddress:
              updatingUser.mailAddress !== '' ? updatingUser.mailAddress : null,
            roleDiv: roleDiv.toString(),
            companyId: companyId,
            updatedBy: currentUser.id,
          },
        });

        // メールが更新されてら、確認メールを送信
        // if (updatingUser.mailAddress) {
        //   await this.emailService.sendMail(
        //     this.updateUserMailTemplateStrategy.buildTemplate(updatedUser),
        //   );
        // }
      },
      {
        timeout: 10000,
      },
    );

    return makeResponse(HttpStatus.OK);
  }

  async deleteUser(id: number) {
    const user = await this.findByMasterUserId(id);
    if (!user) {
      throw new BadRequestException(
        'The user to be deleted could not be found in the database',
      );
    }
    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
    return makeResponse(HttpStatus.OK);
  }

  async passwordCreation(id: number, currentUser: UserJwt) {
    const user = await this.findByMasterUserId(id);
    if (!user) {
      throw new UserNotFoundException(HttpStatus.BAD_REQUEST);
    }

    if (
      +user.roleDiv !== USER_ROLE.FW
    ) {
      throw new ForbiddenException();
    }

    const newPassword = randomString(10);
    const hashPassword = await this.bcryptService.hashPassword(newPassword);
    await this.prismaService.$transaction(async (trx) => {
      await trx.user.update({
        where: {
          id,
        },
        data: {
          password: hashPassword,
        },
      });

      await this.emailService.sendMail(
        this.passwordCreationMailTemplateStrategy.buildTemplate(
          user,
          newPassword,
        ),
      );
    });

    return makeResponse(HttpStatus.OK);
  }

  async getUserDetail(id: number, requestUserRole: number) {
    const user = await this.findByMasterUserId(id);

    user.roleDiv = user.roleDiv.trim();

    if (!user) {
      throw new NotFoundException();
    }

    if (this.isViolateRoleScope(requestUserRole, +user.roleDiv)) {
      throw new ForbiddenException();
    }

    const data = {
      ...user,
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
