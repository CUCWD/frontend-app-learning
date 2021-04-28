/* eslint-disable import/prefer-default-export */

const headingMapper = (filterKey, data) => {
  // eslint-disable-next-line no-unused-vars
  const dataSortable = data.slice();

  function all(entry) {
    if (entry) {
      const results = [{
        label: 'Student',
        key: 'username',
        width: 'col-2',
      }];

      const progressHeadings = entry.progress
        .filter(blocks => blocks.blockDisplayName)
        .map(b => ({
          label: b.blockDisplayName.replace(/[0-9]+\./g, ''),
          key: b.blockId,
          width: 'col-1',
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
