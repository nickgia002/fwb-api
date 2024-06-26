import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from 'src/config/index';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BcryptModule } from 'src/shared/bcrypt/bcrypt.module';
import { EmailModule } from 'src/mailer/email.module';
import { RolesModule } from 'src/roles/roles.module';
import { NewsModule } from 'src/news/news.module';
import { DivValuesModule } from 'src/div-values/div-values.module';
import { SelectsModule } from './selects/selects.module';
import { AccountsModule } from './accounts/accounts.module';
import { ViewSettingsModule } from './view-settings/view-settings.module';
import { CompaniesModule } from './companies/companies.module';
import { OrdersModule } from './orders/orders.module'

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    BcryptModule,
    EmailModule,
    RolesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    NewsModule,
    DivValuesModule,
    SelectsModule,
    AccountsModule,
    ViewSettingsModule,
    CompaniesModule,
    OrdersModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
