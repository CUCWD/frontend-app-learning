/* eslint-disable import/prefer-default-export */

/**
 * Helper function to make a postEvent call to Iframe.
 * @param {object} iframe document.getElementById('iframeId');
 * @param {string} message with the name of the event
 * @param {object} messageTargets targets to send event
 */
export function postEventToIframe(iframe, message, messageTargets) {
  if (iframe !== null) {
    messageTargets.forEach(target => {
      iframe.contentWindow.postMessage(
        { message },
        target,
      );
    });
  }
}
