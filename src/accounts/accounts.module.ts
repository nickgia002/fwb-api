import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { EmailModule } from 'src/mailer/email.module';
import { CreateUserMailTemplateStrategy } from 'src/mailer/template/create-user';
import { PasswordCreationMailTemplateStrategy } from 'src/mailer/template/password-creation';
import { UpdateUserMailTemplateStrategy } from 'src/mailer/template/update-user';

@Module({
  imports: [EmailModule],
  providers: [
    AccountsService,
    PasswordCreationMailTemplateStrategy,
    UpdateUserMailTemplateStrategy,
    CreateUserMailTemplateStrategy,
  ],
  exports: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
