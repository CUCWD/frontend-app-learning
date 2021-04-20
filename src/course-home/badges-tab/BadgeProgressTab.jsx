import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
// import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { useModel } from '../../generic/model-store';

import { BadgeTabsNavigation } from './badge-header';
import { BadgeProgressBanner } from './badge-progress';

// {
//   intl
// }
function BadgeProgressTab() {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const { administrator, username } = getAuthenticatedUser();

  const {
    enrollmentMode,
  } = useModel('courses', courseId);

  const [progress, setProgress] = useState([]);
  const badgeProgressState = useModel('badge-progress', courseId);
  useEffect(() => {
    let classProgressExists = 0;
    if (administrator) {
      badgeProgressState.value.forEach(student => {
        if (student.progress.length) {
          classProgressExists += 1;
        }
      });
      if (classProgressExists) {
        setProgress(badgeProgressState.value);
      }
    } else {
      setProgress(badgeProgressState.value);
    }
  }, [courseId, administrator]);

  const activeTabSlug = 'progress';

  return (
    <>
      <div className="d-flex flex-column">
        <BadgeTabsNavigation className="mb-3 py-2" activeTabSlug={activeTabSlug} />
        <BadgeProgressBanner hasProgress={(progress.length > 0 || false)} hasRights={administrator} />
        <div className="container-fluid">
          <section>
            <div className="mb-4">
              the user is {username} and they are enrolled as an {enrollmentMode} learner
              {administrator
              && <div><p>the user is admin</p></div>}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

// BadgeProgressTab.propTypes = {
//   intl: intlShape.isRequired,
// };

// export default injectIntl(BadgeProgressTab);
export default BadgeProgressTab;
