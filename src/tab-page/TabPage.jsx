import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
// import { useSelector } from 'react-redux';

// import { Header } from '../course-header';
import { useLogistrationAlert } from '../logistration-alert';
import PageLoading from '../PageLoading';

import messages from './messages';
import messagesBadgeProgress from '../course-home/badges-tab/messages';
import LoadedTabPage from './LoadedTabPage';

function TabPage({
  intl,
  courseStatus,
  ...passthroughProps
}) {
  useLogistrationAlert();

  // const courseStatus = useSelector(state => state.courseware.courseStatus);

  if (courseStatus === 'loading') {
    let notificationMessage;
    switch (passthroughProps.activeTabSlug) {
      case 'badge-progress':
      case 'badge-leaderboard':
        notificationMessage = messagesBadgeProgress['badge.progress.loading'];
        break;
      default:
        notificationMessage = messages['learn.loading'];
    }

    // <Header />
    return (
      <>
        <PageLoading
          srMessage={intl.formatMessage(notificationMessage)}
        />
      </>
    );
  }

  if (courseStatus === 'loaded') {
    return (
      <LoadedTabPage {...passthroughProps} />
    );
  }

  let notificationMessage;
  switch (passthroughProps.activeTabSlug) {
    case 'badge-progress':
    case 'badge-leaderboard':
      notificationMessage = messagesBadgeProgress['badge.progress.loading.failure'];
      break;
    default:
      notificationMessage = messages['learn.loading.failure'];
  }

  // courseStatus 'failed' and any other unexpected course status.
  return (
    <>
      <p className="text-center py-5 mx-auto" style={{ maxWidth: '30em' }}>
        {intl.formatMessage(notificationMessage)}
      </p>
    </>
  );
}

TabPage.propTypes = {
  intl: intlShape.isRequired,
  courseStatus: PropTypes.string.isRequired,
};

export default injectIntl(TabPage);
