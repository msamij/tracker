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
    updateButtonClicked: false,
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

  updateState(): void {
    let inputType: 'category' | 'item', categoryType: 'income' | 'expense';
    if (
      this.viewState.buttonType === 'add-income-category' ||
      this.viewState.buttonType === 'add-expense-category' ||
      this.viewState.buttonType === 'edit-income-category' ||
      this.viewState.buttonType === 'edit-expense-category'
    ) {
      inputType = 'category';
      categoryType = 'income';
    } else {
      inputType = 'item';
      categoryType = this.viewState.buttonType === 'add-income' ? 'income' : 'expense';
    }

    if (!this.viewState.updateButtonClicked) this.viewState.inputDate = this.popupMenuEl.getInputDate(inputType);

    this.viewState.inputTitle = this.popupMenuEl.getInputTitle(inputType);
    this.viewState.categoryDate = this.categoryEl.getCategoryDate(categoryType);
    if (
      this.viewState.buttonType === 'add-income' ||
      this.viewState.buttonType === 'add-expense' ||
      this.viewState.buttonType === 'edit-income' ||
      this.viewState.buttonType === 'edit-expense'
    ) {
      this.viewState.inputAmount = this.popupMenuEl.getInputAmount();
      this.viewState.categoryTitle = this.categoryEl.getCategoryTitle(categoryType);
    }
  }

  get state() {
    return this.viewState;
  }
}
