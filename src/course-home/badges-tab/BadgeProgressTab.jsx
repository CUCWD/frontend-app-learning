import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { StatusAlert } from '@edx/paragon';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import { useModel } from '../../generic/model-store';
import { debug } from 'util';

import { BadgeTabsNavigation } from './badge-header';
import { BadgeProgressBanner, BadgeProgressCard, BadgeProgressCourseList } from './badge-progress';

import { headingMapper } from './utils';


function BadgeProgressTab({ intl }) {
  const activeTabSlug = 'progress';
  
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const { 
    administrator,
    username,
    roles
  } = getAuthenticatedUser();

  const hasInstructorStaffRights = () => administrator;

  const [progress, setProgress] = useState([]);

  const {
    id,
    ...badgeProgressState
  } = useModel('badge-progress', courseId);

  const hasBadgeProgress = () => progress && progress.length > 0;
  useEffect(() => {
    let classProgressExists = 0;
    if (hasInstructorStaffRights()) {
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

const renderBadgeProgress = () => {
    const defaultAssignmentFilter = 'All';

    if (hasInstructorStaffRights()) {
      return (
        <>
          <BadgeTabsNavigation className="mb-3 py-2" activeTabSlug={activeTabSlug} />
          <BadgeProgressBanner
            hasProgress={hasBadgeProgress()}
            hasRights={hasInstructorStaffRights()}
          />
          <BadgeProgressCourseList
            data={progress}
            headings={headingMapper(defaultAssignmentFilter, progress)(progress[0])}
          />
        </>
      );
    }

    return (
      <>
        <div className="d-flex flex-column">
          <BadgeTabsNavigation className="mb-3 py-2" activeTabSlug={activeTabSlug} />
          <BadgeProgressBanner hasProgress={hasBadgeProgress()} hasRights={hasInstructorStaffRights()} />
          <div className="container-fluid">
            <section className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                {progress && (
                  <div className="row equal-col-height">
                    {progress.map(learnerProgress => (
                      <BadgeProgressCard key={learnerProgress.blockId} data={learnerProgress} />
                    ))}
                  </div>
                )}
              </div>
            </section>
            {/* <section>
              <div className="mb-4">
                the user is {username} and they are enrolled as an {enrollmentMode} learner
                {administrator
                && <div><p>the user is admin</p></div>}
              </div>
            </section> */}
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
