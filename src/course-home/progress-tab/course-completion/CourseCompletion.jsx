import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useModel } from '../../../generic/model-store';

function CourseCompletion({ intl }) {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    completionSummary: {
      completeCount,
      incompleteCount,
      lockedCount,
    },
  } = useModel('progress', courseId);

  const total = completeCount + incompleteCount + lockedCount;
  const completePercentage = ((completeCount / total) * 100).toFixed(0);
  const incompletePercentage = ((incompleteCount / total) * 100).toFixed(0);
  const lockedPercentage = ((lockedCount / total) * 100).toFixed(0);

  return (
    <section className="text-dark-700 my-4">
      <h3>Course completion</h3>
      <p>This represents how much course content you have completed.</p>
      Complete: {completePercentage}%
      Incomplete: {incompletePercentage}%
      Locked: {lockedPercentage}%
    </section>
  );
}

CourseCompletion.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CourseCompletion);
