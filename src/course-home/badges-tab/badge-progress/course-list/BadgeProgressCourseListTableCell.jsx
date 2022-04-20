import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import BadgeProgressCard from '../card/BadgeProgressCard';

const BadgeProgressCourseListTableCell = (
  {
    getCellProps, render, column, value,
  },
) => (
  <td {...getCellProps()}>
    <span className={classNames('pgn__data-table-cell-wrap', column.cellClassName)}>
      {column.id === 'username' && (
        render('Cell')
      )}
      {column.id !== 'username' && (
        <BadgeProgressCard key={value.key} data={value.props.data} minimal="minimal" />
      )}
    </span>
  </td>
);

BadgeProgressCourseListTableCell.defaultProps = {
  value: '',
};

BadgeProgressCourseListTableCell.propTypes = {
  /** Props for the td element */
  getCellProps: PropTypes.func.isRequired,
  /** Function that renders the cell contents. Will be called with the string 'Cell' */
  render: PropTypes.func.isRequired,
  /** Table column */
  column: PropTypes.shape({
    cellClassName: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
};

export default BadgeProgressCourseListTableCell;
