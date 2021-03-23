import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const getSequenceXModuleHandlerUrl = (courseId, sequenceId) => `${getConfig().LMS_BASE_URL}/courses/${courseId}/xblock/${sequenceId}/handler/xmodule_handler`;

export function normalizeBlocks(courseId, blocks) {
  const models = {
    courses: {},
    sections: {},
    sequences: {},
    units: {},
  };
  Object.values(blocks).forEach(block => {
    switch (block.type) {
      case 'course':
        models.courses[block.id] = {
          id: courseId,
          title: block.display_name,
          sectionIds: block.children || [],
        };
        break;
      case 'chapter':
        models.sections[block.id] = {
          id: block.id,
          title: block.display_name,
          sequenceIds: block.children || [],
        };
        break;

      case 'sequential':
        models.sequences[block.id] = {
          id: block.id,
          title: block.display_name,
          lmsWebUrl: block.lms_web_url,
          unitIds: block.children || [],
        };
        break;
      case 'vertical':
        models.units[block.id] = {
          graded: block.graded,
          id: block.id,
          title: block.display_name,
          lmsWebUrl: block.lms_web_url,
        };
        break;
      default:
        logError(`Unexpected course block type: ${block.type} with ID ${block.id}.  Expected block types are course, chapter, sequential, and vertical.`);
    }
  });

  // Next go through each list and use their child lists to decorate those children with a
  // reference back to their parent.
  Object.values(models.courses).forEach(course => {
    if (Array.isArray(course.sectionIds)) {
      course.sectionIds.forEach(sectionId => {
        const section = models.sections[sectionId];
        section.courseId = course.id;
      });
    }
  });

  Object.values(models.sections).forEach(section => {
    if (Array.isArray(section.sequenceIds)) {
      section.sequenceIds.forEach(sequenceId => {
        if (sequenceId in models.sequences) {
          models.sequences[sequenceId].sectionId = section.id;
        } else {
          logError(`Section ${section.id} has child block ${sequenceId}, but that block is not in the list of sequences.`);
        }
      });
    }
  });

  Object.values(models.sequences).forEach(sequence => {
    if (Array.isArray(sequence.unitIds)) {
      sequence.unitIds.forEach(unitId => {
        if (unitId in models.units) {
          models.units[unitId].sequenceId = sequence.id;
        } else {
          logError(`Sequence ${sequence.id} has child block ${unitId}, but that block is not in the list of units.`);
        }
      });
    }
  });

  return models;
}

export async function getBlockCompletion(courseId, sequenceId, usageKey) {
  // Post data sent to this endpoint must be url encoded
  // TODO: Remove the need for this to be the case.
  // TODO: Ensure this usage of URLSearchParams is working in Internet Explorer
  const urlEncoded = new URLSearchParams();
  urlEncoded.append('usage_key', usageKey);
  const requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };

  const { data } = await getAuthenticatedHttpClient().post(
    `${getSequenceXModuleHandlerUrl(courseId, sequenceId)}/get_completion`,
    urlEncoded.toString(),
    requestConfig,
  );

  if (data.complete) {
    return true;
  }

  return false;
}

export async function updateSequencePosition(courseId, sequenceId, position) {
  // Post data sent to this endpoint must be url encoded
  // TODO: Remove the need for this to be the case.
  // TODO: Ensure this usage of URLSearchParams is working in Internet Explorer
  const urlEncoded = new URLSearchParams();
  // Position is 1-indexed on the server and 0-indexed in this app. Adjust here.
  urlEncoded.append('position', position + 1);
  const requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };

  const { data } = await getAuthenticatedHttpClient().post(
    `${getSequenceXModuleHandlerUrl(courseId, sequenceId)}/goto_position`,
    urlEncoded.toString(),
    requestConfig,
  );

  return data;
}
