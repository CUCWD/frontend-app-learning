// TODO Need to complete these tests.

import React from 'react';
import { Route } from 'react-router';
import MockAdapter from 'axios-mock-adapter';
import { Factory } from 'rosie';
import { getConfig, history } from '@edx/frontend-platform';
// import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { AppProvider } from '@edx/frontend-platform/react';
// import { waitForElementToBeRemoved } from '@testing-library/dom';
import { render, screen, within } from '@testing-library/react'; // eslint-disable-line no-unused-vars
// import userEvent from '@testing-library/user-event';

import BadgeProgressTab from './BadgeProgressTab';
import { fetchBadgeProgressTab } from '../data';
import { fireEvent, initializeMockApp, waitFor } from '../../setupTest'; // eslint-disable-line no-unused-vars
import initializeStore from '../../store';
import { TabContainer } from '../../tab-page';
import { appendBrowserTimezoneToUrl } from '../../utils';
import { UserMessagesProvider } from '../../generic/user-messages';

initializeMockApp();
jest.mock('@edx/frontend-platform/analytics');

describe('BadgeProgressTab', () => {
  let axiosMock;
  let store;
  let component;

  beforeEach(() => {
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    store = initializeStore();
    component = (
      <AppProvider store={store}>
        <UserMessagesProvider>
          <Route path="/course/:courseId/badges/progress">
            <TabContainer tab="badge-progress" fetch={fetchBadgeProgressTab} slice="courseHome">
              <BadgeProgressTab />
            </TabContainer>
          </Route>
        </UserMessagesProvider>
      </AppProvider>
    );
  });

  const badgeProgressTabData = Factory.build('badgeProgressTabData');
  let courseMetadata = Factory.build('courseHomeMetadata', { user_timezone: 'America/New_York' });
  const { id: courseId } = courseMetadata;

  const badgeProgressUrl = `${getConfig().LMS_BASE_URL}/api/badges/v1/progress/${courseId}`;
  let courseMetadataUrl = `${getConfig().LMS_BASE_URL}/api/course_home/course_metadata/${courseId}`;
  courseMetadataUrl = appendBrowserTimezoneToUrl(courseMetadataUrl);

  function setMetadata(attributes, options) { // eslint-disable-line no-unused-vars
    courseMetadata = Factory.build('courseHomeMetadata', { id: courseId, ...attributes }, options);
    axiosMock.onGet(courseMetadataUrl).reply(200, courseMetadata);
  }

  describe('when receiving a full set of dates data', () => {
    beforeEach(() => {
      axiosMock.onGet(courseMetadataUrl).reply(200, courseMetadata);
      axiosMock.onGet(badgeProgressUrl).reply(200, badgeProgressTabData);
      history.push(`/course/${courseId}/badges/progress`); // so tab can pull course id from url

      render(component);
    });

    it('handles unreleased & complete', async () => {
      // const { header } = await getDay('Sun, May 3, 2020');
      // const badges = within(header).getAllByTestId('dates-badge');
      // expect(badges).toHaveLength(2);
      // expect(badges[0]).toHaveTextContent('Completed');
      // expect(badges[1]).toHaveTextContent('Not yet released');
    });
  });
});
