/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import snakeCase from 'lodash.snakecase';
import { DataTable, TextFilter } from '@edx/paragon';

import BadgeProgressCard from '../card/BadgeProgressCard';
import BadgeProgressCourseListTable from './BadgeProgressCourseListTable';

const BadgeProgressCourseList = (props) => {
  const { data, headings } = props;

  const getProgressCourseListData = () => {
    const results = [];

    data.forEach((item) => {
      const itemUserName = item.userName;
      const learnerData = {
        username: `'${item.userName}' (${item.email})`,
      };

      item.progress.forEach((i) => {
        const itemKey = snakeCase(`card ${i.blockDisplayName} ${itemUserName}`);
        learnerData[snakeCase(i.blockDisplayName)] = (
          <BadgeProgressCard key={`${itemKey}`} data={i} minimal="minimal" />
        );
      });

      results.push(learnerData);
    });

    return results;
  };

  const getLearnerCount = () => {
    const results = [];
    data.forEach((item) => results.push(item.userName));
    return results.length;
  };

  return (
    <>
      <DataTable
        isFilterable
        isPaginated
        isSortable
        defaultColumnValues={{ Filter: TextFilter }}
        initialState={{
          pageSize: 4,
          pageIndex: 0,
        }}
        itemCount={getLearnerCount()}
        fetchData={(currentState) => console.log(`This function will be called with the value: ${JSON.stringify(currentState)}}`)}
        data={getProgressCourseListData()}
        columns={headings}
      >
        <DataTable.TableControlBar />
        <BadgeProgressCourseListTable />
        <DataTable.TableFooter />
      </DataTable>
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
