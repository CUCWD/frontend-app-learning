import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import classNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

const BadgeProgressCardStatus = (props) => {
  const { status, title, earned } = props;

  const getStatusEarned = () => {
    // Set the output format for every react-moment instance.
    Moment.globalFormat = 'MMMM D, YYYY';

    // Set the timezone for every instance.
    // Moment.globalTimezone = 'America/Los_Angeles';

    // Set the output timezone for local for every instance.
    Moment.globalLocal = true;

    // Use a <span> tag for every react-moment instance.
    Moment.globalElement = 'span';

    return (
      <>
        {earned && (
          <div className="card-status-earned">
            Earned: <Moment>{earned}</Moment>
          </div>
        )}
      </>
    );
  };

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
    <>
      {!earned && (
        <div className="card-status pt-2 pr-0 pb-2 pl-0">
          {getStatusIndicator()}
          {getStatusTitle()}
        </div>
      )}
      {earned && (
        <div className="card text-center mb-3">
          <div className="card-header mb-2">
            <div className="card-status pt-2 pr-0 pb-2 pl-0">
              {getStatusIndicator()}
              {getStatusTitle()}
              {getStatusEarned()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

BadgeProgressCardStatus.defaultProps = {
  earned: '',
};

BadgeProgressCardStatus.propTypes = {
  status: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  earned: PropTypes.string,
};

export default BadgeProgressCardStatus;
