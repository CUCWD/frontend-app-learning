import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Collapsible, Hyperlink, IconButton } from '@edx/paragon';
import {
  FormattedMessage,
  FormattedTime,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
// import { faCheckCircle as fasCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle as fasCheckCircle, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UnitLink from './UnitLink';


import EffortEstimate from '../../shared/effort-estimate';
import { useModel } from '../../generic/model-store';

import genericMessages from '../../generic/messages';
import messages from './messages';
import './SequenceLink.scss';
import { getSequenceMetadata } from '../../courseware/data/api';
import { getSequenceData } from '../data/api';


async function getUnitIds(id) {
  return await getSequenceData(id)

}


function SequenceLink({
  id,
  intl,
  courseId,
  defaultOpen,
  expand,
  first,
  sequence,
}) {
  const {
    complete,
    description,
    due,
    legacyWebUrl,
    showLink,
    title,  
  } = sequence;
  const {
    userTimezone,
  } = useModel('outline', courseId);
  const {
    canLoadCourseware,
  } = useModel('courseHomeMeta', courseId);

  const timezoneFormatArgs = userTimezone ? { timeZone: userTimezone } : {};

  const [open, setOpen] = useState(defaultOpen);
  const [unitIds, setUnitIds] = useState({});
  const [inProcess, setInProcess] = useState(false)
  
  

  useEffect(() => {
    setOpen(expand);
  }, [expand]);

  useEffect(() => {
    setOpen(defaultOpen);
  }, []);

  // canLoadCourseware is true if the Courseware MFE is enabled, false otherwise
  const coursewareUrl = (
    canLoadCourseware
      ? <Link to={`/course/${courseId}/${id}`}>{title}</Link>
      : <Hyperlink destination={legacyWebUrl}>{title}</Hyperlink>
  );
  const displayTitle = showLink ? coursewareUrl : title;
  const sequenceTitle = (
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
        <span className="align-middle">{displayTitle}</span>
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
            onClick={() => { 
              setOpen(true);
              if (Object.keys(unitIds).length == 0 && !inProcess) {
                getUnitIds(id).then((dataArray) => {
                  console.log("Fetching")
                  setInProcess(true)
                  setUnitIds(dataArray) 
                })
            }}}
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
            <div>
              {Object.keys(unitIds).length == 0 ? 
              <div>
                <div  class="pgn__spinner spinner-border sm"></div>
                
              </div>  : null}
            </div>
            {Object.values(unitIds).map((unit, index) => (
              <UnitLink
                key={unit.id}
                id={unit.id}
                unit={unit}
                courseId={courseId}
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
  first: PropTypes.bool.isRequired,
  sequence: PropTypes.shape().isRequired,
};

export default injectIntl(SequenceLink);
