import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DivValuesService } from './div-values/div-values.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private divValuesService: DivValuesService
  ) { }
  getHello(): string {
    return 'Hello World!';
  }
  async onApplicationBootstrap(): Promise<any> {
    try {
      
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }
}
