import { Test, TestingModule } from '@nestjs/testing';
import { WechartService } from './wechart.service';

describe('WechartService', () => {
  let service: WechartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WechartService],
    }).compile();

    service = module.get<WechartService>(WechartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
