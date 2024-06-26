import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserJwt } from 'src/auth/auth.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { USER_ROLE } from 'src/constants/common';
import { ListCompanyDto, CompanyDetailDto, CompanyItemListDto } from './dto/response/companies.dto';
import { CompaniesService } from './companies.service';
import { CompaniesQueryDto } from './dto/request/companies-query.dto';
import { CreateCompanyDto } from './dto/request/create-company.dto';
import { UpdateCompanyDto } from './dto/request/update-company.dto';
import { Company } from '@prisma/client';
import { omit } from 'lodash';
import { RequestUser } from 'src/users/user.decorator';
import { ValidationPipe } from './validation.pipe';


@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) { }

  // 所属会社リスト取得
  @ApiResponse({
    description: 'List companies',
    type: ListCompanyDto,
  })
  @Get()
  @Roles([USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getCompanies(
    @RequestUser() requestUser: UserJwt,
    @Query() query: CompaniesQueryDto,
  ): Promise<ListCompanyDto> {
    return this.companiesService.getListCompany(query, requestUser);
  }

  // 所属会社リスト取得
  @ApiResponse({
    description: 'All List companies',
    type: ListCompanyDto,
  })
  @Get('/all')
  @Roles([USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAllCompanies(
    @RequestUser() requestUser: UserJwt,
    @Query() query: CompaniesQueryDto,
  ): Promise<CompanyItemListDto[]> {
    return this.companiesService.getAllListCompany(query, requestUser);
  }

  // 所属会社詳細
  @ApiResponse({
    description: 'Find a company',
    type: CompanyDetailDto,
  })
  @Get(':id')
  @Roles([USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getCompany(
    @RequestUser() requestUser: UserJwt,
    @Param('id', ParseIntPipe) id,
  ): Promise<Company> {
    const company = await this.companiesService.getCompanyDetail(id, requestUser.roleDiv);

    return company;
  }

  // 所属会社　新規登録
  @Post()
  @Roles([USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  createCompany(
    @RequestUser() requestUser: UserJwt, 
    @Body(new ValidationPipe()) body: CreateCompanyDto,
  ) {
    return this.companiesService.createCompany(body, requestUser);
  }

  // 所属会社　更新
  @Patch(':id')
  @Roles([USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateCompany(
    @RequestUser() requestUser: UserJwt,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
    @Body(new ValidationPipe()) body: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCompany(body, id, requestUser);
  }

  // 所属会社　削除
  @Delete(':id')
  @Roles([USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteUser(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
  ) {
    return this.companiesService.deleteCompany(id);
  }

}
