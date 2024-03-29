import { ensureConfig, getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import React, { useContext } from 'react';
import SidebarBase from '../../common/SidebarBase';
import SidebarContext from '../../SidebarContext';
import { ID } from './OutlineTrigger';

import messages from './messages';

ensureConfig(['SIDEBAR_MFE_BASE_URL']);

function OutlineSidebar({
  intl,
}) {
  const {
    courseId,
    unitId,
  } = useContext(SidebarContext);
  const outlineUrl = `${getConfig().SIDEBAR_MFE_BASE_URL}/${courseId}/${unitId}`;
  return (
    <SidebarBase
      title={intl.formatMessage(messages.outlineTitle)}
      ariaLabel={intl.formatMessage(messages.outlineTitle)}
      sidebarId={ID}
      width="40rem"
      showTitleBar={false}
    >
      <iframe
        id="OutlineSidebar"
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
