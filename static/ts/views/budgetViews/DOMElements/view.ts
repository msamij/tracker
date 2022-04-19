/**
 * This class provide APi's to get common DOM elements.
 **/
export class ViewElements {
  private constructor() {}

  static getOverlay(): HTMLDivElement {
    return document.querySelector('.overlay');
  }
  static getContainer(): HTMLDivElement {
    return document.querySelector('.container');
  }
  static getMessageElement(): HTMLDivElement {
    return document.querySelector('.message');
  }
}
