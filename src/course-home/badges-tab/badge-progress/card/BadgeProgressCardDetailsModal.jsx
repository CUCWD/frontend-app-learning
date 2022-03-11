import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactMarkdown from 'react-markdown';
import {
  Button,
  Collapsible,
  Hyperlink,
  Modal,
} from '@edx/paragon';

import LinkedLogo from '../../logos';
import logo from '../../assets/logo-badgr-white.svg';

const BadgeProgressCardDetailsModal = (props) => {
  const {
    parentSelector,
    progress,
    minimal,
    badgeProgressCardStatus,
  } = props;
  const [modalOpen, setModalOpen] = useState(false);
  // const [modalModel, setModalModel] = useState([{}]);

  const getBadgrLogo = () => (
    <LinkedLogo
      className="logo"
      href="https://badgr.com/auth/login"
      src={logo}
      alt="Badgr"
      target="_blank"
    />
  );

  const openModal = () => {
    setModalOpen(true);
    // setModalModel([{}]);
  };

  const resetModalWrapperState = () => {
    setModalOpen(false);
    // setModalModel([{}]);
    // this.button.focus();
  };

  const redirectBackpack = () => window.open('https://badgr.com/recipient/badges', '_blank');

  const renderModal = () => (
    /* Todo: May consider going back to `src = progress.assertion.imageUrl` to
       reflect actual image earned. I was not able to render
       "http://example.com/image.png" because it produces a 404 error.
    */
    <>
      <div>
        <div className="modal-progress-details" />
        <Hyperlink destination="#" target="_self" className="m-0 p-0" onClick={openModal}>
          <img className={classNames('card-img-top asserted', minimal)} src={progress.assertion.imageUrl} alt={progress.badgeClass.displayName} />
        </Hyperlink>
      </div>
      <Modal
        open={modalOpen}
        closeText="Close"
        title=""
        body={(
          <>
            <div className="progress-details">
              <div className="progress-details-header mb-5">
                <div className="progress-details-title row w-100">
                  <h2 className="col">{progress.badgeClass.displayName}</h2>
                </div>
                <div className="progress-details-description row w-100">
                  <div className="col">
                    {progress.badgeClass.description}
                  </div>
                </div>
              </div>
              <div className="progress-details-body row w-100">
                <div className="progress-details-image col col-4">
                  <img src={progress.assertion.imageUrl} alt={progress.badgeClass.displayName} />
                  <Button variant="primary" className="" onClick={redirectBackpack}>
                    View Backpack
                  </Button>
                </div>
                <div className="progress-details-meta col col-8">
                  {progress.assertion.issuedOn && progress.blockDisplayName && (
                    <div className="progress-details-meta-earned">
                      {badgeProgressCardStatus}
                    </div>
                  )}
                  {progress.assertion.recipient.plaintextIdentity && (
                    <div className="progress-details-meta-recipient">
                      <h3>Recipient</h3>
                      <p>{progress.assertion.recipient.plaintextIdentity}</p>
                    </div>
                  )}
                  {progress.badgeClass.criteria && (
                    <div className="progress-details-meta-criteria">
                      <h3>Criteria</h3>
                      <ReactMarkdown>{progress.badgeClass.criteria}</ReactMarkdown>
                    </div>
                  )}
                  {progress.assertion.issuer && (
                    <div className="progress-details-meta-issuer">
                      <h3>Issuer</h3>
                      <ul className="pl-0">
                        <li>
                          <span className="mr-2"><Hyperlink destination={progress.assertion.issuer.openBadgeId} target="_blank">{progress.assertion.issuer.name}</Hyperlink></span>
                          <span>{progress.assertion.issuer.email}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="progress-details-share">
                <Collapsible title="Badgr Share Details">
                  <div className="progress-details-share-instructions row w-100 p-4">
                    <div className="share-introduction col col-12 pb-4">
                      <h3>Share your Open Badge with Badgr</h3>
                      <p>
                        Your achievement has been recognized with an <Hyperlink destination="https://openbadges.org/" target="_blank">Open Badge</Hyperlink>, a digital image file with information
                        embedded in it that uniquely identifies your accomplishments.
                      </p>
                      <p className="mb-4">
                        Badgr is a service that creates and stores Open Badges and lets you share them with others.
                        To share your badge using Badgr, you can send a link to a web page about your badge to others.
                        You can also send the badge image file directly to others, and they can use a <Hyperlink destination="https://badgecheck.io/" content="badge verification service" target="_blank" /> from Badgr to confirm your accomplishment.
                        For more options, you must first have a Badgr account.
                        You should have received an email the first time you received a badge with
                        instructions about creating a Badgr account. Once you have a Badgr account, you can organize
                        your badges in a Backpack and access tools to help share your badges on social media, embed
                        them in web pages, and more.
                      </p>
                      <hr />
                    </div>
                  </div>
                  <div className="progress-details-share-badgr-instructions row w-100 p-4">
                    <div className="badgr-instructions col col-9">
                      <ol>
                        <li>Create a <Hyperlink destination="https://badgr.com/signup" target="_blank">Badgr</Hyperlink> account, or <Hyperlink destination="https://badgr.com/auth/login" target="_blank">log in</Hyperlink> to your existing account;</li>
                        <li><Hyperlink destination={progress.assertion.assertionUrl} target="_blank">Share this public URL to your badge</Hyperlink>; or</li>
                        <li>
                          <Hyperlink destination={progress.assertion.imageUrl} target="_blank">Download your badge (right-click or option-click, save as)</Hyperlink> and share it
                          directly with others. They can verify it&apos;s really yours at <Hyperlink destination="https://badgecheck.io/" target="_blank">badgecheck.io</Hyperlink>.
                        </li>
                      </ol>
                    </div>
                    <div className="badgr-image col col-3">
                      {getBadgrLogo()}
                    </div>
                  </div>
                </Collapsible>
              </div>
            </div>
          </>
        )}
        parentSelector={parentSelector}
        buttons={[]}
        onClose={resetModalWrapperState}
      />
    </>
  );

  return renderModal();
};

BadgeProgressCardDetailsModal.propTypes = {
  parentSelector: PropTypes.string,
  progress: PropTypes.shape({
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
  badgeProgressCardStatus: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

BadgeProgressCardDetailsModal.defaultProps = {
  parentSelector: 'body',
  minimal: '',
};

export default BadgeProgressCardDetailsModal;
