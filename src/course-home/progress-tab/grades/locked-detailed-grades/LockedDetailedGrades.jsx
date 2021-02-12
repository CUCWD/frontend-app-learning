import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button } from '@edx/paragon';

import { faEye, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useModel } from '../../../../generic/model-store';

import './LockedDetailedGrades.scss';

function LockedDetailedGrades({ intl }) {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    sectionScores,
  } = useModel('progress', courseId);

  return (
    <section className="text-dark-700 my-4">
      <div className="bg-accent-b">
        <h4 className="m-0 p-2">
          <FontAwesomeIcon icon={faEye} className="ml-1 mr-2" />
          Preview of locked feature
        </h4>
      </div>
      <div id="grade-preview" className="bg-gray-100 p-3 border border-accent-b">
        <div id="overlay" />
        <h3>Grades</h3>
        {sectionScores.map((chapter) => {
          const gradedSubsections = chapter.subsections.filter((subsection) => !!(subsection.hasGradedAssignment && subsection.showGrades && subsection.numPointsPossible > 0));
          return (
            <>
              {gradedSubsections.length > 0 && (
                <table className="section-grades-table mx-2 my-3">
                  <thead>
                    <tr>
                      <th scope="col" className="chapter-column-header col-9 pl-0 py-2">{chapter.displayName}</th>
                      {/* TODO: translate */}
                      <th scope="col" className="col-3">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                  {gradedSubsections.map((subsection) => (
                    <tr>
                      <td className="col-9 p-2">
                        {subsection.displayName}
                      </td>
                      {/* TODO: why won't heading-label work here? */}
                      {/* TODO: screen reader text */}
                      <td className="col-3 p-2 text-center">{`${subsection.numPointsEarned}/${subsection.numPointsPossible}`}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              )}
            </>
          );
        })}
      </div>
      <div className="bg-accent-b row w-100 m-0 py-3">
        <div className="col-8 pl-md-4">View grades and work towards a certificate.</div>
        <div className="col-4 p-0 text-center">
          {/* TODO: upgrade url */}
          <Button>
            <FontAwesomeIcon icon={faLock} className="mr-2" />
            Upgrade
          </Button>
        </div>
      </div>
    </section>
  );
}

LockedDetailedGrades.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(LockedDetailedGrades);
