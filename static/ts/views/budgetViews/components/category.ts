import { ViewComponent } from '@budgetViews/components/viewComponent';

interface Category {
  title: string;
  date: string;
  type: 'income' | 'expense';
  count?: number;
  parent?: HTMLElement;
}

export class CategoryComponent extends ViewComponent {
  constructor(public props: Category) {
    super();
  }

  // If component already exist then render next button.
  protected componentExists(): boolean {
    return this.props.count === 0 ? false : true;
  }

  getComponentMarkup(): string {
    return `
    <li class="category__item category__item--${this.props.type === 'income' ? 'grey' : 'white'} category__item--${
      this.props.type
    }">
      <p class="category__title category__title--${this.props.type}">${this.props.title}</p>
        <p class="category__date category__date--${this.props.type}">${this.props.date}</p>
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
