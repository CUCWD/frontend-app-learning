import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { history } from '@edx/frontend-platform';
import { getLocale } from '@edx/frontend-platform/i18n';
import { Redirect } from 'react-router';
import { createSelector } from '@reduxjs/toolkit';
import { defaultMemoize as memoize } from 'reselect';

import {
  checkBlockCompletion,
  fetchCourse,
  fetchSequence,
  getResumeBlock,
  saveSequencePosition,
} from './data';
import { TabPage } from '../tab-page';

import Course from './course';
import { handleNextSectionCelebration } from './course/celebration';

const checkExamRedirect = memoize((sequenceStatus, sequence) => {
  if (sequenceStatus === 'loaded') {
    if (sequence.isTimeLimited && sequence.lmsWebUrl !== undefined) {
      global.location.assign(sequence.lmsWebUrl);
    }
  }
});

const checkReinterpretPositionRedirect = memoize(
  (courseStatus, courseId, sequenceStatus, routeSequenceId, courseTree) => {
    if (courseStatus === 'loaded' && sequenceStatus === 'failed' && routeSequenceId) {
      if (courseId === routeSequenceId) {
        history.replace(`/course/${courseId}`);
      } else if (courseTree) {
        courseTree.forEach(sectionId => {
          const sectionTree = courseTree[sectionId] || {};
          if (sectionId === routeSequenceId) {
            if (sectionTree && sectionTree[sectionId]) {
              const firstSequenceInSectionId = sectionTree[sectionId][0];
              history.replace(`/course/${courseId}/${firstSequenceInSectionId}`);
            } else {
              history.replace(`/course/${courseId}`);
            }
          } else {
            sectionTree.forEach(sequenceId => {
              const sequenceTree = sectionTree[sectionId] || {};
              sequenceTree.forEach(unitId => {
                if (unitId === routeSequenceId) {
                  history.replace(`/course/${courseId}/${sequenceId}/${unitId}`);
                }
              });
            });
          }
        });
      }
    }
  },
);

const checkResumeRedirect = memoize((courseStatus, courseId, sequenceId, firstSequenceId) => {
  if (courseStatus === 'loaded' && !sequenceId) {
    // Note that getResumeBlock is just an API call, not a redux thunk.
    getResumeBlock(courseId).then((data) => {
      // This is a replace because we don't want this change saved in the browser's history.
      if (data.sectionId && data.unitId) {
        history.replace(`/course/${courseId}/${data.sectionId}/${data.unitId}`);
      } else if (firstSequenceId) {
        history.replace(`/course/${courseId}/${firstSequenceId}`);
      }
    });
  }
});

const checkSequenceToUnitRedirect = memoize((courseId, sequenceStatus, sequenceId, sequence, unitId) => {
  if (sequenceStatus === 'loaded' && sequenceId && !unitId) {
    if (sequence.unitIds !== undefined && sequence.unitIds.length > 0) {
      const nextUnitId = sequence.unitIds[sequence.activeUnitIndex];
      // This is a replace because we don't want this change saved in the browser's history.
      history.replace(`/course/${courseId}/${sequence.id}/${nextUnitId}`);
    }
  }
});

class CoursewareContainer extends Component {
  checkSaveSequencePosition = memoize((unitId) => {
    const {
      courseId,
      sequenceId,
      sequenceStatus,
      sequence,
    } = this.props;
    if (sequenceStatus === 'loaded' && sequence.saveUnitPosition && unitId) {
      const activeUnitIndex = sequence.unitIds.indexOf(unitId);
      this.props.saveSequencePosition(courseId, sequenceId, activeUnitIndex);
    }
  });

  checkFetchCourse = memoize((courseId) => {
    this.props.fetchCourse(courseId);
  });

  checkFetchSequence = memoize((sequenceId) => {
    if (sequenceId) {
      this.props.fetchSequence(sequenceId);
    }
  });

  componentDidMount() {
    const {
      match: {
        params: {
          courseId: routeCourseId,
          sequenceId: routeSequenceId,
        },
      },
    } = this.props;
    // Load data whenever the course or sequence ID changes.
    this.checkFetchCourse(routeCourseId);
    this.checkFetchSequence(routeSequenceId);
  }

