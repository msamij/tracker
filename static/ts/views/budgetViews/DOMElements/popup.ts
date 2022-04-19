/**
 * This class provide APi's to interact with the popupmenu,
 * and this cannot be instantiated.
 */
export class PopupMenuElements {
  private constructor() {}

  /**
   * @param menuType = 'category' to get category__menu.
   * @param menuType = 'item' to get item__menu.
   */
  static getPopupMenu(menuType: 'category' | 'item'): HTMLFormElement {
    return document.querySelector(`.menu__${menuType}`);
  }

  /**
   * @param type = 'title' to get the input title of item__menu.
   * @param type = 'category' to get the input title of category__menu.
   */
  static getInputTitle(type: 'category' | 'item'): string {
    return (document.querySelector(`.input__${type}`) as HTMLInputElement).value;
  }

  static getInputAmount(): string {
    return (document.querySelector('.input__amount') as HTMLInputElement).value;
  }

  /**
   * @param type = 'category' to get inputDate from category__menu
   * @param type = 'item' to get inputDate from item__menu.
   */
  static getInputDate(type: 'category' | 'item'): string {
    return (document.querySelector(`.input__date${type === 'category' ? '--category' : ''}`) as HTMLInputElement).value;
  }
}

/**
 * This class provide APi's to manipulate DOM for popupmenu,
 * therefore it cannot be instantiated.
 */
export class PopupMenuDOM {
  private constructor() {}

  /**
   * Clear the input fields of current rendered popup menu.
   * @param menuType HTMLFormElement
   */
  static clearInputFields(menuType: HTMLFormElement): void {
    document.querySelector(`.${menuType.classList[1]}`).childNodes.forEach(node => {
      (node as HTMLInputElement).value = '';
    });
  }

  /**
   * Returns the class name of the button which was clicked.
   * @param event Event object.
   */
  static getPopupMenuClickedButton(event: Event): string {
    // Extract className of the button which was clicked.
    const classList = (event.target as HTMLButtonElement).classList;
    return (event.target as HTMLButtonElement).classList[classList.length - 1];
  }

  /**
   * Renders either item menu to handle incomes or expenses data.
   * or render category menu to handle income category or expense category data.
   * @param menuType must be either 'menuCategory' or 'menuItem'.
   */
  static togglePopupMenu(
    menuType: HTMLFormElement,
    overlay: HTMLElement,
    visibility: 'visible' | 'hidden',
    opacity: '1' | '0'
  ): void {
    menuType.style.visibility = visibility;
    menuType.style.opacity = opacity;
    overlay.style.visibility = visibility;
    overlay.style.opacity = opacity;
  }
}
