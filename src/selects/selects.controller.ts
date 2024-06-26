import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { USER_ROLE } from 'src/constants/common';
import { SelectDto } from './dto/response/selects.dto';
import { SelectsService } from './selects.service';
import { UserJwt } from 'src/auth/auth.interface';
import { RequestUser } from 'src/users/user.decorator';

@ApiTags('selects')
@Controller('selects')
export class SelectsController {
  constructor(private selectsService: SelectsService) {}

  @ApiResponse({
    description: 'Get kojo',
    type: SelectDto,
    isArray: true,
  })
  @Get('kojo/:companyId')
  @Roles([USER_ROLE.FW, USER_ROLE.STOPPINGPOINT, USER_ROLE.SUBCONTRACTOR])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getKojo(
    @RequestUser() requestUser: UserJwt,
    @Param('companyId') companyId: string,
  ): Promise<SelectDto[]> {
    return this.selectsService.getKojo(requestUser, companyId);
  }

  @ApiResponse({
    description: 'Get chukei',
    type: SelectDto,
    isArray: true,
  })
  @Get('chukei/:companyId')
  @Roles([USER_ROLE.FW, USER_ROLE.STOPPINGPOINT, USER_ROLE.SUBCONTRACTOR])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getChukei(
    @RequestUser() requestUser: UserJwt,
    @Param('companyId') companyId: string,
  ): Promise<SelectDto[]> {
    return this.selectsService.getChukei(requestUser, companyId);
  }

  @ApiResponse({
    description: 'Get torihiki',
    type: SelectDto,
    isArray: true,
  })
  @Get('torihiki')
  @Roles([USER_ROLE.FW, USER_ROLE.STOPPINGPOINT, USER_ROLE.SUBCONTRACTOR])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getTorihiki(
    @RequestUser() requestUser: UserJwt,
  ): Promise<SelectDto[]> {
    return this.selectsService.getTorihiki();
  }

}
