import { AgriNeTTMarketWatcherPage } from './app.po';

describe('agri-ne-ttmarket-watcher App', function() {
  let page: AgriNeTTMarketWatcherPage;

  beforeEach(() => {
    page = new AgriNeTTMarketWatcherPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
