import { defineMessages } from '@edx/frontend-platform/i18n';

const messagesBadgeProgress = defineMessages({
  failure: {
    id: 'badge.progress.loading.failure',
    defaultMessage: 'There was an error loading the course badge progress.',
    description: 'Message when course badge progress page fails to load',
  },
  loading: {
    id: 'badge.progress.loading',
    defaultMessage: 'Loading course badge progress page...',
    description: 'Message when course badge progress page is being loaded',
  },
});

export default messagesBadgeProgress;
