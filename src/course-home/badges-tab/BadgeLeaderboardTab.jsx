import React from 'react';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
// import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { useModel } from '../../generic/model-store';

import { BadgeTabsNavigation } from './badge-header';

// {
//   intl
// }
function BadgeLeaderboardTab() {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const { administrator, username } = getAuthenticatedUser();

  const {
    enrollmentMode,
  } = useModel('courses', courseId);

  const activeTabSlug = 'leaderboard';

  return (
    <>
      <main className="d-flex flex-column">
        <BadgeTabsNavigation className="mb-3 py-2" activeTabSlug={activeTabSlug} />
        <div className="container-fluid">
          <section>
            <div className="mb-4">
              the user is {username} and they are enrolled as an {enrollmentMode} learner
              {administrator
              && <div><p>the user is admin</p></div>}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

// BadgeLeaderboardTab.propTypes = {
//   intl: intlShape.isRequired,
// };

// export default injectIntl(BadgeLeaderboardTab);
export default BadgeLeaderboardTab;
