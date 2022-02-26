import { viewState } from 'app';
import { ViewState } from '@budgetViews/state';
import budgetView from '@budgetViews/budgetView';
import categoryElements from '@budgetViews/categoryView';
import incomeAndElements from '@budgetViews/incomeAndExpenseView';

interface AddNewActions {
  overlay: HTMLDivElement;
  viewState: ViewState;
  getPopupMenu(menuType: 'category' | 'item'): HTMLFormElement;
  clearInputFields(menuType: HTMLFormElement): void;
  togglePopupMenu(
    menuType: HTMLFormElement,
    overlay: HTMLElement,
    visibility: 'visible' | 'hidden',
    opacity: '1' | '0'
  ): void;
}
interface PopupMenuActions {
  overlay: HTMLDivElement;
  container: HTMLDivElement;
  viewState: ViewState;
  getPopupMenu(menuType: 'category' | 'item'): HTMLFormElement;
  getPopupMenuClickedButton(event: Event): string;
  togglePopupMenu(
    menuType: HTMLFormElement,
    overlay: HTMLElement,
    visibility: 'visible' | 'hidden',
    opacity: '1' | '0'
  ): void;
}
interface OverlayActions {
  overlay: HTMLDivElement;
  viewState: ViewState;
  togglePopupMenu(
    menuType: HTMLFormElement,
    overlay: HTMLElement,
    visibility: 'visible' | 'hidden',
    opacity: '1' | '0'
  ): void;
}

export function HandleOverlayEvent(actions: OverlayActions): void {
  actions.overlay.addEventListener('click', () => {
    actions.togglePopupMenu(actions.viewState.state.menuType, actions.overlay, 'hidden', '0');
  });
}

export function HandlePopupMenuEvent(actions: PopupMenuActions): void {
  actions.container.addEventListener('click', event => {
    if (
      (event.target as HTMLButtonElement).closest('.add-income-category') ||
      (event.target as HTMLButtonElement).closest('.add-expense-category')
    ) {
      actions.viewState.buttonType = actions.getPopupMenuClickedButton(event);
      actions.viewState.menuType = actions.getPopupMenu('category');

      actions.togglePopupMenu(actions.viewState.state.menuType, actions.overlay, 'visible', '1');
    } else if (
      (event.target as HTMLButtonElement).closest('.add-income') ||
      (event.target as HTMLButtonElement).closest('.add-expense')
    ) {
      actions.viewState.menuType = actions.getPopupMenu('item');
      actions.viewState.buttonType = actions.getPopupMenuClickedButton(event);

      actions.togglePopupMenu(actions.viewState.state.menuType, actions.overlay, 'visible', '1');
    }
  });
}

export function HandleAddNewEvent(
  actions: AddNewActions,
  submitCategoryForm: Function,
  submitIncomeAndExpenseForm: Function
): void {
  [actions.getPopupMenu('category'), actions.getPopupMenu('item')].forEach(el => {
    el.addEventListener('submit', event => {
      event.preventDefault();
      actions.viewState.updateStateOnAddNewElement();
      actions.clearInputFields(actions.viewState.state.menuType);
      actions.togglePopupMenu(actions.viewState.state.menuType, actions.overlay, 'hidden', '0');
      if (
        actions.viewState.state.buttonType === 'add-income-category' ||
        actions.viewState.state.buttonType === 'add-expense-category'
      )
        submitCategoryForm();
      else submitIncomeAndExpenseForm();
    });
  });
}

