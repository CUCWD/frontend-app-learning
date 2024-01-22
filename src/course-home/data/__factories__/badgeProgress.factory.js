import { Factory } from 'rosie'; // eslint-disable-line import/no-extraneous-dependencies

Factory.define('badge-progress')
  .attrs({
    course_id: 'course-v1:edX+DemoX+Demo_Course',
    block_id: 'block-v1:edX+DemoX+Demo_Course+type@chapter+block@dc1e160e5dc348a48a98fa0f4a6e8675',
    block_display_name: 'Example Week 1: Getting Started',
    event_type: 'chapter_complete',
  });

// Default to one badge_class. If badge_class was given, fill in
// whatever attributes might be missing.
// .attr('badge_class', ['badge_class'], (badge_class) => {
//   if (!badge_class) {
//     badge_class = [{}];
//   }
//   return badge_class.map((data) => Factory.attributes('badge_class', data));
// })

// Default to one assertion. If assertion was given, fill in
// whatever attributes might be missing.
// .attr('assertion', ['assertion'], (assertion) => {
//   if (!assertion) {
//     assertion = [{}];
//   }
//   return assertion.map((data) => Factory.attributes('assertion', data));
// })

//   {
//     course_id: "course-v1:edX+DemoX+Demo_Course",
//     block_id: "block-v1:edX+DemoX+Demo_Course+type@chapter+block@dc1e160e5dc348a48a98fa0f4a6e8675",
//     block_display_name: "Example Week 1: Getting Started",
//     event_type: "chapter_complete",
//     badge_class: {
//         slug: "special_award",
//         issuing_component: "openedx__course",
//         display_name: "Very Special Award",
//         course_id: "course-v1:edX+DemoX+Demo_Course",
//         description: "Awarded for people who did something incredibly special",
//         criteria: "Do something incredibly special.",
//         image: "http://example.com/media/badge_classes/badges/special_xdpqpBv_9FYOZwN.png"
//     },
//     assertion: {
//         issuedOn: "2019-04-20T02:43:06.566955Z",
//         expires: "2019-04-30T00:00:00.000000Z",
//         revoked: false,
//         image_url: "http://badges.example.com/media/issued/cd75b69fc1c979fcc1697c8403da2bdf.png",
//         assertion_url: "http://badges.example.com/public/assertions/07020647-e772-44dd-98b7-d13d34335ca6",
//         recipient: {
//             plaintextIdentity: "john.doe@example.com"
//         },
//         issuer: {
//             entityType: "Issuer",
//             entityId: "npqlh0acRFG5pKKbnb4SRg",
//             openBadgeId: "https://api.badgr.io/public/issuers/npqlh0acRFG5pKKbnb4SRg",
//             name: "EducateWorkforce",
//             image: "https://media.us.badgr.io/uploads/issuers/issuer_logo_77bb4498-838b-45b7-8722-22878fedb5e8.svg",
//             email: "cucwd.developer@gmail.com",
//             description: "An online learning solution offered with partnering 2-year colleges to help integrate web
// and digital solutions into their existing courses. The platform was designed by multiple instructional design,
// usability, and computing experts to include research-based learning features.",
//             url: "https://ew-localhost.com"
//         }
//     }
// },

Factory.define('badge_class')
  .attrs({
    slug: 'special_award',
    issuing_component: 'openedx__course',
    display_name: 'Very Special Award',
    course_id: 'course-v1:edX+DemoX+Demo_Course',
    description: 'Awarded for people who did something incredibly special',
    criteria: 'Do something incredibly special.',
    image: 'http://example.com/media/badge_classes/badges/special_xdpqpBv_9FYOZwN.png',
  });

Factory.define('assertion')
  .attrs({
    issuedOn: '2019-04-20T02:43:06.566955Z',
    expires: '2019-04-30T00:00:00.000000Z',
    revoked: false,
    image_url: 'http://badges.example.com/media/issued/cd75b69fc1c979fcc1697c8403da2bdf.png',
    assertion_url: 'http://badges.example.com/public/assertions/07020647-e772-44dd-98b7-d13d34335ca6',
  })

  // Default to one recipient. If recipient was given, fill in
  // whatever attributes might be missing.
  .attr('recipient', ['recipient'], (recipient) => {
    if (!recipient) {
      recipient = [{}]; // eslint-disable-line
    }
    return recipient.map((data) => Factory.attributes('recipient', data));
  })

  // Default to one issuer. If issuer was given, fill in
  // whatever attributes might be missing.
  .attr('issuer', ['issuer'], (issuer) => {
    if (!issuer) {
      issuer = [{}]; // eslint-disable-line
    }
    return issuer.map((data) => Factory.attributes('issuer', data));
  });

Factory.define('recipient')
  .attrs({
    plaintextIdentity: 'john.doe@example.com',
  });

Factory.define('issuer')
  .attrs({
    entityType: 'Issuer',
    entityId: 'npqlh0acRFG5pKKbnb4SRg',
    openBadgeId: 'https://api.badgr.io/public/issuers/npqlh0acRFG5pKKbnb4SRg',
    name: 'EducateWorkforce',
    image: 'https://media.us.badgr.io/uploads/issuers/issuer_logo_77bb4498-838b-45b7-8722-22878fedb5e8.svg',
    email: 'cucwd.developer@gmail.com',
    description: 'An online learning solution offered with partnering 2-year colleges to help integrate web and digital solutions into their existing courses. The platform was designed by multiple instructional design, usability, and computing experts to include research-based learning features.',
    url: 'https://ew-localhost.com',
  });
