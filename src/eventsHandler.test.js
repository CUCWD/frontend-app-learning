import { postEventToIframe } from './eventsHandler';

describe('postEventToIframe', () => {
  test('sends a message to the iframe', () => {
    const iframe = {
      contentWindow: {
        postMessage: jest.fn(),
      },
    };
    const message = 'event_sucess';
    const messageTargets = ['http://localhost:2000'];

    postEventToIframe(iframe, message, messageTargets);

    expect(iframe.contentWindow.postMessage).toHaveBeenCalledWith(
      { message },
      messageTargets[0],
    );
  });

  test('if iframe is null, does not call postMessage', () => {
    const iframe = null;
    const message = 'event_success';
    const messageTargets = ['http://localhost:2000'];
    const postMessageMock = jest.fn();

    postEventToIframe(iframe, message, messageTargets);

    expect(postMessageMock).not.toHaveBeenCalled();
  });
});
