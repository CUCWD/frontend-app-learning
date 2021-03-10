import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '@edx/paragon';
import { Check } from '@edx/paragon/icons';


import { sendTrackEvent, sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { Button } from '@edx/paragon';

import messages from '../messages';
import { useModel } from '../../../generic/model-store';
import { UpgradeButton } from '../../../generic/upgrade-button';
import VerifiedCert from '../../../generic/assets/edX_certificate.png';

/* Emma To Do: 
dates,  
links need to open in new tab
content gating -- do we need to check? or just duration?
*/

function UpgradeCard({ courseId, intl, onLearnMore }) {
  const { org } = useModel('courseHomeMeta', courseId);
  const {
    offer,
    verifiedMode,
    accessExpiration,
  } = useModel('outline', courseId);

  // const {
  //   accessExpiration,
  //   userTimezone,
  // } = payload;
  // const timezoneFormatArgs = userTimezone ? { timeZone: userTimezone } : {};

  const now = new Date();


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

  function expirationHighlight(hoursToExpiration){
    let expirationText;
    if(hoursToExpiration < 24){
      expirationText= <FormattedMessage
      id="learning.outline.alert.upgradecard.expiration"
      defaultMessage="{expiration} hours left"
      values={{
        expiration: (hoursToDiscountExpiration),
      }}
    />
    } else {
      expirationText =<FormattedMessage
          id="learning.outline.alert.upgradecard.expiration"
          defaultMessage="{expiration} days left"
          values={{
            expiration: (Math.floor(hoursToExpiration/24)),
          }}
        />
    }
    return(<div className="p-3 upsell-warning">{expirationText}</div>)
  }

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

  const upsellMessageHappyPath = <ul className="fa-ul">
      <li>
        <span className="fa-li"><Icon src={Check} /></span> 
        <FormattedMessage
          id="learning.outline.alert.upgradecard.verifiedCertLink"
          defaultMessage="Earn a {verifiedCertLink} of completion to showcase on your resume"
          values={{
            verifiedCertLink: (
              <a className="inline-link-underline" href={`${getConfig().MARKETING_SITE_BASE_URL}/verified-certificate`}>verified certificate</a>
            ),
          }}
        />
      </li>
      <li>
        <span className="fa-li"><FontAwesomeIcon icon={farCheckCircle} /></span> 
        <FormattedMessage
          id="learning.outline.alert.upgradecard.unlock-graded"
          defaultMessage="Unlock your access to all course activities, including {gradedAssignments}"
          values={{
            gradedAssignments: (
            <span className="font-weight-bold">graded assignments</span>
            ),
          }}
        />
      </li>
      <li>
        <span className="fa-li"><FontAwesomeIcon icon={farCheckCircle} /></span> 
        <FormattedMessage
          id="learning.outline.alert.upgradecard.fullAccess"
          defaultMessage="{fullAccess} to course content and materials, even after the course ends"
          values={{
            fullAccess: (
              <span className="font-weight-bold">Full access</span>
            ),
          }}
        />
      </li>
      <li>
        <span className="fa-li"><FontAwesomeIcon icon={farCheckCircle} /></span> 
        <FormattedMessage
          id="learning.outline.alert.upgradecard.nonProfitMission"
          defaultMessage="Support our {nonProfitMission} at edX"
          values={{
            nonProfitMission: (
              <span className="font-weight-bold">non-profit mission</span>
            ),
          }}
        />
      </li>
    </ul>


  let upgradeCardHeaderText;
  let expirationBanner;
  let upsellMessage;
  if(!!offer){ // if there's a first purchase discount, show it

    const hoursToDiscountExpiration = Math.floor((new Date(offer.expirationDate) - now) /1000/ 60 /60)
    
    upgradeCardHeaderText = <FormattedMessage
        id="learning.outline.alert.upgradecard.firstTimeLearnerDiscount"
        defaultMessage="{percentage}% First-Time Learner Discount"
        values={{
          percentage: (offer.percentage),
        }}
      />
    
    expirationBanner = expirationHighlight(hoursToDiscountExpiration)
    upsellMessage = upsellMessageHappyPath


  } else if(!!accessExpiration){
    const accessExpirationDate = new Date(accessExpiration.expirationDate)
    const hoursToAccessExpiration = Math.floor((accessExpirationDate - now) /1000/ 60 /60)

    if(hoursToAccessExpiration < (7*24)){ //more urgent messaging if access will expire in less than a week
      upgradeCardHeaderText = <FormattedMessage
        id="learning.outline.alert.upgradecard.accessExpirationUrgent"
        defaultMessage="Course Access Expiration"
      />
      expirationBanner = expirationHighlight(hoursToAccessExpiration)
      upsellMessage = <div>
      <p><FormattedMessage
          id="learning.outline.alert.upgradecard.expirationAccessLoss"
          defaultMessage="You will lose all access to this course, {includingAnyProgress}, on {date}."
          values={{
            includingAnyProgress: (<span className="font-weight-bold">including any progress</span>),
            date: ((accessExpirationDate.getMonth()+1) + "-" + accessExpirationDate.getDate() ),
          }}
        /></p>
      <p><FormattedMessage
          id="learning.outline.alert.upgradecard.expirationVerifiedCert"
          defaultMessage="Upgrading your course enables you to pursue a verified certificate and unlocks numerous features. Learn more about the {benefitsOfUpgrading}."
          values={{
            benefitsOfUpgrading: ( <a className="inline-link-underline" href="https://support.edx.org/hc/en-us/articles/360013426573-What-are-the-differences-between-audit-free-and-verified-paid-courses-">benefits of upgrading</a>),
          }}
        /></p>
      <p> </p>
    </div>
    } else {
      upgradeCardHeaderText = <FormattedMessage
        id="learning.outline.alert.upgradecard.accessExpiration"
        defaultMessage="Upgrade your course today"
      />
      expirationBanner = <div className="p-3 upsell-warning-light">
        <FormattedMessage
          id="learning.outline.alert.upgradecard.expirationr"
          defaultMessage="Course access will expire {date}"
          values={{
            date: ((accessExpirationDate.getMonth()+1) + "-" + accessExpirationDate.getDate() ),
          }}
        /></div>
        upsellMessage = upsellMessageHappyPath
      

    }
    
  }

  

  return (
    <section className="mb-4 card">
      <h2 className="h5 m-3" id="outline-sidebar-upgrade-header">{upgradeCardHeaderText}</h2>
      {expirationBanner}
      <div className="p-3">
        {upsellMessage}
      </div>
      <UpgradeButton
        offer={offer}
        onClick={logClick}
        verifiedMode={verifiedMode}
        className="ml-3 mr-3 mb-3"
      />
      {!!offer && <div className="bg-light p-3 text-center discount-info">
        <FormattedMessage
          id="learning.outline.alert.upgradecard.code"
          defaultMessage="Use code {code} at checkout"
          values={{
            code: (<span className="font-weight-bold">{offer.code}</span>),
          }}
        />
      </div>}
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
