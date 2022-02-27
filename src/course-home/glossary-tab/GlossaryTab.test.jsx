import {
  initializeMockApp,
} from '../../setupTest';

initializeMockApp();
jest.mock('@edx/frontend-platform/analytics');

describe('Glossary Tab', () => {
  it('has a title', async () => {
    expect(screen.getByText('Glossary')).toBeInTheDocument();
  });
});
