import { ViewComponent } from '@budgetViews/components/viewComponent';

interface AddButton {
  buttonType: 'income' | 'expense';
  count?: number;
  parent?: HTMLElement;
}

export class AddButtonComponent extends ViewComponent {
  constructor(protected props: AddButton) {
    super();
  }

  protected componentExists(): boolean {
    return this.props.count === 0 ? false : true;
  }

  getComponentMarkup(): string {
    return `<button class="btn-primary btn-primary--${this.props.buttonType === 'income' ? 'blue' : 'red'} add-${
      this.props.buttonType
    }">add ${this.props.buttonType}</button>`;
  }
}
