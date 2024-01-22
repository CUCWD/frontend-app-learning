import { Factory } from 'rosie'; // eslint-disable-line import/no-extraneous-dependencies

import './badgeProgress.factory';

// Sample data helpful when developing & testing, to see a variety of configurations.
// This set of data is not realistic (mix of having access and not), but it
// is intended to demonstrate many UI results.
Factory.define('badgeProgressTabData')
  .sequence('id', (i) => `course-v1:edX+DemoX+Demo_Course_${i}`)
  .sequence('user_id')
  .attrs({
    user_name: 'TestUser',
    name: 'Test Username',
    email: 'test@edx.org',
  })
  .attrs(
    'progress', ['id'], (id) => { // eslint-disable-line
      const progress = [
        Factory.build(
          'badge-progress',
          {
            course_id: 'course-v1:edX+DemoX+Demo_Course',
            block_id: 'block-v1:edX+DemoX+Demo_Course+type@chapter+block@dc1e160e5dc348a48a98fa0f4a6e8675',
            block_display_name: 'Example Week 1: Getting Started',
            event_type: 'chapter_complete',
            badge_class: {
              slug: 'special_award',
              issuing_component: 'openedx__course',
              display_name: 'Very Special Award',
              course_id: 'course-v1:edX+DemoX+Demo_Course',
              description: 'Awarded for people who did something incredibly special',
              criteria: 'Do something incredibly special.',
              image: 'http://example.com/media/badge_classes/badges/special_xdpqpBv_9FYOZwN.png',
            },
            assertion: {
              issuedOn: '2019-04-20T02:43:06.566955Z',
              expires: '2019-04-30T00:00:00.000000Z',
              revoked: false,
              image_url: 'http://badges.example.com/media/issued/cd75b69fc1c979fcc1697c8403da2bdf.png',
              assertion_url: 'http://badges.example.com/public/assertions/07020647-e772-44dd-98b7-d13d34335ca6',
              recipient: {
                plaintextIdentity: 'john.doe@example.com',
              },
              issuer: {
                entityType: 'Issuer',
                entityId: 'npqlh0acRFG5pKKbnb4SRg',
                openBadgeId: 'https://api.badgr.io/public/issuers/npqlh0acRFG5pKKbnb4SRg',
                name: 'EducateWorkforce',
                image: 'https://media.us.badgr.io/uploads/issuers/issuer_logo_77bb4498-838b-45b7-8722-22878fedb5e8.svg',
                email: 'cucwd.developer@gmail.com',
                description: 'An online learning solution offered with partnering 2-year colleges to help integrate web and digital solutions into their existing courses. The platform was designed by multiple instructional design, usability, and computing experts to include research-based learning features.',
                url: 'https://ew-localhost.com',
              },
            },
          },
        ),
      ];

      return progress;
    },
  );
