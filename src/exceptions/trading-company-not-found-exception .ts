import { HttpException, HttpStatus } from '@nestjs/common';

export class TradingCompanyNotFoundException extends HttpException {
  constructor(status: HttpStatus) {
    super(
      {
        message: 'TradingCompany not found',
        errorCode: 'TRADING_COMPANY_NOT_FOUND',
        status: status || HttpStatus.NOT_FOUND,
      },
      status || HttpStatus.NOT_FOUND,
    );
  }
}
