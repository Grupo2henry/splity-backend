import { GroupLimitGuard } from './group-limit.guard';

describe('GroupLimitGuard', () => {
  it('should be defined', () => {
    expect(new GroupLimitGuard()).toBeDefined();
  });
});
