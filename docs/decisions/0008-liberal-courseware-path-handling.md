# Liberal coursesware path handling

## Status

Accepted

_This updates some of the content in [ADR #2: Courseware page decisions](./0002-courseware-page-decisions.md)._

## Context

The courseware container currently accepts three path forms:

1. `/course/:courseId`
2. `/course/:courseId/:sequenceId`
3. `/course/:courseId/:sequenceId/:unitId`

Forms #1 and #2 are always redirected to Form #3 via simple set of rules:

* If the sequenceId is not specified, choose the first sequence in the course.
* If the unitId is not specified, choose the active unit in the sequence,
  or the first unit if none are active.

Thus, Form #3 is effectively the canonoical path;
all Learning MFE units should be served from it.
We acknowledge that the best user experience is to link directly to the canonoical
path when possible, since it skips the redirection steps.
Still, there are times when it is necessary or prudent to link just to a course or
a sequence.

Through recent work in the LMS, we are realizing that there are _also_ times where it
would be simpler or more performant to link a user to an
_entire section without specifying a squence_ or to a
_unit without including the sequence_.
Specifically, this capability would let as avoid further modulestore or
block transformer queries in order to discern the course structure when trying to
direct a learner to a section or unit.
Futhermore, we hypothesize that being able to build a Learning MFE courseware link
with just a unit ID or a section ID will be a nice simplifying quality for future
development or debugging.

## Decision

The courseware container will accept six total path forms:

1. `/course/:courseId`
2. `/course/:courseId/:courseId`
3. `/course/:courseId/:sectionId`
4. `/course/:courseId/:sequenceId`
5. `/course/:courseId/:unitId`
6. `/course/:courseId/:sequenceId/:unitId`

Form #2 may seem silly, but exists so that the URL can be generally formulated as:
`/course/:courseId/:navigationalBlockId`
for any navigational block (course, section, sequence, or unit) in the course.

The redirection rules are as follows:

* Forms #1 and #2 redirect to Form #4 by selecting the first sequence in the course.
* Form #3 redirects to Form #4 by selection to the first sequence in the section.
* Form #4 redirects to Form #6 by choosing the active unit in the sequence
  (or the first unit, if none are active).
* Form #5 redirects to Form #6 by filling in the ID of the sequence that the
  specified unit belongs to (in the edge case where the unit belongs to multiple
  sequences, the first sequence is selected).

As before, Form #6 is the canonocial courseware path, which is always redirected to
by any of the other courseware path forms.

## Consequences

The above decision is implemented.
