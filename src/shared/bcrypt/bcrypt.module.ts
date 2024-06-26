import { Global, Module } from '@nestjs/common';
import { BcryptService } from 'src/shared/bcrypt/bcrypt.service';

@Global()
@Module({
  providers: [BcryptService],
  exports: [BcryptService],
})
export class BcryptModule {}
