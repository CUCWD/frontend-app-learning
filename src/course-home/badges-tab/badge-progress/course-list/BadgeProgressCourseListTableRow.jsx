import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import snakeCase from 'lodash.snakecase';

import BadgeProgressCourseListTableCell from './BadgeProgressCourseListTableCell';

/* key={`${cell.column.Header}${id}`} */
const BadgeProgressCourseListTableRow = ({
  getRowProps, cells, id, isSelected,
}) => (
  <tr {...getRowProps({
    className: classNames({
      'pgn__data-table-row': true,
      'is-selected': isSelected,
    }),
  })}
  >
    {cells.map(cell => <BadgeProgressCourseListTableCell {...cell} key={`${snakeCase(`cell ${cell.column.Header} ${id}`)}`} />)}
  </tr>
);

BadgeProgressCourseListTableRow.defaultProps = {
  isSelected: false,
};

BadgeProgressCourseListTableRow.propTypes = {
  /** props to include on the tr tag (must include id) */
  getRowProps: PropTypes.func.isRequired,
  /** cells in the row */
  cells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  /** row id */
  id: PropTypes.string.isRequired,
  /** indicates if row has been selected */
  isSelected: PropTypes.bool,
};

export default BadgeProgressCourseListTableRow;
