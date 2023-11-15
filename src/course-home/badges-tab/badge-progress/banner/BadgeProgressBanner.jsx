import React from 'react';
 import PropTypes from 'prop-types';
 import classNames from 'classnames';

 const BadgeProgressBanner = ({ hasProgress, hasRights }) => {
   const indicatorProgress = (hasProgress ? '' : 'no-progress');

   const getPathTitle = () => (hasRights ? 'Class Progress' : 'My Learning Path');

   const getPathSubHeading = () => (
     hasRights
       ? "Here is all learner progress through the badges available for this course. Click each badge to learn more about an individual student's credential."
       : "Here is your progress through the badges available for this course. Click each badge to learn more or to save and share badges you've earned."
   );

   // d-flex justify-content-left
   return (
     <div className={[classNames('row', 'learningpath', indicatorProgress, 'mb-4', 'pt-4', 'pb-4', 'pr-5', 'pl-5')]}>
       { hasProgress && (
         <>
           <div className="row w-100">
             <h2 className="col">{getPathTitle()}</h2>
           </div>
           <div className="row w-100">
             <p className="col">
               {getPathSubHeading()}
             </p>
           </div>
         </>
       )}

       { !hasProgress && (
         <h2>This course either has no learner progress or is not setup for badging.</h2>
       )}
     </div>
   );
 };

 BadgeProgressBanner.propTypes = {
   hasProgress: PropTypes.bool.isRequired,
   hasRights: PropTypes.bool.isRequired,
 };

 export default BadgeProgressBanner;