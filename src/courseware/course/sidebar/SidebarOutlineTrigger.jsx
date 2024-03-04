import React from 'react';
import TriggerButton from './TriggerButton';
import { ID } from './sidebars/outline/OutlineTrigger';

function SidebarOutlineTrigger() {
  return (
    <section className="d-flex mb-auto">
      <TriggerButton sidebarId={ID} />
    </section>
  );
}

SidebarOutlineTrigger.propTypes = {};

export default SidebarOutlineTrigger;
