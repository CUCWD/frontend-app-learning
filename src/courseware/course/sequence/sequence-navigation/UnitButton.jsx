import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Button } from '@edx/paragon';

import UnitIcon from './UnitIcon';
import CompleteIcon from './CompleteIcon';
import BookmarkFilledIcon from '../../bookmark/BookmarkFilledIcon';

function UnitButton({
  onClick,
  title,
  contentType,
  isActive,
  bookmarked,
  complete,
  showCompletion,
  unitId,
  className,
  showTitle,
  estimatedTime,
  showEstimatedTime,
}) {
  const handleClick = useCallback(() => {
    onClick(unitId);
  });

  const estimatedTimeMinutes = parseInt(estimatedTime / 60, 10) + (estimatedTime % 60 > 0);

  return (
    <Button
      className={classNames({
        active: isActive,
        complete: showCompletion && complete,
      }, className)}
      variant="link"
      onClick={handleClick}
      title={title}
    >
      <UnitIcon type={contentType} />
      {showTitle && <span className="unit-title">{title}</span>}
      {showCompletion && complete ? <CompleteIcon size="sm" className="text-success ml-2" /> : null}
      {bookmarked ? (
        <BookmarkFilledIcon
          className="text-primary small position-absolute"
          style={{ top: '-3px', right: '5px' }}
        />
      ) : null}
      {estimatedTime && showEstimatedTime && <span className="ml-2"> ({estimatedTimeMinutes} {estimatedTimeMinutes === 1 ? 'min' : 'mins'}) </span>}
    </Button>
  );
}

UnitButton.propTypes = {
  bookmarked: PropTypes.bool,
  className: PropTypes.string,
  complete: PropTypes.bool,
  contentType: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  showCompletion: PropTypes.bool,
  showTitle: PropTypes.bool,
  title: PropTypes.string.isRequired,
  unitId: PropTypes.string.isRequired,
  estimatedTime: PropTypes.string,
  showEstimatedTime: PropTypes.bool,
};

UnitButton.defaultProps = {
  className: undefined,
  isActive: false,
  bookmarked: false,
  complete: false,
  showTitle: false,
  showCompletion: true,
  estimatedTime: '1',
  showEstimatedTime: false,
};

const mapStateToProps = (state, props) => ({
  ...state.models.units[props.unitId],
});

export default connect(mapStateToProps)(UnitButton);
