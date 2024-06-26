import { Test, TestingModule } from '@nestjs/testing';
import { ViewSettingsController } from './view-settings.controller';

describe('ViewSettingsController', () => {
  let controller: ViewSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViewSettingsController],
    }).compile();

    controller = module.get<ViewSettingsController>(ViewSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
