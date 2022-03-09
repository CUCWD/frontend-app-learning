import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

const BadgeProgressCardStatus = (props) => {
  const { status, title } = props;

  const getStatusIndicator = () => {
    const indicatorIcon = (status ? faCheckCircle : faCircle);
    const indicatorStatus = (status ? 'complete' : 'incomplete');
    return (
      <FontAwesomeIcon icon={indicatorIcon} className={classNames('card-status-icon', 'fa-2x', 'mr-3', indicatorStatus)} />
    );
  };

  const getStatusTitle = () => {
    const stripNumPrefix = title.replace(/[0-9]+\./g, '');
    return (
      <div className="card-status-title">
        {stripNumPrefix}
      </div>
    );
  };

  return (
    <div className="card-status pt-2 pr-0 pb-2 pl-0">
      {getStatusIndicator()}
      {getStatusTitle()}
    </div>
  );
};

BadgeProgressCardStatus.propTypes = {
  status: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default BadgeProgressCardStatus;
