import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import { Modal } from '@edx/paragon';
import messages from './messages';
import BookmarkButton from '../bookmark/BookmarkButton';
import { useModel } from '../../../generic/model-store';
import PageLoading from '../../../generic/PageLoading';
import { processEvent } from '../../../course-home/data/thunks';
import { fetchCourse } from '../../data/thunks';
/** [MM-P2P] Experiment */
import { MMP2PLockPaywall } from '../../../experiments/mm-p2p';

const HonorCode = React.lazy(() => import('./honor-code'));
const LockPaywall = React.lazy(() => import('./lock-paywall'));

/**
 * Feature policy for iframe, allowing access to certain courseware-related media.
 *
 * We must use the wildcard (*) origin for each feature, as courseware content
 * may be embedded in external iframes. Notably, xblock-lti-consumer is a popular
 * block that iframes external course content.

 * This policy was selected in conference with the edX Security Working Group.
 * Changes to it should be vetted by them (security@edx.org).
 */
const IFRAME_FEATURE_POLICY = (
  'microphone *; camera *; midi *; geolocation *; encrypted-media *'
);

/**
 * We discovered an error in Firefox where - upon iframe load - React would cease to call any
 * useEffect hooks until the user interacts with the page again.  This is particularly confusing
 * when navigating between sequences, as the UI partially updates leaving the user in a nebulous
 * state.
 *
 * We were able to solve this error by using a layout effect to update some component state, which
 * executes synchronously on render.  Somehow this forces React to continue it's lifecycle
 * immediately, rather than waiting for user interaction.  This layout effect could be anywhere in
 * the parent tree, as far as we can tell - we chose to add a conspicuously 'load bearing' (that's
 * a joke) one here so it wouldn't be accidentally removed elsewhere.
 *
 * If we remove this hook when one of these happens:
 * 1. React figures out that there's an issue here and fixes a bug.
 * 2. We cease to use an iframe for unit rendering.
 * 3. Firefox figures out that there's an issue in their iframe loading and fixes a bug.
 * 4. We stop supporting Firefox.
 * 5. An enterprising engineer decides to create a repo that reproduces the problem, submits it to
 *    Firefox/React for review, and they kindly help us figure out what in the world is happening
 *    so  we can fix it.
 *
 * This hook depends on the unit id just to make sure it re-evaluates whenever the ID changes.  If
 * we change whether or not the Unit component is re-mounted when the unit ID changes, this may
 * become important, as this hook will otherwise only evaluate the useLayoutEffect once.
 */
function useLoadBearingHook(id) {
  const setValue = useState(0)[1];
  useLayoutEffect(() => {
    setValue(currentValue => currentValue + 1);
  }, [id]);
}

export function sendUrlHashToFrame(frame) {
  const { hash } = window.location;
  if (hash) {
    // The url hash will be sent to LMS-served iframe in order to find the location of the
    // hash within the iframe.
    frame.contentWindow.postMessage({ hashName: hash }, `${getConfig().LMS_BASE_URL}`);
  }
}

