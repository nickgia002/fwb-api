import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { USER_ROLE } from 'src/constants/common';
import { ListOrderDto } from './dto/response/orders.dto';
import { OrdersService } from './orders.service';
import { UserJwt } from 'src/auth/auth.interface';
import { RequestUser } from 'src/users/user.decorator';
import { OrdersQueryDto } from './dto/request/orders-query.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @ApiResponse({
    description: 'OrderLists',
    type: ListOrderDto,
    isArray: true,
  })
  @Get()
  @Roles([USER_ROLE.FW, USER_ROLE.STOPPINGPOINT, USER_ROLE.SUBCONTRACTOR])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getOrders(
    @RequestUser() requestUser: UserJwt,
    @Query() query: OrdersQueryDto,
  ): Promise<ListOrderDto> {
    return this.ordersService.getOrders(query, requestUser);
  }
}
