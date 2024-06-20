import React from 'react';
import { SIDEBAR_ORDER } from './sidebars';
import TriggerButton from './TriggerButton';

function SidebarTriggers() {
  return (
    <section className="d-flex ml-auto">
      {SIDEBAR_ORDER.map((sidebarId) => (
        <TriggerButton sidebarId={sidebarId} />
      ))}
    </section>
  );
}

SidebarTriggers.propTypes = {};

export default SidebarTriggers;