export function handleBudgetPaginationEvent(budgetContainer: HTMLFormElement, paginateBudget: Function): void {
  budgetContainer.addEventListener('click', event => {
    event.preventDefault();
    if (
      (event.target as HTMLButtonElement).closest('.btn-next-month') &&
      viewState.state.currentBudgetPage < +budgetView.getBudgetCount()
    ) {
      viewState.state.currentBudgetPage += 1;
      viewState.state.currentIncomeCategoryPage = 1;
      viewState.state.currentIncomePage = 1;
      viewState.state.currentExpenseCategoryPage = 1;
      viewState.state.currentExpensePage = 1;
      paginateBudget();
    } else if (
      (event.target as HTMLButtonElement).closest('.btn-prev-month') &&
      viewState.state.currentBudgetPage !== 1
    ) {
      viewState.state.currentBudgetPage -= 1;
      viewState.state.currentIncomeCategoryPage = 1;
      viewState.state.currentIncomePage = 1;
      viewState.state.currentExpenseCategoryPage = 1;
      viewState.state.currentExpensePage = 1;
      paginateBudget();
    }
  });
}

export function handleIncomeCategoryPaginationEvent(
  incomeCategryContainer: HTMLFormElement,
  paginateIncomeCategory: Function
): void {
  incomeCategryContainer.addEventListener('click', event => {
    event.preventDefault();
    if (
      (event.target as HTMLButtonElement).closest('.btn-next-income-category') &&
      viewState.state.currentIncomeCategoryPage < +categoryElements.getFormAttributeValue('incomes')
    ) {
      viewState.state.currentIncomeCategoryPage += 1;
      viewState.state.currentIncomePage = 1;
      paginateIncomeCategory();
    } else if (
      (event.target as HTMLButtonElement).closest('.btn-prev-income-category') &&
      viewState.state.currentIncomeCategoryPage !== 1
    ) {
      viewState.state.currentIncomeCategoryPage -= 1;
      viewState.state.currentIncomePage = 1;
      paginateIncomeCategory();
    }
  });
}

export function handleExpenseCategoryPaginationEvent(
  expenseCategryContainer: HTMLFormElement,
  paginateExpenseCategory: Function
): void {
  expenseCategryContainer.addEventListener('click', event => {
    event.preventDefault();
    if (
      (event.target as HTMLButtonElement).closest('.btn-next-expense-category') &&
      viewState.state.currentExpenseCategoryPage < +categoryElements.getFormAttributeValue('expenses')
    ) {
      viewState.state.currentExpenseCategoryPage += 1;
      viewState.state.currentExpensePage = 1;
      paginateExpenseCategory();
    } else if (
      (event.target as HTMLButtonElement).closest('.btn-prev-expense-category') &&
      viewState.state.currentExpenseCategoryPage !== 1
    ) {
      viewState.state.currentExpenseCategoryPage -= 1;
      viewState.state.currentExpensePage = 1;
      paginateExpenseCategory();
    }
  });
}

export function handleIncomePaginationEvent(incomeContainer: HTMLFormElement, paginateIncome: Function): void {
  incomeContainer.addEventListener('click', event => {
    event.preventDefault();
    if (
      (event.target as HTMLButtonElement).closest('.btn-next-income') &&
      viewState.state.currentIncomePage < +incomeAndElements.getFormAttributeValue('incomes')
    ) {
      viewState.state.currentIncomePage += 1;
      paginateIncome();
    } else if (
      (event.target as HTMLButtonElement).closest('.btn-prev-income') &&
      viewState.state.currentIncomePage !== 1
    ) {
      viewState.state.currentIncomePage -= 1;
      paginateIncome();
    }
  });
}

export function handleExpensePaginationEvent(expenseContainer: HTMLFormElement, paginateExpense: Function): void {
  expenseContainer.addEventListener('click', event => {
    event.preventDefault();
    if (
      (event.target as HTMLButtonElement).closest('.btn-next-expense') &&
      viewState.state.currentExpensePage < +incomeAndElements.getFormAttributeValue('expenses')
    ) {
      viewState.state.currentExpensePage += 1;
      paginateExpense();
    } else if (
      (event.target as HTMLButtonElement).closest('.btn-prev-expense') &&
      viewState.state.currentExpensePage !== 1
    ) {
      viewState.state.currentExpensePage -= 1;
      paginateExpense();
    }
  });
}
