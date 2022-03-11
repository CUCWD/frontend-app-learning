import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DataTableContext } from '@edx/paragon';

import BadgeProgressCourseListTableHeaderRow from './BadgeProgressCourseListTableHeaderRow';
import BadgeProgressCourseListTableRow from './BadgeProgressCourseListTableRow';

const BadgeProgressCourseListTable = ({ isStriped }) => {
  const useRows = () => {
    const {
      getTableProps, prepareRow, page, rows, headerGroups, getTableBodyProps,
    } = useContext(DataTableContext);

    const displayRows = page || rows;

    return {
      getTableProps, prepareRow, displayRows, headerGroups, getTableBodyProps,
    };
  };

  const {
    getTableProps, prepareRow, displayRows, headerGroups, getTableBodyProps,
  } = useRows();

  const renderRows = () => displayRows.map((row) => {
    prepareRow(row);
    return (
      <BadgeProgressCourseListTableRow {...row} key={`table_row_${row.id}`} />
    );
  });

  if (!getTableProps) {
    return null;
  }

  return (
    <div className="pgn__data-table-container">
      <table {...getTableProps({
        className: classNames({ 'pgn__data-table': true, 'is-striped': isStriped }),
      })}
      >
        <BadgeProgressCourseListTableHeaderRow headerGroups={headerGroups} />
        <tbody {...getTableBodyProps()}>
          {renderRows()}
        </tbody>
      </table>
    </div>
  );
};

BadgeProgressCourseListTable.defaultProps = {
  isStriped: true,
};

BadgeProgressCourseListTable.propTypes = {
  /** should table rows be striped */
  isStriped: PropTypes.bool,
};

export default BadgeProgressCourseListTable;
