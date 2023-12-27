import { Test, TestingModule } from '@nestjs/testing';
import { WechartController } from './wechart.controller';

describe('WechartController', () => {
  let controller: WechartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WechartController],
    }).compile();

    controller = module.get<WechartController>(WechartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
