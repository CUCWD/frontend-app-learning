import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import { sendTrackEvent, sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { Button } from '@edx/paragon';

import messages from '../messages';
import { useModel } from '../../../generic/model-store';
import { UpgradeButton } from '../../../generic/upgrade-button';
import VerifiedCert from '../../../generic/assets/edX_certificate.png';

function UpgradeCard({ courseId, intl, onLearnMore }) {
  const { org } = useModel('courseHomeMeta', courseId);
  const {
    offer,
    verifiedMode,
  } = useModel('outline', courseId);

  if (!verifiedMode) {
    return null;
  }

  const eventProperties = {
    org_key: org,
    courserun_key: courseId,
  };

  const promotionEventProperties = {
    creative: 'sidebarupsell',
    name: 'In-Course Verification Prompt',
    position: 'sidebar-message',
    promotion_id: 'courseware_verified_certificate_upsell',
    ...eventProperties,
  };

  useEffect(() => {
    sendTrackingLogEvent('edx.bi.course.upgrade.sidebarupsell.displayed', eventProperties);
    sendTrackEvent('Promotion Viewed', promotionEventProperties);
  });

  const logClick = () => {
    sendTrackingLogEvent('edx.bi.course.upgrade.sidebarupsell.clicked', eventProperties);
    sendTrackingLogEvent('edx.course.enrollment.upgrade.clicked', {
      ...eventProperties,
      location: 'sidebar-message',
    });
    sendTrackEvent('Promotion Clicked', promotionEventProperties);
  };

  return (
    <section className="mb-4 card">
        <h2 className="h5 m-3" id="outline-sidebar-upgrade-header">{intl.formatMessage(messages.upsellFirstPurchaseDiscount)}</h2>
        <div className="p-3 upsell-warning">6 days left</div>
        <div className="pt-3">
          <ul className="fa-ul">
            <li>
              <span className="fa-li"><FontAwesomeIcon icon={farCheckCircle} /></span> 
              Earn a <a className="inline-link-underline" href={`${getConfig().MARKETING_SITE_BASE_URL}/verified-certificate`}>verified certificate</a> of completion to showcase on your resume
            </li>
            <li>
              <span className="fa-li"><FontAwesomeIcon icon={farCheckCircle} /></span> 
              Unlock your access to all course activities, including <span className="font-weight-bold">graded assignments</span>
            </li>
            <li>
              <span className="fa-li"><FontAwesomeIcon icon={farCheckCircle} /></span> 
              <span className="font-weight-bold">Full access</span> to course content and materials, even after the course ends
            </li>
            <li>
              <span className="fa-li"><FontAwesomeIcon icon={farCheckCircle} /></span> 
              Support our <span className="font-weight-bold">non-profit mission</span> at edX
            </li>
          </ul>
        </div>
        <UpgradeButton
                offer={offer}
                onClick={logClick}
                verifiedMode={verifiedMode}
                className="ml-3 mr-3 mb-3"
              />
      <div className="bg-light p-3 text-center discount-info">
      Use code <span className="font-weight-bold">EDXWELCOME</span> at checkout
      </div>
    </section>
    /* <section className="mb-4 p-3 outline-sidebar-upgrade-card">
      <h2 className="h4" id="outline-sidebar-upgrade-header">{intl.formatMessage(messages.upgradeTitle)}</h2>
      <div className="row w-100 m-0">
        <div className="col-6 col-md-12 col-lg-3 col-xl-4 p-0 text-md-center text-lg-left">
          <img
            alt={intl.formatMessage(messages.certAlt)}
            className="w-100"
            src={VerifiedCert}
            style={{ maxWidth: '10rem' }}
          />
        </div>
        <div className="col-6 col-md-12 col-lg-9 col-xl-8 p-0 pl-lg-2 text-center mt-md-2 mt-lg-0">
          <div className="row w-100 m-0 justify-content-center">
            <UpgradeButton
              offer={offer}
              onClick={logClick}
              verifiedMode={verifiedMode}
            />
            {onLearnMore && (
              <div className="col-12">
                <Button
                  variant="link"
                  size="sm"
                  className="pb-0"
                  onClick={onLearnMore}
                  aria-labelledby="outline-sidebar-upgrade-header"
                >
                  {intl.formatMessage(messages.learnMore)}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section> */
  );
}

UpgradeCard.propTypes = {
  courseId: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  onLearnMore: PropTypes.func,
};

UpgradeCard.defaultProps = {
  onLearnMore: null,
};

export default injectIntl(UpgradeCard);
