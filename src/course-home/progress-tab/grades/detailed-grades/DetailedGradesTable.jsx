import React from 'react';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { DataTable } from '@edx/paragon';

import messages from '../messages';

function DetailedGradesTable({ intl, sectionScores }) {
  return (
    sectionScores.map((chapter) => {
        const subsectionScores = chapter.subsections.filter((subsection) => !!(subsection.hasGradedAssignment && subsection.showGrades && subsection.numPointsPossible > 0));
        return (
          <>
            {subsectionScores.length > 0 && (
              <div className="my-3">
                <DataTable
                  data={subsectionScores.map((subsection) => {
                    const title = <a href={subsection.url}>{subsection.displayName}</a>;
                    return ({
                    subsectionTitle: title,
                    score: `${subsection.numPointsEarned}/${subsection.numPointsPossible}`,
                  })})}
                  columns={[
                    {
                      Header: chapter.displayName,
                      accessor: 'subsectionTitle',
                    },
                    {
                      Header: `${intl.formatMessage(messages.score)}`,
                      accessor: 'score',
                    },
                  ]}
                >
                  <DataTable.Table />
                </DataTable>
              </div>
            )}
          </>
        );
      })
  );
}

DetailedGradesTable.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(DetailedGradesTable);
