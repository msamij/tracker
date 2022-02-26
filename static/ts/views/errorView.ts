import { TIMEOUT_SEC } from '@utils/config';

/**
 * @param element DOM node in which error message should be displayed.
 * @param errMessage Actual error text which should be displayed in the element node.
 */
export function renderMessage(element: HTMLElement, errMessage: string): void {
  element.textContent = errMessage;
  element.style.visibility = 'visible';
  element.style.opacity = '1';

  window.setTimeout(function () {
    element.style.visibility = 'hidden';
    element.style.opacity = '0';
  }, TIMEOUT_SEC);
}
