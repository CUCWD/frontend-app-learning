import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { Card, } from '@edx/paragon';

import messages from './messages';

function OutlineCard({ intl }) {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  return (
    <Card className="w-100">
      <Card.Body>
        <Card.Title>{intl.formatMessage(messages.outlineCardHeader)}</Card.Title>
        <Card.Text>
          {intl.formatMessage(messages.outlineCardDescription)}
        </Card.Text>
        <Link to={`course/${courseId}/home`} className="btn btn-primary">{intl.formatMessage(messages.outlineCardLink)}</Link>
      </Card.Body>
    </Card>
  );
}

OutlineCard.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(OutlineCard);
