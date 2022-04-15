import { ViewComponent } from '@budgetViews/components/viewComponent';

export class IncomeAndExpenseComponent extends ViewComponent {
  constructor(protected componentParent?: HTMLElement, protected componentCount?: number) {
    super();
  }

  protected componentExists(): boolean {
    return this.componentCount === 0 ? false : true;
  }

  getComponentMarkup(componentType: 'income' | 'expense', title: string, amount: string, date: string): string {
    return `
    <li class="items-box__item ${componentType}-box__${componentType}">
      <p class="${componentType}-box__${componentType}-type">${title}</p>
      <p class="${componentType}-box__${componentType}-amount">${amount} Rs</p>
      <p class="${componentType}-box__${componentType}-date">${date}</p>
          <div class="action-box">
          <button type="submit" class="btn-secondary btn-delete-${componentType}">
            <svg class="btn-secondary__icon btn-secondary__icon--white">
              <use
                xlink:href="../static/img/symbol-defs.svg#icon-cancel-circle"
              ></use>
            </svg>
          </button>
        <button class="btn-secondary btn-edit-${componentType}">
          <svg class="btn-secondary__icon btn-secondary__icon--white">
            <use
              xlink:href="../static/img/symbol-defs.svg#icon-pen">
            </use>
          </svg>
        </button>
      </div>
    </li>`;
  }
}
