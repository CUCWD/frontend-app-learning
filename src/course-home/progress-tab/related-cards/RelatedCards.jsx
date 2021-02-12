import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { CardGrid } from '@edx/paragon';

import messages from './messages';
import DatesCard from './DatesCard';
import OutlineCard from './OutlineCard';

function RelatedCards({ intl }) {
  return (
    <section className="my-4">
      <h4>{intl.formatMessage(messages.relatedLinks)}</h4>
      <CardGrid
        columnSizes={{
          xs: 12,
          md: 6,
          lg: 12,
        }}
      >
        <DatesCard />
        <OutlineCard />
      </CardGrid>
    </section>
  );
}

RelatedCards.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(RelatedCards);
