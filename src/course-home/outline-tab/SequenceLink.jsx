import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Collapsible, Hyperlink, IconButton } from '@edx/paragon';
import {
  FormattedMessage,
  FormattedTime,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import { faCheckCircle as fasCheckCircle, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UnitLink from './UnitLink';


import EffortEstimate from '../../shared/effort-estimate';
import { useModel } from '../../generic/model-store';

import genericMessages from '../../generic/messages';
import messages from './messages';



function SequenceLink({
  id,
  intl,
  courseId,
  defaultOpen,
  expand,
  sequence,
}) {
  const {
    complete,
    description,
    due,
    // legacyWebUrl,
    // showLink,
    title,  
    unitIds,
  } = sequence;
  const {
    courseBlocks: {
      units,
    },
  } = useModel('outline', courseId);

  const {
    userTimezone,
  } = useModel('outline', courseId);

  // const {
  //   canLoadCourseware,
  // } = useModel('courseHomeMeta', courseId);

  const timezoneFormatArgs = userTimezone ? { timeZone: userTimezone } : {};


  const [open, setOpen] = useState(defaultOpen);
  
  useEffect(() => {
    setOpen(expand);
  }, [expand]);



  // canLoadCourseware is true if the Courseware MFE is enabled, false otherwise
  // const coursewareUrl = (
  //   canLoadCourseware
  //     ? <Link to={`/course/${courseId}/${id}`}>{title}</Link>
  //     : <Hyperlink destination={legacyWebUrl}>{title}</Hyperlink>
  // );
  // const displayTitle = showLink ? coursewareUrl : title;
  const sequenceTitle = (
    <div className="row w-100 m-0">
       { unitIds.length > 0 ? (
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
            <span className="align-middle">{title}</span>
            <span className="sr-only">
              , {intl.formatMessage(complete ? messages.completedAssignment : messages.incompleteAssignment)}
            </span>
            <EffortEstimate className="ml-3 align-middle" block={sequence} />      
          </div>
          {due && (
              <div className="row w-100 m-0 ml-3 pl-3">
                <small className="text-body pl-2">
                  <FormattedMessage
                    id="learning.outline.sequence-due"
                    defaultMessage="{description} due {assignmentDue}"
                    description="Used below an assignment title"
                    values={{
                      assignmentDue: (
                        <FormattedTime
                          key={`${id}-due`}
                          day="numeric"
                          month="short"
                          year="numeric"
                          timeZoneName="short"
                          value={due}
                          {...timezoneFormatArgs}
                        />
                      ),
                      description: description || '',
                    }}
                  />
                </small>
              </div>
            )}
        </div>
        ) : (
          <div className="row w-100 m-0">
            <div className="col-auto p-0">
              <FontAwesomeIcon
                  icon={farCheckCircle}
                  fixedWidth
                  className="float-left mt-1 text-gray-400"
                  aria-hidden="true"
                  title={intl.formatMessage(messages.incompleteSection)}
                />
            </div>
            <div className="col-10 ml-3 p-0 font-weight-bold text-muted-500">
              <span className="align-middle">{title} (No Units)</span>
            </div>
          </div>
        )}
    </div>
  )

  return (
    <li>
        <Collapsible
        className="mb-2"
        styling="card-lg"
        title={sequenceTitle}
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
            {unitIds.map((unitId, index) => (
              <UnitLink
                key={unitId}
                id={unitId}
                courseId={courseId}
                unit={units[unitId]}
                sequenceId={id}
                first={index === 0}
              ></UnitLink>
            ))}
          </ol>
        </Collapsible>
    </li>
  );
}

SequenceLink.propTypes = {
  id: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  expand: PropTypes.bool.isRequired,
  sequence: PropTypes.shape().isRequired,
};

export default injectIntl(SequenceLink);
