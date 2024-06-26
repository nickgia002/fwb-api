import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/request/create-Company.dto';
import { USER_ROLE } from 'src/constants/common';
import { isString, isNotEmpty, max } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<CreateCompanyDto> {
  async transform(value: CreateCompanyDto, { metatype }: ArgumentMetadata) {
    if (
      +value.companyDiv === USER_ROLE.SUBCONTRACTOR ||
      +value.companyDiv === USER_ROLE.STOPPINGPOINT
    ) {
      if (!isNotEmpty(value.companyDiv)) {
        throw new BadRequestException('Invalid parameter');
      }
    }

    return value;
  }
}
