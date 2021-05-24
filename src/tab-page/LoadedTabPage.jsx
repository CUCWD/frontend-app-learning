import React from 'react';
import PropTypes from 'prop-types';

// import { Header, CourseTabsNavigation } from '../course-header';
// import { useModel } from '../model-store';
import { useEnrollmentAlert } from '../enrollment-alert';
// import InstructorToolbar from '../courseware/course/InstructorToolbar';

function LoadedTabPage({
  // eslint-disable-next-line no-unused-vars
  activeTabSlug,
  children,
  courseId,
  // eslint-disable-next-line no-unused-vars
  unitId,
}) {
  useEnrollmentAlert(courseId);

  // const {
  //   isStaff,
  //   number,
  //   org,
  //   tabs,
  //   title,
  // } = useModel('courses', courseId);

  // <Header
  //       courseOrg={org}
  //       courseNumber={number}
  //       courseTitle={title}
  //     />
  // {isStaff && (
  //   <InstructorToolbar
  //     courseId={courseId}
  //     unitId={unitId}
  //   />
  // )}
  return (
    <>
      <main className="d-flex flex-column flex-grow-1">
        {/* <CourseTabsNavigation tabs={tabs} className="mb-3" activeTabSlug={activeTabSlug} /> */}
        <div className="container-fluid">
          {children}
        </div>
      </main>
    </>
  );
}

LoadedTabPage.propTypes = {
  activeTabSlug: PropTypes.string.isRequired,
  children: PropTypes.node,
  courseId: PropTypes.string.isRequired,
  unitId: PropTypes.string,
};

LoadedTabPage.defaultProps = {
  children: null,
  unitId: null,
};

export default LoadedTabPage;
