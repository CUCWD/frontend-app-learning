import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { Card, } from '@edx/paragon';

import messages from './messages';

function DatesCard({ intl }) {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  return (
    <Card className="w-100">
      <Card.Body>
        <Card.Title>{intl.formatMessage(messages.datesCardHeader)}</Card.Title>
        <Card.Text>
          {intl.formatMessage(messages.datesCardDescription)}
        </Card.Text>
        <Link to={`course/${courseId}/dates`} className="btn btn-primary">{intl.formatMessage(messages.datesCardLink)}</Link>
      </Card.Body>
    </Card>
  );
}

DatesCard.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(DatesCard);
