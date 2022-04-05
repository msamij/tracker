import { ViewComponent } from '@budgetViews/components/viewComponent';

interface AddButton {
  buttonType: 'income' | 'expense';
  count?: number;
  parent?: HTMLElement;
}

export class AddButtonComponent extends ViewComponent {
  constructor(protected parent: AddButton) {
    super();
  }

  protected componentExists(): boolean {
    return this.parent.count === 0 ? false : true;
  }

  getComponentMarkup(): string {
    return `<button class="btn-primary btn-primary--${this.parent.buttonType === 'income' ? 'blue' : 'red'} add-${
      this.parent.buttonType
    }">add ${this.parent.buttonType}</button>`;
  }
}
