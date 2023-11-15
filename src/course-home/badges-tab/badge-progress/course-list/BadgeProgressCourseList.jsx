import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@edx/paragon';

import BadgeProgressCourseListItem from './BadgeProgressCourseListItem';

const BadgeProgressCourseList = (props) => {
  const { data, headings } = props;

  const getProgressCourseListData = () => {
    const results = [];

    data.forEach((item) => {
      const learnerData = {
        username: `'${item.userName}' (${item.email})`,
      };

      item.progress.forEach((i) => {
        learnerData[i.blockId] = (
          <BadgeProgressCourseListItem key={`${learnerData.username}_${i.blockId}`} badge={i} />
        );
      });

      results.push(learnerData);
    });

    return results;
  };

  // eslint-disable-next-line no-unused-vars
  const sortProgressByCourseBlockOrder = (progress) => {
    if (progress) {
      return progress.sort((a, b) => {
        if (a.block_order < b.block_order) { return -1; }
        if (a.block_order > b.block_order) { return 1; }
        return 0;
      });
    }
    return 0;
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <Table
          columns={headings}
          data={getProgressCourseListData()}
          rowHeaderColumnKey="username"
          className="badge-progress-course-list table-responsive thead-overflow-hidden"
        />
      </div>
    </>
  );
};

BadgeProgressCourseList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
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
  })).isRequired,
  headings: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    key: PropTypes.string,
  })).isRequired,
};

export default BadgeProgressCourseList;