function Unit({
  courseId,
  format,
  onLoaded,
  id,
  intl,
  notificationTrayVisible,
  /** [MM-P2P] Experiment */
  mmp2p,
}) {
  const { authenticatedUser } = useContext(AppContext);
  const view = authenticatedUser ? 'student_view' : 'public_view';
  let iframeUrl = `${getConfig().LMS_BASE_URL}/xblock/${id}?show_title=0&show_bookmark_button=0&recheck_access=1&view=${view}`;
  if (format) {
    iframeUrl += `&format=${format}`;
  }

  const [iframeHeight, setIframeHeight] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [modalOptions, setModalOptions] = useState({ open: false });
  const [shouldDisplayHonorCode, setShouldDisplayHonorCode] = useState(false);

  const unit = useModel('units', id);
  const course = useModel('coursewareMeta', courseId);
  const {
    contentTypeGatingEnabled,
    userNeedsIntegritySignature,
  } = course;

  const dispatch = useDispatch();
  // Do not remove this hook.  See function description.
  useLoadBearingHook(id);

  useEffect(() => {
    if (userNeedsIntegritySignature && unit.graded) {
      setShouldDisplayHonorCode(true);
    } else {
      setShouldDisplayHonorCode(false);
    }
  }, [userNeedsIntegritySignature]);

  // We use this ref so that we can hold a reference to the currently active event listener.
  const messageEventListenerRef = useRef(null);
  useEffect(() => {
    sendUrlHashToFrame(document.getElementById('unit-iframe'));
    function receiveMessage(event) {
      const { type, payload } = event.data;
      if (type === 'plugin.resize') {
        setIframeHeight(payload.height);
        if (!hasLoaded && iframeHeight === 0 && payload.height > 0) {
          setHasLoaded(true);
          if (onLoaded) {
            onLoaded();
          }
        }
      } else if (type === 'plugin.modal') {
        payload.open = true;
        setModalOptions(payload);
      } else if (event.data.offset) {
        // We listen for this message from LMS to know when the page needs to
        // be scrolled to another location on the page.
        window.scrollTo(0, event.data.offset + document.getElementById('unit-iframe').offsetTop);
      }
    }
    // If we currently have an event listener, remove it.
    if (messageEventListenerRef.current !== null) {
      global.removeEventListener('message', messageEventListenerRef.current);
      messageEventListenerRef.current = null;
    }
    // Now add our new receiveMessage handler as the event listener.
    global.addEventListener('message', receiveMessage);
    // And then save it to our ref for next time.
    messageEventListenerRef.current = receiveMessage;
    // When the component finally unmounts, use the ref to remove the correct handler.
    return () => global.removeEventListener('message', messageEventListenerRef.current);
  }, [id, setIframeHeight, hasLoaded, iframeHeight, setHasLoaded, onLoaded]);

  const estimatedTimeMinutes = parseInt(unit.estimatedTime / 60, 10) + (unit.estimatedTime % 60 > 0);

  return (
    <div className="unit">
      <h1 className="mb-0 h3">{unit.title}</h1>
      <BookmarkButton
        unitId={unit.id}
        isBookmarked={unit.bookmarked}
        isProcessing={unit.bookmarkedUpdateState === 'loading'}
      />

      { unit.estimatedTime && unit.showEstimatedTime  && 
        <span class="d-flex align-items-center" style={{ display: 'block', fontSize: '14px', color: '#0A3055' }}>
          <span class="pgn__stateful-btn-icon">
            <svg class="svg-inline--fa fa-bookmark fa-w-12 text-primary" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="60 0 384 512">
              <path d="M245,0C109.5,0,0,109.5,0,245s109.5,245,245,245s245-109.5,245-245S380.5,0,245,0z M245,449.3    c-112.6,0-204.3-91.7-204.3-204.3S132.4,40.7,245,40.7S449.3,132.4,449.3,245S357.6,449.3,245,449.3z"/>
              <path d="M290.9,224.1h-25v-95.9c0-11.5-9.4-20.9-20.9-20.9s-20.9,9.4-20.9,20.9V245c0,11.5,9.4,20.9,20.9,20.9h45.9    c11.5,0,20.9-9.4,20.9-20.9S302.3,224.1,290.9,224.1z"/>
            </svg>
          </span> 
          Estimated Completion Time: {estimatedTimeMinutes} {estimatedTimeMinutes === 1 ? 'min' : 'mins'} 
        </span>
      
      }
      { !mmp2p.state.isEnabled && contentTypeGatingEnabled && unit.containsContentTypeGatedContent && (
        <Suspense
          fallback={(
            <PageLoading
              srMessage={intl.formatMessage(messages['learn.loading.content.lock'])}
            />
          )}
        >
          <LockPaywall courseId={courseId} notificationTrayVisible={notificationTrayVisible} />
        </Suspense>
      )}
      { /** [MM-P2P] Experiment */ }
      { mmp2p.meta.showLock && (
        <MMP2PLockPaywall options={mmp2p} />
      )}
      {!mmp2p.meta.blockContent && shouldDisplayHonorCode && (
        <Suspense
          fallback={(
            <PageLoading
              srMessage={intl.formatMessage(messages['learn.loading.honor.code'])}
            />
          )}
        >
          <HonorCode courseId={courseId} />
        </Suspense>
      )}
      { /** [MM-P2P] Experiment (conditional) */ }
      {!mmp2p.meta.blockContent && !shouldDisplayHonorCode && !hasLoaded && (
        <PageLoading
          srMessage={intl.formatMessage(messages['learn.loading.learning.sequence'])}
        />
      )}
      {modalOptions.open && (
        <Modal
          body={(
            <>
              {modalOptions.body
                ? <div className="unit-modal">{ modalOptions.body }</div>
                : (
                  <iframe
                    title={modalOptions.title}
                    allow={IFRAME_FEATURE_POLICY}
                    frameBorder="0"
                    src={modalOptions.url}
                    style={{
                      width: '100%',
                      height: '100vh',
                    }}
                  />
                )}
            </>
          )}
          onClose={() => { setModalOptions({ open: false }); }}
          open
          dialogClassName="modal-lti"
        />
      )}
      { /** [MM-P2P] Experiment (conditional) */ }
      { !mmp2p.meta.blockContent && !shouldDisplayHonorCode && (
        <div className="unit-iframe-wrapper">
          <iframe
            id="unit-iframe"
            title={unit.title}
            src={iframeUrl}
            allow={IFRAME_FEATURE_POLICY}
            allowFullScreen
            height={iframeHeight}
            scrolling="no"
            referrerPolicy="origin"
            onLoad={() => {
              window.onmessage = function handleResetDates(e) {
                if (e.data.event_name) {
                  dispatch(processEvent(e.data, fetchCourse));
                }
              };
            }}
          />
        </div>
      )}
    </div>
  );
}

Unit.propTypes = {
  courseId: PropTypes.string.isRequired,
  format: PropTypes.string,
  id: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  onLoaded: PropTypes.func,
  notificationTrayVisible: PropTypes.bool.isRequired,
  /** [MM-P2P] Experiment */
  mmp2p: PropTypes.shape({
    state: PropTypes.shape({
      isEnabled: PropTypes.bool.isRequired,
    }),
    meta: PropTypes.shape({
      showLock: PropTypes.bool,
      blockContent: PropTypes.bool,
    }),
  }),
};

Unit.defaultProps = {
  format: null,
  onLoaded: undefined,
  /** [MM-P2P] Experiment */
  mmp2p: {
    state: {
      isEnabled: false,
    },
    meta: {
      showLock: false,
      blockContent: false,
    },
  },
};

export default injectIntl(Unit);