  componentDidUpdate() {
    const {
      courseId,
      sequenceId,
      courseStatus,
      sequenceStatus,
      sequence,
      firstSequenceId,
      currentCourseTree,
      match: {
        params: {
          courseId: routeCourseId,
          sequenceId: routeSequenceId,
          unitId: routeUnitId,
        },
      },
    } = this.props;

    // Load data whenever the course or sequence ID changes.
    this.checkFetchCourse(routeCourseId);
    this.checkFetchSequence(routeSequenceId);

    // If the sequenceId was bad, perhaps we can recover by interpreting it as
    // a courseId, sectionId, or unitId.
    checkReinterpretPositionRedirect(courseStatus, courseId, sequenceStatus, routeSequenceId, currentCourseTree);

    // Redirect to the legacy experience for exams.
    checkExamRedirect(sequenceStatus, sequence);

    // Determine if we need to redirect because the URL gave a sequenceId but not a unitId.
    checkSequenceToUnitRedirect(courseId, sequenceStatus, sequenceId, sequence, routeUnitId);

    // Determine if we can resume where we left off.
    checkResumeRedirect(courseStatus, courseId, sequenceId, firstSequenceId);

    // Check if we should save our sequence position.  Only do this when the route unit ID changes.
    this.checkSaveSequencePosition(routeUnitId);
  }

  handleUnitNavigationClick = (nextUnitId) => {
    const {
      courseId, sequenceId,
      match: {
        params: {
          unitId: routeUnitId,
        },
      },
    } = this.props;

    this.props.checkBlockCompletion(courseId, sequenceId, routeUnitId);
    history.push(`/course/${courseId}/${sequenceId}/${nextUnitId}`);
  }

  handleNextSequenceClick = () => {
    const {
      course,
      courseId,
      nextSequence,
      sequence,
      sequenceId,
    } = this.props;

    if (nextSequence !== null) {
      let nextUnitId = null;
      if (nextSequence.unitIds.length > 0) {
        [nextUnitId] = nextSequence.unitIds;
        history.push(`/course/${courseId}/${nextSequence.id}/${nextUnitId}`);
      } else {
        // Some sequences have no units.  This will show a blank page with prev/next buttons.
        history.push(`/course/${courseId}/${nextSequence.id}`);
      }

      const celebrateFirstSection = course && course.celebrations && course.celebrations.firstSection;
      if (celebrateFirstSection && sequence.sectionId !== nextSequence.sectionId) {
        handleNextSectionCelebration(sequenceId, nextSequence.id, nextUnitId);
      }
    }
  }

  handlePreviousSequenceClick = () => {
    const { previousSequence, courseId } = this.props;
    if (previousSequence !== null) {
      if (previousSequence.unitIds.length > 0) {
        const previousUnitId = previousSequence.unitIds[previousSequence.unitIds.length - 1];
        history.push(`/course/${courseId}/${previousSequence.id}/${previousUnitId}`);
      } else {
        // Some sequences have no units.  This will show a blank page with prev/next buttons.
        history.push(`/course/${courseId}/${previousSequence.id}`);
      }
    }
  }

  renderDenied() {
    const {
      course,
      courseId,
      match: {
        params: {
          unitId: routeUnitId,
        },
      },
    } = this.props;
    let url = `/redirect/course-home/${courseId}`;
    switch (course.canLoadCourseware.errorCode) {
      case 'audit_expired':
        url = `/redirect/dashboard?access_response_error=${course.canLoadCourseware.additionalContextUserMessage}`;
        break;
      case 'course_not_started':
        // eslint-disable-next-line no-case-declarations
        const startDate = (new Intl.DateTimeFormat(getLocale())).format(new Date(course.start));
        url = `/redirect/dashboard?notlive=${startDate}`;
        break;
      case 'survey_required': // TODO: Redirect to the course survey
      case 'unfulfilled_milestones':
        url = '/redirect/dashboard';
        break;
      case 'microfrontend_disabled':
        url = `/redirect/courseware/${courseId}/unit/${routeUnitId}`;
        break;
      case 'authentication_required':
      case 'enrollment_required':
      default:
    }
    return (
      <Redirect to={url} />
    );
  }

  render() {
    const {
      courseStatus,
      courseId,
      sequenceId,
      match: {
        params: {
          unitId: routeUnitId,
        },
      },
    } = this.props;

    if (courseStatus === 'denied') {
      return this.renderDenied();
    }

    return (
      <TabPage
        activeTabSlug="courseware"
        courseId={courseId}
        unitId={routeUnitId}
        courseStatus={courseStatus}
        metadataModel="coursewareMeta"
      >
        <Course
          courseId={courseId}
          sequenceId={sequenceId}
          unitId={routeUnitId}
          nextSequenceHandler={this.handleNextSequenceClick}
          previousSequenceHandler={this.handlePreviousSequenceClick}
          unitNavigationHandler={this.handleUnitNavigationClick}
        />
      </TabPage>
    );
  }
}

const sequenceShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  unitIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  isTimeLimited: PropTypes.bool,
  lmsWebUrl: PropTypes.string,
});

const courseShape = PropTypes.shape({
  canLoadCourseware: PropTypes.shape({
    errorCode: PropTypes.string,
    additionalContextUserMessage: PropTypes.string,
  }).isRequired,
});

CoursewareContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
      sequenceId: PropTypes.string,
      unitId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  courseId: PropTypes.string,
  sequenceId: PropTypes.string,
  firstSequenceId: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  currentCourseTree: PropTypes.object,
  courseStatus: PropTypes.oneOf(['loaded', 'loading', 'failed', 'denied']).isRequired,
  sequenceStatus: PropTypes.oneOf(['loaded', 'loading', 'failed']).isRequired,
  nextSequence: sequenceShape,
  previousSequence: sequenceShape,
  course: courseShape,
  sequence: sequenceShape,
  saveSequencePosition: PropTypes.func.isRequired,
  checkBlockCompletion: PropTypes.func.isRequired,
  fetchCourse: PropTypes.func.isRequired,
  fetchSequence: PropTypes.func.isRequired,
};

CoursewareContainer.defaultProps = {
  courseId: null,
  sequenceId: null,
  firstSequenceId: null,
  nextSequence: null,
  previousSequence: null,
  course: null,
  sequence: null,
  currentCourseTree: null,
};

const currentCourseSelector = createSelector(
  (state) => state.models.coursewareMeta || {},
  (state) => state.courseware.courseId,
  (coursesById, courseId) => (coursesById[courseId] ? coursesById[courseId] : null),
);

const currentCourseTreeSelector = createSelector(
  currentCourseSelector,
  (state) => state.models.sections,
  (state) => state.models.sequences,
  (course, sectionsById, sequencesById) => {
    const courseTree = {};
    if (course) {
      course.sectionIds.forEach(sectionId => {
        courseTree[sectionId] = {};
        const section = sectionsById[sectionId];
        if (section) {
          section.sequenceIds.forEach(sequenceId => {
            const sequence = sequencesById[sequenceId];
            courseTree[sectionId][sequenceId] = sequence ? sequence.unitIds : {};
          });
        }
      });
    }
    return courseTree;
  },
);

const currentSequenceSelector = createSelector(
  (state) => state.models.sequences || {},
  (state) => state.courseware.sequenceId,
  (sequencesById, sequenceId) => (sequencesById[sequenceId] ? sequencesById[sequenceId] : null),
);

const currentCourseSequenceIdsSelector = createSelector(
  (state) => state.courseware.courseStatus,
  currentCourseSelector,
  (state) => state.models.sections,
  (courseStatus, course, sectionsById) => {
    if (courseStatus !== 'loaded') {
      return [];
    }
    const { sectionIds = [] } = course;
    return sectionIds.flatMap(sectionId => sectionsById[sectionId].sequenceIds);
  },
);

const previousSequenceSelector = createSelector(
  currentCourseSequenceIdsSelector,
  (state) => state.models.sequences || {},
  (state) => state.courseware.sequenceId,
  (sequenceIds, sequencesById, sequenceId) => {
    if (!sequenceId || sequenceIds.length === 0) {
      return null;
    }
    const sequenceIndex = sequenceIds.indexOf(sequenceId);
    const previousSequenceId = sequenceIndex > 0 ? sequenceIds[sequenceIndex - 1] : null;
    return previousSequenceId !== null ? sequencesById[previousSequenceId] : null;
  },
);

const nextSequenceSelector = createSelector(
  currentCourseSequenceIdsSelector,
  (state) => state.models.sequences || {},
  (state) => state.courseware.sequenceId,
  (sequenceIds, sequencesById, sequenceId) => {
    if (!sequenceId || sequenceIds.length === 0) {
      return null;
    }
    const sequenceIndex = sequenceIds.indexOf(sequenceId);
    const nextSequenceId = sequenceIndex < sequenceIds.length - 1 ? sequenceIds[sequenceIndex + 1] : null;
    return nextSequenceId !== null ? sequencesById[nextSequenceId] : null;
  },
);

const firstSequenceIdSelector = createSelector(
  (state) => state.courseware.courseStatus,
  currentCourseSelector,
  (state) => state.models.sections || {},
  (courseStatus, course, sectionsById) => {
    if (courseStatus !== 'loaded') {
      return null;
    }
    const { sectionIds = [] } = course;

    if (sectionIds.length === 0) {
      return null;
    }

    return sectionsById[sectionIds[0]].sequenceIds[0];
  },
);

const mapStateToProps = (state) => {
  const {
    courseId, sequenceId, courseStatus, sequenceStatus,
  } = state.courseware;

  return {
    courseId,
    sequenceId,
    courseStatus,
    sequenceStatus,
    course: currentCourseSelector(state),
    sequence: currentSequenceSelector(state),
    previousSequence: previousSequenceSelector(state),
    nextSequence: nextSequenceSelector(state),
    firstSequenceId: firstSequenceIdSelector(state),
    currentCourseTree: currentCourseTreeSelector(state),
  };
};

export default connect(mapStateToProps, {
  checkBlockCompletion,
  saveSequencePosition,
  fetchCourse,
  fetchSequence,
})(CoursewareContainer);
