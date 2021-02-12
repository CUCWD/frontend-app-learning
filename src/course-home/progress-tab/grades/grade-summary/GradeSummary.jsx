import React from 'react';
import { useSelector } from 'react-redux';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { useModel } from '../../../../generic/model-store';

import GradeSummaryTable from './GradeSummaryTable';

import messages from '../messages';

function GradeSummary({ intl }) {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    courseGrade,
    sectionScores,
    gradingPolicy: {
      assignmentPolicies,
    },
  } = useModel('progress', courseId);

  // loop through block by type and accumulate the grades
  const gradeByAssignmentType = {};
  assignmentPolicies.forEach(assignment => (
    gradeByAssignmentType[assignment.type] = { numPointsEarned: 0, numPointsPossible: 0 }
  ));

  sectionScores.forEach((chapter) => {
    chapter.subsections.forEach((subsection) => {
      if (subsection.graded) {
        gradeByAssignmentType[subsection.assignmentType].numPointsEarned += subsection.numPointsEarned;
        gradeByAssignmentType[subsection.assignmentType].numPointsPossible += subsection.numPointsPossible;
      }
    });
  });

  const totalGrade = courseGrade.percent * 100;
  return (
    <section className="text-dark-700 my-4">
      <h4>{intl.formatMessage(messages.gradeSummary)}</h4>
      <GradeSummaryTable
        assignmentPolicies={assignmentPolicies}
        gradeByAssignmentType={gradeByAssignmentType}
        totalGrade={totalGrade}
      />
    </section>
  );
}

GradeSummary.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(GradeSummary);
