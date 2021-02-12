import React from 'react';
import { useSelector } from 'react-redux';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { useModel } from '../../generic/model-store';

import CertificateStatus from './certificate-status/CertificateStatus';
import CourseCompletion from './course-completion/CourseCompletion';
import CourseGrade from './grades/CourseGrade';
import DetailedGrades from './grades/detailed-grades/DetailedGrades';
import GradeSummary from './grades/grade-summary/GradeSummary';
import LockedDetailedGrades from './grades/locked-detailed-grades/LockedDetailedGrades';
import ProgressHeader from './ProgressHeader';
import RelatedCards from './related-cards/RelatedCards';

function ProgressTab({ intl }) {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    completionSummary: {
      lockedCount,
    },
  } = useModel('progress', courseId);

  const hasLockedContent = lockedCount > 0;

  return (
    <>
      <ProgressHeader />
      <div className="row w-100 m-0">
        {/* Main body */}
        <div className="col-12 col-lg-8 p-0">
          <CourseCompletion />
          <CourseGrade />
          <GradeSummary />
          {!hasLockedContent && (
            <DetailedGrades />
          )}
          {hasLockedContent && (
            <LockedDetailedGrades />
          )}
        </div>
        {/* Side panel */}
        <div className="col-12 col-lg-4 p-0 px-lg-4">
          <CertificateStatus />
          <RelatedCards />
        </div>
      </div>
    </>
  );
}

ProgressTab.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(ProgressTab);
