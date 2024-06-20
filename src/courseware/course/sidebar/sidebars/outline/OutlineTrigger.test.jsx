import React from 'react';
import {
  fireEvent, initializeMockApp, initializeTestStore, render, screen,
} from 'setupTest';
import SidebarContext from 'courseware/course/sidebar/SidebarContext';
import OutlineTrigger from 'courseware/course/sidebar/sidebars/outline/OutlineTrigger';

initializeMockApp();

describe('Outline Trigger', () => {
  let mockData;
  let courseId;

  beforeEach(async () => {
    const store = await initializeTestStore({
      excludeFetchCourse: false,
      excludeFetchSequence: false,
    });
    const state = store.getState();
    courseId = state.courseware.courseId;

    mockData = {
      courseId,
    };
  });

  function renderWithProvider(testData = {}, onClick = () => null) {
    const { container } = render(
      <SidebarContext.Provider value={{ ...mockData, ...testData }}>
        <OutlineTrigger onClick={onClick} />
      </SidebarContext.Provider>,
    );
    return container;
  }

  it('shows up and handles onClick', async () => {
    const clickTrigger = jest.fn();
    renderWithProvider({}, clickTrigger);

    const notificationTrigger = await screen.findByRole('button', { name: /Show outline sidebar/i });
    expect(notificationTrigger).toBeInTheDocument();
    fireEvent.click(notificationTrigger);
    expect(clickTrigger).toHaveBeenCalledTimes(1);
  });
});
