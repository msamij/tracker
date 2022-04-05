export abstract class ViewComponent {
  protected abstract componentParent?: HTMLElement;
  protected abstract componentExists?(): boolean;
  // abstract getComponentMarkup(...args: any): string;

  /**
   * Renders HTML into the DOM.
   * @param position position of the component,
   * must be either "afterbegin" | "afterend" | "beforebegin" | "beforeend".
   */
  renderComponent(position: 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend', componentMarkup: string): void {
    if (this.componentExists()) return;
    this.componentParent.insertAdjacentHTML(position, componentMarkup);
  }

  /**
   * Updates the component dataset attribute
   * @param component HTML node on which you want to update the dataset attribute.
   * @param value which'll replace the current dataset attribute of the component.
   */
  updateComponentState(component: HTMLElement, value: number | string): void {
    component.dataset.value = '' + value;
  }
}
