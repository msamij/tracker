interface PopupMenu {
  getInputAmount(): string;
  getInputDate(type: 'category' | 'item'): string;
  getInputTitle(type: 'category' | 'item'): string;
}
interface Category {
  getCategoryDate(type: 'income' | 'expense'): string;
  getCategoryTitle(type: 'income' | 'expense'): string;
}

export class ViewState {
  private viewState = {
    menuType: null,
    prevCount: 0,
    buttonType: '',
    inputDate: '',
    inputTitle: '',
    inputAmount: '',
    categoryDate: '',
    categoryTitle: '',
    currentBudgetPage: 1,
    currentIncomePage: 1,
    currentExpensePage: 1,
    currentIncomeCategoryPage: 1,
    currentExpenseCategoryPage: 1,
  };

  constructor(private popupMenuEl: PopupMenu, private categoryEl: Category) {}

  updateStateOnAddNewElement(): void {
    let type1: 'category' | 'item', type2: 'income' | 'expense';
    if (this.viewState.buttonType === 'add-income-category' || this.viewState.buttonType === 'add-expense-category') {
      type1 = 'category';
      type2 = 'income';
    } else {
      type1 = 'item';
      type2 = this.viewState.buttonType === 'add-income' ? 'income' : 'expense';
    }

    this.viewState.inputDate = this.popupMenuEl.getInputDate(type1);
    this.viewState.inputTitle = this.popupMenuEl.getInputTitle(type1);
    this.viewState.categoryDate = this.categoryEl.getCategoryDate(type2);
    if (this.viewState.buttonType === 'add-income' || this.viewState.buttonType === 'add-expense') {
      this.viewState.inputAmount = this.popupMenuEl.getInputAmount();
      this.viewState.categoryTitle = this.categoryEl.getCategoryTitle(type2);
    }
  }

  get state() {
    return this.viewState;
  }
}
