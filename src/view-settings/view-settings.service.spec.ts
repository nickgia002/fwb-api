import { Test, TestingModule } from '@nestjs/testing';
import { ViewSettingsService } from './view-settings.service';

describe('ViewSettingsService', () => {
  let service: ViewSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewSettingsService],
    }).compile();

    service = module.get<ViewSettingsService>(ViewSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
