import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { StatusAlert } from '@edx/paragon';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
// import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import { useModel } from '../../generic/model-store';
import { debug } from 'util';

import { BadgeTabsNavigation } from './badge-header';
import { BadgeProgressBanner } from './badge-progress';

// import { headingMapper } from './utils';


function BadgeProgressTab({ intl }) {
  const activeTabSlug = 'progress';
  
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  // username
  const { 
    administrator,
    username,
    roles
  } = getAuthenticatedUser();

  const hasInstructorStaffRights = () => administrator;

  const [progress, setProgress] = useState([]);
  // const badgeProgressState = useModel('badges-progress', courseId);

  const {
    id,
    ...badgeProgressState
  } = useModel('badge-progress', courseId);

  const hasBadgeProgress = () => progress && progress.length > 0;

  const checkBadgeProgressExists = ( progress ) => {
    let _badgeProgressState = [];

    debugger;
    Object.values(progress).forEach(student => {
      debugger;
      if (typeof student === 'object' && Array.isArray(student.progress)) {
        if (student.progress.length > 0) {
          _badgeProgressState.push(student);
        }
      }
    });

    return _badgeProgressState;
  }

  useEffect(() => {
    let _badgeProgressState = checkBadgeProgressExists(badgeProgressState.value);

    debugger;
    if ( _badgeProgressState.length ) {
      setProgress(_badgeProgressState);
    } else {
       console.log("BadgeProgressTab: Could not find any course badge progress.");    
    }

    // if ( badgeProgressState ) {
    //   let checkBadgeProgressExists = badgeProgressState.some(x => x.progress.length > 0);
    //   debugger;
    //   if ( checkBadgeProgressExists ) {
    //     debugger;
    //     setProgress(badgeProgressState);
    //   }
    // }

    // setProgress(badgeProgressState);

    // let classBadgeProgressExists = 0;
    // let badgeProgressStateUpdated = [];
    
    // if (hasInstructorStaffRights()) {
    //   // Loop through all student's and build new state by removing added course_id from fetchTabData.
    //   debugger;
    //   Object.values(badgeProgressState).forEach(student => {
    //     if (typeof student === 'object' && Array.isArray(student.progress)) {
    //       badgeProgressStateUpdated.push(student);
    //       classBadgeProgressExists += student.progress.length;
    //       debugger;
    //     }
    //   });
    //   debugger;
    //   if (classBadgeProgressExists) {
    //     debugger;
    //     setProgress(badgeProgressStateUpdated);
    //   }
    // } else {
    //   // Loop through all student's and build new state by removing added course_id from fetchTabData.
    //   Object.values(badgeProgressState).forEach(value => {
    //     if (typeof value === 'object' && Array.isArray(value.progress)) {
    //       badgeProgressStateUpdated.push(value);
    //     }
    //   });
    //   setProgress(badgeProgressStateUpdated);
    // }
  }, []); //, courseId, administrator]);

  const renderBadgeProgress = () => {
    const defaultAssignmentFilter = 'All';

    const userRoleNames = roles ? roles.map(role => role.split(':')[0]) : [];

    debugger;

    return (
      <>
        <div className="d-flex flex-column">
          <BadgeTabsNavigation className="mb-3 py-2" activeTabSlug={activeTabSlug} />
          <BadgeProgressBanner hasProgress={(hasBadgeProgress || false)} hasRights={administrator} />
          <div className="container-fluid">
            <section>
              <div className="mb-4">
                the user is {username}
                {administrator
                && <div>the user is admin</div>}
                {roles && <div>{userRoleNames}</div>}
              </div>
            </section>
          </div>
        </div>
      </>    
    );
  };

  const renderNoBadgeProgress = () => (
    <StatusAlert
      dialog={(
        <>
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
          There is no course badge progress to show.
        </>
      )}
      alertType="info"
      dismissible={false}
      open
    />
  );

  return (
    <>
      {hasBadgeProgress() && (
        renderBadgeProgress()
      )}
      {!hasBadgeProgress() && (
        renderNoBadgeProgress()
      )}
    </>
  );
}

BadgeProgressTab.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(BadgeProgressTab);
// export default BadgeProgressTab;

