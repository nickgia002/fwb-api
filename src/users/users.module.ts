import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailModule } from 'src/mailer/email.module';
import { CreateUserMailTemplateStrategy } from 'src/mailer/template/create-user';
import { PasswordCreationMailTemplateStrategy } from 'src/mailer/template/password-creation';
import { UpdateUserMailTemplateStrategy } from 'src/mailer/template/update-user';

@Module({
  imports: [EmailModule],
  providers: [
    UsersService,
    PasswordCreationMailTemplateStrategy,
    UpdateUserMailTemplateStrategy,
    CreateUserMailTemplateStrategy,
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
