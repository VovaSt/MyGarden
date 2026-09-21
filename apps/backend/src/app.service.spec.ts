import { AppService } from './app.service';

describe('AppService', () => {
  it('reports that the API is healthy', () => {
    expect(new AppService().health()).toEqual({ status: 'ok' });
  });
});
