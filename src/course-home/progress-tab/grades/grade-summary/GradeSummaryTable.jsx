import React from 'react';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { DataTable } from '@edx/paragon';

import messages from '../messages';

function GradeSummaryTable({ assignmentPolicies, gradeByAssignmentType, intl, totalGrade }) {
  return (
    <DataTable
      data={assignmentPolicies.map((assignment) => {
        const weightedGrade = (
          gradeByAssignmentType[assignment.type].numPointsPossible > 0) ?
          ((gradeByAssignmentType[assignment.type].numPointsEarned * assignment.weight * 100) / gradeByAssignmentType[assignment.type].numPointsPossible).toFixed(0)
          : 0;

        return {
          type: assignment.type,
          weight: `${assignment.weight*100}%`,
          score: `${gradeByAssignmentType[assignment.type].numPointsEarned}/${gradeByAssignmentType[assignment.type].numPointsPossible}`,
          weightedGrade: `${weightedGrade}%`
        }
      })}
      columns={[
        {
          Header: `${intl.formatMessage(messages.assignmentType)}`,
          accessor: 'type',
        },
        {
          Header: `${intl.formatMessage(messages.weight)}`,
          accessor: 'weight',
          className: 'text-right',
        },
        {
          Header: `${intl.formatMessage(messages.score)}`,
          accessor: 'score',
          className: 'text-right',
        },
        {
          Header: `${intl.formatMessage(messages.weightedGrade)}`,
          accessor: 'weightedGrade',
          className: 'text-right',
        },
      ]}
    >
      <DataTable.Table />
      <DataTable.TableFooter className="border-top border-primary bg-warning-200">
        <div className="row w-100 m-0">
          <div className="col-8 p-0">{intl.formatMessage(messages.weightedGradeSummary)}</div>
          <div className="col-4 p-0 text-right">{totalGrade}%</div>
        </div>
      </DataTable.TableFooter>
    </DataTable>
  );
}

GradeSummaryTable.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(GradeSummaryTable);
