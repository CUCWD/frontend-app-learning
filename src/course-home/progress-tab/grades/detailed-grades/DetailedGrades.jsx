import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { useModel } from '../../../../generic/model-store';

import DetailedGradesTable from './DetailedGradesTable';

import messages from '../messages';

function DetailedGrades({ intl }) {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    sectionScores,
  } = useModel('progress', courseId);

  const outlineLink = (
    <Link
      style={{ textDecoration: 'underline' }}
      to={`/course/${courseId}/home`}
    >
      {intl.formatMessage(messages.courseOutline)}
    </Link>
  );

  return (
    <section className="text-dark-700 my-4">
      <h4>{intl.formatMessage(messages.detailedGrades)}</h4>
      <DetailedGradesTable sectionScores={sectionScores} />
      <FormattedMessage
        id="progress.ungradedAlert"
        defaultMessage="For progress on ungraded aspects of the course, view your {outlineLink}."
        values={{outlineLink}}
      />
    </section>
  );
}

DetailedGrades.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(DetailedGrades);
