import React from 'react';
import TriggerButton from 'courseware/course/sidebar/TriggerButton';
import { ID } from 'courseware/course/sidebar/sidebars/outline/OutlineTrigger';

function SidebarOutlineTrigger() {
  return (
    <section className="d-flex mb-auto">
      <TriggerButton sidebarId={ID} />
    </section>
  );
}

SidebarOutlineTrigger.propTypes = {};

export default SidebarOutlineTrigger;
