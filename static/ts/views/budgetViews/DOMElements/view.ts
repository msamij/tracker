/**
 * This Class contains common DOM elements.
 **/
class ViewElements {
  getOverlay(): HTMLDivElement {
    return document.querySelector('.overlay');
  }
  getContainer(): HTMLDivElement {
    return document.querySelector('.container');
  }
  getMessageElement(): HTMLDivElement {
    return document.querySelector('.message');
  }
}

export default new ViewElements();
