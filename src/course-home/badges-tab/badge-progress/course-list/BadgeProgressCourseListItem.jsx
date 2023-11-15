import React from 'react';
import PropTypes from 'prop-types';
import BadgeProgressCard from '../card/BadgeProgressCard';

const BadgeProgressCourseListItem = ({ badge }) => (
  <BadgeProgressCard key={badge.blockId} data={badge} minimal="minimal" />
);

BadgeProgressCourseListItem.propTypes = {
  badge: PropTypes.shape({
    courseId: PropTypes.string,
    blockId: PropTypes.string,
    blockDisplayName: PropTypes.string,
    blockOrder: PropTypes.number,
    eventType: PropTypes.string,
    badgeClass: PropTypes.shape({
      slug: PropTypes.string,
      issuingComponent: PropTypes.string,
      displayName: PropTypes.string,
      courseId: PropTypes.string,
      description: PropTypes.string,
      criteria: PropTypes.string,
      image: PropTypes.string,
    }),
    assertion: PropTypes.shape({
      issuedOn: PropTypes.string,
      entityId: PropTypes.string,
      expires: PropTypes.string,
      revoked: PropTypes.bool,
      imageUrl: PropTypes.string,
      assertionUrl: PropTypes.string,
      recipient: PropTypes.shape({
        plaintextIdentity: PropTypes.string,
      }),
      issuer: PropTypes.shape({
        entityType: PropTypes.string,
        entityId: PropTypes.string,
        openBadgeId: PropTypes.string,
        name: PropTypes.string,
        image: PropTypes.string,
        email: PropTypes.string,
        description: PropTypes.string,
        url: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default BadgeProgressCourseListItem;
