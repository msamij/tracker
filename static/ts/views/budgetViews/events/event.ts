import { viewState } from 'app';
import viewElements from '@DOMElements/view';
import budgetView from '@DOMElements/budget';
import categoryElements from '@DOMElements/category';
import incomeAndElements from '@DOMElements/incomeAndExpense';
import { popupMenuElements, popupMenuDOM } from '@DOMElements/popup';

export function handleOverlayEvent(): void {
  viewElements.getOverlay().addEventListener('click', () => {
    popupMenuDOM.togglePopupMenu(viewState.state.menuType, viewElements.getOverlay(), 'hidden', '0');
  });
}

export function HandlePopupMenuEvent(): void {
  viewElements.getContainer().addEventListener('click', event => {
    if (
      (event.target as HTMLButtonElement).closest('.add-income-category') ||
      (event.target as HTMLButtonElement).closest('.add-expense-category')
    ) {
      viewState.buttonType = popupMenuDOM.getPopupMenuClickedButton(event);
      viewState.menuType = popupMenuElements.getPopupMenu('category');

      popupMenuDOM.togglePopupMenu(viewState.state.menuType, viewElements.getOverlay(), 'visible', '1');
    } else if (
      (event.target as HTMLButtonElement).closest('.add-income') ||
      (event.target as HTMLButtonElement).closest('.add-expense')
    ) {
      viewState.menuType = popupMenuElements.getPopupMenu('item');
      viewState.buttonType = popupMenuDOM.getPopupMenuClickedButton(event);

      popupMenuDOM.togglePopupMenu(viewState.state.menuType, viewElements.getOverlay(), 'visible', '1');
    }
  });
}

export function HandleAddNewItemEvent(submitCategoryForm: Function, submitIncomeAndExpenseForm: Function): void {
  [popupMenuElements.getPopupMenu('category'), popupMenuElements.getPopupMenu('item')].forEach(el => {
    el.addEventListener('submit', event => {
      event.preventDefault();
      viewState.updateStateOnAddNewElement();
      popupMenuDOM.clearInputFields(viewState.state.menuType);
      popupMenuDOM.togglePopupMenu(viewState.state.menuType, viewElements.getOverlay(), 'hidden', '0');

      if (viewState.state.buttonType === 'add-income-category' || viewState.state.buttonType === 'add-expense-category')
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

export function handleDeleteIncomeCategoryEvent(
  incomeCategoryContainer: HTMLFormElement,
  deleteCategory: Function
): void {
  incomeCategoryContainer.addEventListener('click', event => {
    event.preventDefault();
    if ((event.target as HTMLButtonElement).closest('.btn-delete-income-category')) deleteCategory();
  });
}
