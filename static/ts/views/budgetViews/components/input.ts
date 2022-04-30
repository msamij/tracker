import { ViewComponent } from '@components/viewComponent';

export class InputDateComponent extends ViewComponent {
  constructor(protected componentCount: number, protected componentParent: HTMLElement) {
    super();
  }

  protected componentExists(): boolean {
    return this.componentCount === 0 ? false : true;
  }

  getComponentMarkup(type: 'category' | 'item'): string {
    return `
    <input type="date" required class="input input__date${
      type === 'category' ? '--category' : ''
    }" placeholder="date">`;
  }
}
