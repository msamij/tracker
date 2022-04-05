import { ViewComponent } from '@budgetViews/components/viewComponent';

export class AddButtonComponent extends ViewComponent {
  constructor(protected componentParent?: HTMLElement, protected componentCount?: number) {
    super();
  }

  protected componentExists(): boolean {
    return this.componentCount === 0 ? false : true;
  }

  getComponentMarkup(buttonType: 'income' | 'expense'): string {
    return `<button class="btn-primary btn-primary--${
      buttonType === 'income' ? 'blue' : 'red'
    } add-${buttonType}">add ${buttonType}</button>`;
  }
}
