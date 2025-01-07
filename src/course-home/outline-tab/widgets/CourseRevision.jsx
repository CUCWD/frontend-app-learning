import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from '../messages';
import { useModel } from '../../../generic/model-store';

function CourseRevision({ courseId, intl }) {
  const {
    courseRevision,
  } = useModel('outline', courseId);

  if (!courseRevision) {
    return null;
  }

  return (
    <section className="mb-4">
      <h2 className="h4">{intl.formatMessage(messages.revision)}</h2>
      <span>{courseRevision}</span>
    </section>
  );
}

CourseRevision.propTypes = {
  courseId: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(CourseRevision);
