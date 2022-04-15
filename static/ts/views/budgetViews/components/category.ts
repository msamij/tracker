import { ViewComponent } from '@budgetViews/components/viewComponent';

export class CategoryComponent extends ViewComponent {
  constructor(public componentParent?: HTMLElement, protected componentCount?: number) {
    super();
  }

  protected componentExists(): boolean {
    return this.componentCount === 0 ? false : true;
  }

  getComponentMarkup(componentType: 'income' | 'expense', title: string, date: string): string {
    return `
    <li class="category__item category__item--${
      componentType === 'income' ? 'grey' : 'white'
    } category__item--${componentType}">
      <p class="category__title category__title--${componentType}">${title}</p>
        <p class="category__date category__date--${componentType}">${date}</p>
      <div class="action-box">
        <button class="btn-secondary btn-delete-${componentType}-category">
          <svg class="btn-secondary__icon btn-secondary__icon--orange">
            <use xlink:href="../static/img/symbol-defs.svg#icon-cancel-circle"></use>
          </svg>
        </button>
        <button class="btn-secondary btn-edit-${componentType}-category">
         <svg class="btn-secondary__icon btn-secondary__icon--orange">
          <use
            xlink:href="../static/img/symbol-defs.svg#icon-pen"
            ></use>
          </svg>
        </button>
      </div>
    </li>`;
  }
}
