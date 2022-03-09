import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEmptyObject } from '../../../../utils/empty';
import BadgeProgressCardStatus from './BadgeProgressCardStatus';
import BadgeProgressCardDetailsModal from './BadgeProgressCardDetailsModal';

const BadgeProgressCard = (props) => {
  const { data, minimal } = props;

  const isProgressComplete = () => {
    if (isEmptyObject(data.assertion)) {
      return false;
    }
    return data.assertion.imageUrl.length > 0;
  };

  const getBadgeProgressCardDetails = (earned) => (
    <>
      <BadgeProgressCardStatus status={isProgressComplete()} title={data.blockDisplayName} earned={earned} />
    </>
  );

  const getBadgeImage = () => {
    const { assertionUrl } = data.assertion;

    return (
      <>
        {assertionUrl && (
          <BadgeProgressCardDetailsModal
            key={data.assertion.entityId}
            parentSelector=".modal-progress-details"
            progress={data}
            minimal={minimal}
            badgeProgressCardStatus={getBadgeProgressCardDetails(data.assertion.issuedOn)}
          />
        )}
        {!assertionUrl && (
          <img className={classNames('card-img-top not-asserted', minimal)} src={data.badgeClass.image} alt={data.badgeClass.displayName} />
        )}
      </>
    );
  };

  return (
    <>
      {minimal && (
        <div className="card text-center mb-3">
          <div className="card-badge">
            {getBadgeImage('minimal')}
          </div>
        </div>
      )}
      {!minimal && (
        <div className="col-sm-12 col-md-4 col-lg-3 col-xl-2 mb-3">
          <div className="card text-center mb-3">
            <div className="card-header mb-2">
              <BadgeProgressCardStatus status={isProgressComplete()} title={data.blockDisplayName} />
            </div>
            <div className="card-badge">
              {getBadgeImage()}

              <div className="card-body">
                <h5 className="card-title text-muted mb-0">{data.badgeClass.displayName}</h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

BadgeProgressCard.defaultProps = {
  minimal: '',
};

BadgeProgressCard.propTypes = {
  data: PropTypes.shape({
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
  }).isRequired,
  minimal: PropTypes.string,
};

export default BadgeProgressCard;
