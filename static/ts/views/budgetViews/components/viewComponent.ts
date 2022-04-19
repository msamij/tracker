/**
 * This class serves as the base for components that can rendered into the DOM,
 * It provides reusable functionality to render components that exists in child classes.
 */
export abstract class ViewComponent {
  protected abstract componentParent?: HTMLElement;
  protected abstract componentExists(): boolean;

  /**
   * Renders HTML into the DOM.
   * @param position position of the component,
   * must be either "afterbegin" | "afterend" | "beforebegin" | "beforeend".
   */
  renderComponent(position: 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend', componentMarkup: string): void {
    if (this.componentExists()) return;
    this.componentParent.insertAdjacentHTML(position, componentMarkup);
  }
}
