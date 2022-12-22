import { ensureConfig, getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import React, { useContext } from 'react';
import SidebarBase from 'courseware/course/sidebar/common/SidebarBase';
import SidebarContext from 'courseware/course/sidebar/SidebarContext';
import { ID } from 'courseware/course/sidebar/sidebars/outline/OutlineTrigger';

import messages from './messages';

ensureConfig(['SIDEBAR_MFE_BASE_URL']);

function OutlineSidebar({ intl }) {
  const {
    courseId,
  } = useContext(SidebarContext);

  const outlineUrl = `${getConfig().SIDEBAR_MFE_BASE_URL}/${courseId}`;
  return (
    <SidebarBase
      title={intl.formatMessage(messages.outlineTitle)}
      ariaLabel={intl.formatMessage(messages.outlineTitle)}
      sidebarId={ID}
      width="40rem"
      showTitleBar={false}
    >
      <iframe
        src={`${outlineUrl}?inContext`}
        className="d-flex w-100 border-0"
        style={{ minHeight: '60rem' }}
        title={intl.formatMessage(messages.outlineTitle)}
      />
    </SidebarBase>
  );
}

OutlineSidebar.propTypes = {
  intl: intlShape.isRequired,
};

OutlineSidebar.Trigger = OutlineSidebar;
OutlineSidebar.ID = ID;

export default injectIntl(OutlineSidebar);
