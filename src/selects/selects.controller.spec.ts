import { Test, TestingModule } from '@nestjs/testing';
import { SelectsController } from './selects.controller';

describe('SelectsController', () => {
  let controller: SelectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SelectsController],
    }).compile();

    controller = module.get<SelectsController>(SelectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
