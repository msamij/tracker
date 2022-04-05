import { ViewComponent } from '@budgetViews/components/viewComponent';

interface Category {
  title: string;
  date: string;
  type: 'income' | 'expense';
  count?: number;
  parent?: HTMLElement;
}

export class CategoryComponent extends ViewComponent {
  constructor(public parent: Category) {
    super();
  }

  // If component already exist then render next button.
  protected componentExists(): boolean {
    return this.parent.count === 0 ? false : true;
  }

  getComponentMarkup(): string {
    return `
    <li class="category__item category__item--${this.parent.type === 'income' ? 'grey' : 'white'} category__item--${
      this.parent.type
    }">
      <p class="category__title category__title--${this.parent.type}">${this.parent.title}</p>
        <p class="category__date category__date--${this.parent.type}">${this.parent.date}</p>
      <div class="action-box">
        <button class="btn-secondary">
          <svg class="btn-secondary__icon btn-secondary__icon--orange">
            <use xlink:href="../static/img/symbol-defs.svg#icon-cancel-circle"></use>
          </svg>
        </button>
        <button class="btn-secondary">
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
