import React from 'react';
import {
  initializeMockApp, initializeTestStore, render, screen,
} from 'setupTest';
import SidebarContext from 'courseware/course/sidebar/SidebarContext';
import OutlineSidebar from 'courseware/course/sidebar/sidebars/outline/OutlineSidebar';

initializeMockApp();

describe('Outline Sidebar', () => {
  let mockData;
  let courseId;
  let unitId;

  beforeEach(async () => {
    const store = await initializeTestStore({
      excludeFetchCourse: false,
      excludeFetchSequence: false,
    });
    const state = store.getState();
    courseId = state.courseware.courseId;
    unitId = '';

    mockData = {
      courseId,
      unitId,
      currentSidebar: 'OUTLINE',
    };
  });

  function renderWithProvider(testData = {}) {
    const { container } = render(
      <SidebarContext.Provider value={{ ...mockData, ...testData }}>
        <OutlineSidebar />
      </SidebarContext.Provider>,
    );
    return container;
  }

  it('should show up if courseId associated with it', async () => {
    renderWithProvider();
    expect(screen.queryByTitle('Outline')).toBeInTheDocument();
    expect(screen.queryByTitle('Outline'))
      .toHaveAttribute('src', `http://localhost:9090/${courseId}/${unitId}?inContext`);
  });
});
