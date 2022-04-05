import { ViewComponent } from '@budgetViews/components/viewComponent';

interface AddButton {
  buttonType: 'income' | 'expense';
  count?: number;
  parent?: HTMLElement;
}

export class AddButtonComponent extends ViewComponent {
  constructor(protected componentParent: AddButton) {
    super();
  }

  protected componentExists(): boolean {
    return this.componentParent.count === 0 ? false : true;
  }

  getComponentMarkup(): string {
    return `<button class="btn-primary btn-primary--${
      this.componentParent.buttonType === 'income' ? 'blue' : 'red'
    } add-${this.componentParent.buttonType}">add ${this.componentParent.buttonType}</button>`;
  }
}
