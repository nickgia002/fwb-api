import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { UserJwt } from 'src/auth/auth.interface';
import { CreateAccountDto } from 'src/accounts/dto/request/create-account.dto';
import {
  DEFAULT_LIMIT_FOR_PAGINATION,
  DEFAULT_OFFSET,
  DEFAULT_ORDER_DIRECTION_ASC,
  DEFAULT_ORDER_DIRECTION_DESC,
  USER_ROLE,
} from 'src/constants/common';
import { UserExistingException } from 'src/exceptions/user-existing.exception';
import { EmailService } from 'src/mailer/email.service';
import { PrismaServiceMysql } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/shared/bcrypt/bcrypt.service';
import { makeResponse, randomString } from 'src/utils';
import { AccountsQueryDto } from './dto/request/accounts-query.dto';
import { AccountItemListDto } from './dto/response/accounts.dto';
import { ACCOUNT_ORDER_BY } from './accounts.constant';
import { UpdateAccountDto } from './dto/request/update-account.dto';
import { UserNotFoundException } from 'src/exceptions/user-not-found-exception';
import { CreateUserMailTemplateStrategy } from 'src/mailer/template/create-user';
import { UpdateUserMailTemplateStrategy } from 'src/mailer/template/update-user';
import { PasswordCreationMailTemplateStrategy } from 'src/mailer/template/password-creation';
import { ResponseException } from 'src/shared/exception/common.exception';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);
  constructor(
    private readonly prismaService: PrismaServiceMysql,
    private readonly bcryptService: BcryptService,
    private readonly emailService: EmailService,
    private readonly passwordCreationMailTemplateStrategy: PasswordCreationMailTemplateStrategy,
    private readonly updateUserMailTemplateStrategy: UpdateUserMailTemplateStrategy,
    private readonly createUserMailTemplateStrategy: CreateUserMailTemplateStrategy,
  ) {}

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

  async getUserDetail(id: number, requestUserRole: number) {
    const user = await this.findByMasterUserId(id);
    this.logger.log(JSON.stringify(user))
    user.roleDiv = user.roleDiv.trim();

    if (!user) {
      throw new NotFoundException();
    }

    if (id !== user.id) {
      throw new ForbiddenException();
    }

    const data = {
      ...user,
    };

    return data;
  }

  async createAccount(account: CreateAccountDto, currentUser: UserJwt) {

    const findUserOrCondition: (
      | {
          mailAddress: string;
        }
      | {
          userId: string;
        }
    )[] = [{ userId: account.userId }];

    if (account.mailAddress) {
      findUserOrCondition.push({ mailAddress: account.mailAddress });
    }

    // Check user existing
    const foundUser = await this.prismaService.user.findFirst({
      where: {
        OR: findUserOrCondition,
      },
    });
    if (foundUser) {
      if (account.mailAddress == foundUser.mailAddress) {
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

    // Create user and send mail
    const hashedPassword = await this.bcryptService.hashPassword(account.password);
    await this.prismaService.$transaction(
      async (trx) => {
        const createdAccount = await trx.user.create({
          data: {
            userId: account.userId,
            username: account.username,
            usernameKana: account.usernameKana || '',
            password: hashedPassword,
            roleDiv: account.roleDiv.toString(),
            createdBy:currentUser.id,
            mailAddress: account.mailAddress ? account.mailAddress : null,
            updatedBy:currentUser.id
          },
        });

        if (account.mailAddress) {
          await this.emailService.sendMail(
            this.createUserMailTemplateStrategy.buildTemplate(
              createdAccount,
              account.password,
            ),
          
            );
        }
      
      },
      {
        timeout: 10000,
      },
    );

    return makeResponse(HttpStatus.OK);
  }

  async updateUser(
    updatingUser: UpdateAccountDto,
    id: number,
    currentUser: UserJwt,
  ) {
    if (
      currentUser.roleDiv !== USER_ROLE.FW
    ) {
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

    let hashPassword: string | null = null;
    if (updatingUser.newpassword) {
      if (updatingUser.newpassword.trim() === '') {
        throw new BadRequestException('新しいパスワードは空にできません。');
      } else {
        hashPassword = await this.bcryptService.hashPassword(updatingUser.newpassword);
      }
    }

    const roleDiv = updatingUser.roleDiv ? updatingUser.roleDiv : +user.roleDiv;
    //const hashPassword = await this.bcryptService.hashPassword(updatingUser.newpassword);
    
    await this.prismaService.$transaction(
      async (trx) => {
        const omitFields = [
          'id',
          'userId',
          'password',
          'newpassword',
          'createdBy',
        ];
        const updatedUserData: any = {
          ...omit(updatingUser, omitFields),
          mailAddress: updatingUser.mailAddress !== '' ? updatingUser.mailAddress : null,
          roleDiv: roleDiv.toString(),
          updatedBy: currentUser.id,
        };
  
        
        if (hashPassword) {
          updatedUserData.password = hashPassword;
        }
  
        
        const updatedUser = await trx.user.update({
          where: {
            id,
          },
          data: updatedUserData,
        });
        // const updatedUser = await trx.user.update({
        //   where: {
        //     id,
        //   },
        //   data: {
        //     ...omit(updatingUser, omitFields),
        //     mailAddress:
        //       updatingUser.mailAddress !== '' ? updatingUser.mailAddress : null,
        //     roleDiv: roleDiv.toString(),
        //     updatedBy: currentUser.id,
        //     password: hashPassword,
        //   },
        // });

        if (updatingUser.mailAddress) {
          await this.emailService.sendMail(
            this.updateUserMailTemplateStrategy.buildTemplate(updatedUser),
          );
        }
      },
      {
        timeout: 10000,
      },
    );

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

}
