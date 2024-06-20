import { ensureConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Icon } from '@edx/paragon';
import { ExpandMore } from '@edx/paragon/icons';
import PropTypes from 'prop-types';
import React from 'react';
import SidebarTriggerBase from '../../common/TriggerBase';
import messages from './messages';

ensureConfig(['SIDEBAR_MFE_BASE_URL']);
export const ID = 'OUTLINE';

function OutlineTrigger({
  intl,
  onClick,
}) {
  return (
    <SidebarTriggerBase onClick={onClick} ariaLabel={intl.formatMessage(messages.openOutlineTrigger)}>
      <Icon src={ExpandMore} className="m-0 m-auto" />
    </SidebarTriggerBase>
  );
}

OutlineTrigger.propTypes = {
  intl: intlShape.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default injectIntl(OutlineTrigger);
