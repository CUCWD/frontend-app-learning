import * as outline from 'courseware/course/sidebar/sidebars/outline';
import * as notifications from 'courseware/course/sidebar/sidebars/notifications';
import * as discusssions from 'courseware/course/sidebar/sidebars/discussions';

export const SIDEBARS = {
  [outline.ID]: {
    ID: outline.ID,
    Sidebar: outline.Sidebar,
    Trigger: outline.Trigger,
  },
  [notifications.ID]: {
    ID: notifications.ID,
    Sidebar: notifications.Sidebar,
    Trigger: notifications.Trigger,
  },
  [discusssions.ID]: {
    ID: discusssions.ID,
    Sidebar: discusssions.Sidebar,
    Trigger: discusssions.Trigger,
  },
};

export const SIDEBAR_ORDER = [
  discusssions.ID,
  notifications.ID,
];
