/* eslint-disable import/prefer-default-export */

import snakeCase from 'lodash.snakecase';
import { DropdownFilter } from '@edx/paragon';
import { isEmptyObject } from '../../utils/empty';

// Defines a custom filter filter function for finding badge assertion
const filterContainsBadgeAssertion = (rows, id, filterValue) => {
  const isBadgeProgressComplete = (data) => {
    if (isEmptyObject(data.assertion)) {
      return false;
    }
    return data.assertion.imageUrl.length > 0;
  };

  return rows.filter(row => {
    const rowValue = row.values[id];
    const badgeAsserted = isBadgeProgressComplete(rowValue.props.data);

    return badgeAsserted ? snakeCase(`${rowValue.props.data.blockDisplayName} awarded`) === filterValue : snakeCase(`${rowValue.props.data.blockDisplayName} not awarded`) === filterValue;
  });
};

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a string or string is empty
filterContainsBadgeAssertion.autoRemove = val => typeof val !== 'string' || !val;

const headingMapper = (filterKey, data) => {
  // eslint-disable-next-line no-unused-vars
  const dataSortable = data.slice();

  function all(entry) {
    if (entry) {
      const results = [{
        Header: 'Student',
        label: 'Student',
        key: 'username',
        accessor: 'username',
        width: 'col-2',
      }];

      const progressHeadings = entry.progress
        .filter(blocks => blocks.blockDisplayName)
        .map(b => ({
          Header: b.blockDisplayName.replace(/[0-9]+\./g, ''),
          accessor: snakeCase(b.blockDisplayName),
          Filter: DropdownFilter,
          filter: filterContainsBadgeAssertion,
          filterChoices: [
            {
              name: 'Awarded',
              value: snakeCase(`${b.blockDisplayName} awarded`),
            },
            {
              name: 'Not Awarded',
              value: snakeCase(`${b.blockDisplayName} not awarded`),
            },
          ],
        }));

      return results.concat(progressHeadings);
    }
    return [];
  }

  // Todo: Need to implement this.
  // eslint-disable-next-line no-unused-vars
  function some(entry) {
    return [{
      label: '',
      key: '',
      width: 'col-1',
    }];
  }

  return filterKey === 'All' ? all : some;
};

export {
  headingMapper,
};
