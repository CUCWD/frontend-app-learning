import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, Collapsible, IconButton } from '@edx/paragon';
import { faCheckCircle as fasCheckCircle, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SequenceLink from './SequenceLink';
import { useModel } from '../../generic/model-store';

import genericMessages from '../../generic/messages';
import messages from './messages';

function Section({
  courseId,
  defaultOpen,
  expand,
  intl,
  section,
}) {
  const {
    badgeProgress,
    complete,
    sequenceIds,
    title,
    estimatedTime,
    showEstimatedTime,
  } = section;
  const {
    courseBlocks: {
      sequences,
    },
  } = useModel('outline', courseId);

  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(expand);
  }, [expand]);

  useEffect(() => {
    setOpen(defaultOpen);
  }, []);

  const badgeProgressUrl = './badges/progress';

  const estimatedTimeMinutes = parseInt(estimatedTime / 60, 10) + (estimatedTime % 60 > 0);

  const sectionTitle = (
    <div className="row w-100 m-0">
      <div className="col-auto p-0">
        {complete ? (
          <FontAwesomeIcon
            icon={fasCheckCircle}
            fixedWidth
            className="float-left mt-1 text-success"
            aria-hidden="true"
            title={intl.formatMessage(messages.completedSection)}
          />
        ) : (
          <FontAwesomeIcon
            icon={farCheckCircle}
            fixedWidth
            className="float-left mt-1 text-gray-400"
            aria-hidden="true"
            title={intl.formatMessage(messages.incompleteSection)}
          />
        )}
      </div>
      <div className="col-10 ml-3 p-0 font-weight-bold text-dark-500">
        <span className="align-middle" style={{ display: 'block' }}>{title}</span>
        { (estimatedTime
        && showEstimatedTime && (
        <span className="" style={{ display: 'block', fontSize: '12px', color: 'grey' }}>
          Estimated Completion Time: { estimatedTimeMinutes } { estimatedTimeMinutes === 1 ? 'minute' : 'minutes' }
        </span>
        )) }
        <span className="sr-only">
          , {intl.formatMessage(complete ? messages.completedSection : messages.incompleteSection)}
        </span>
        {badgeProgress ? (
          <>
            {badgeProgressUrl && (
            <span className="col-2 col-sm-auto p-3">
              <Button variant="brand" size="inline" href={badgeProgressUrl}>
                Badge Progress
              </Button>
            </span>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );

  return (
    <li>
      <Collapsible
        className="mb-2"
        styling="card-lg"
        title={sectionTitle}
        open={open}
        onToggle={() => { setOpen(!open); }}
        iconWhenClosed={(
          <IconButton
            alt={intl.formatMessage(messages.openSection)}
            icon={faPlus}
            onClick={() => { setOpen(true); }}
            size="sm"
          />
        )}
        iconWhenOpen={(
          <IconButton
            alt={intl.formatMessage(genericMessages.close)}
            icon={faMinus}
            onClick={() => { setOpen(false); }}
            size="sm"
          />
        )}
      >
        <ol className="list-unstyled">
          {sequenceIds.map((sequenceId, index) => (
            <SequenceLink
              key={sequenceId}
              id={sequenceId}
              courseId={courseId}
              sequence={sequences[sequenceId]}
              first={index === 0}
            />
          ))}
        </ol>
      </Collapsible>
    </li>
  );
}

Section.propTypes = {
  courseId: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  expand: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  section: PropTypes.shape().isRequired,
};

export default injectIntl(Section);
