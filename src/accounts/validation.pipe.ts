import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/request/create-account.dto';
import { USER_ROLE } from 'src/constants/common';
import { isString, isNotEmpty, max } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<CreateAccountDto> {
  async transform(value: CreateAccountDto, { metatype }: ArgumentMetadata) {
    if (+value.roleDiv === USER_ROLE.FW) {
      const email = value.mailAddress;
      const isValid =
        isString(email) && isNotEmpty(email) && max(email.length, 256);

      if (!isValid) {
        throw new BadRequestException('Invalid parameter');
      }
    }

    return value;
  }
}
