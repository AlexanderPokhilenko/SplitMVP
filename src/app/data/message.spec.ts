import { Message } from './message';

describe('Message', () => {
  it('should create an instance', () => {
    expect(new Message(0, '', 0)).toBeTruthy();
  });
});
