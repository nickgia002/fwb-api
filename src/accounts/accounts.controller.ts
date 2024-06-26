import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserJwt } from 'src/auth/auth.interface';
import { CreateAccountDto } from 'src/accounts/dto/request/create-account.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { USER_ROLE } from 'src/constants/common';
import { AccountDetailDto } from './dto/response/accounts.dto';
import { AccountsService } from './accounts.service';
import { UpdateAccountDto } from './dto/request/update-account.dto';
import { User } from '@prisma/client';
import { omit } from 'lodash';
import { RequestAccount } from 'src/accounts/account.decorator';
import { ValidationPipe } from './validation.pipe';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) { }

  @ApiResponse({
    description: 'Find a user',
    type: AccountDetailDto,
  })
  @Get(':id')
  @Roles([USER_ROLE.FW, USER_ROLE.STOPPINGPOINT, USER_ROLE.SUBCONTRACTOR])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUser(
    @RequestAccount() requestUser: UserJwt,
    @Param('id', ParseIntPipe) id,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.accountsService.getUserDetail(id, requestUser.roleDiv);

    return omit(user, 'password');
  }

  @Post()
  createUser(
    @RequestAccount() requestUser: UserJwt, 
    @Body(new ValidationPipe()) body: CreateAccountDto,
  ) {
    return this.accountsService.createAccount(body, requestUser);
  }

  @Patch(':id')
  @Roles([USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateUser(
    @RequestAccount() requestUser: UserJwt,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
    @Body(new ValidationPipe()) body: UpdateAccountDto,
  ) {
    return this.accountsService.updateUser(body, id, requestUser);
  }

  // @Patch(':id/password')
  // @Roles([USER_ROLE.FW])
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // deleteUser(
  //   @Param(
  //     'id',
  //     new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
  //   )
  //   id: number,
  // ) {
  //   return this.accountsService.deleteAccount(id);
  // }

  @Patch(':id/password-creation')
  @Roles([USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  passwordCreation(
    @RequestAccount() requestUser: UserJwt,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
  ) {
    return this.accountsService.passwordCreation(id, requestUser);
  }
}
