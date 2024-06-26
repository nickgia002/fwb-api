import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ViewSettingsService } from './view-settings.service';
import { ViewSettingsDto } from './response/view-settings.dto';
import { UserJwt } from 'src/auth/auth.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { USER_ROLE } from 'src/constants/common';
import { RequestUser } from 'src/users/user.decorator';

@ApiTags('view-settings')
@Controller('view-settings')
export class ViewSettingsController {
  constructor(private viewSettingsService: ViewSettingsService) {}
  @ApiResponse({
    description: 'get view setting',
    type: ViewSettingsDto,
    isArray: true,
  })
  @Get(':viewType')
  @Roles([USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getViewSetting(
    @Param('viewType') viewType: string,
    @RequestUser() requestUser: UserJwt,
  ) {
    return this.viewSettingsService.getViewSetting(viewType, requestUser);
  }

  @Post(':viewType')
  @Roles([USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  createUser(
    @Param('viewType') viewType: string,
    @RequestUser() requestUser: UserJwt, 
    @Body() body: ViewSettingsDto,
  ) {
    return this.viewSettingsService.saveSetting(viewType, body, requestUser);
  }


}
