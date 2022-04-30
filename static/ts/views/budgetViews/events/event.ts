import { BudgetElements } from '@DOMElements/budget';
import { CategoryElements } from '@DOMElements/category';
import { IncomeAndExpenseElements } from '@DOMElements/incomeAndExpense';
import { PopupMenuDOM, PopupMenuElements } from '@DOMElements/popup';
import { ViewElements } from '@DOMElements/view';
import { viewState } from 'app';

export function handleOverlayEvent(): void {
  ViewElements.getOverlay().addEventListener('click', () => {
    PopupMenuDOM.togglePopupMenu(viewState.state.menuType, ViewElements.getOverlay(), 'hidden', '0');
    if (viewState.state.updateButtonClicked) {
      PopupMenuDOM.toggleDateInputField('category', true);
      PopupMenuDOM.toggleDateInputField('item', true);
    }
  });
}

export function handlePopupMenuEvent(): void {
  ViewElements.getContainer().addEventListener('click', event => {
    if (
      (event.target as HTMLButtonElement).closest('.add-income-category') ||
      (event.target as HTMLButtonElement).closest('.add-expense-category')
    ) {
      viewState.state.menuType = PopupMenuElements.getPopupMenu('category');
      viewState.state.buttonType = PopupMenuDOM.getPopupMenuClickedButton(event);
      PopupMenuDOM.togglePopupMenu(viewState.state.menuType, ViewElements.getOverlay(), 'visible', '1');
    }
    //
    else if (
      (event.target as HTMLButtonElement).closest('.add-income') ||
      (event.target as HTMLButtonElement).closest('.add-expense')
    ) {
      viewState.state.menuType = PopupMenuElements.getPopupMenu('item');
      viewState.state.buttonType = PopupMenuDOM.getPopupMenuClickedButton(event);
      PopupMenuDOM.togglePopupMenu(viewState.state.menuType, ViewElements.getOverlay(), 'visible', '1');
    }
  });
}

export function handleFormSubmitEvent(
  addCategory: Function,
  addIncomeAndExpense: Function,
  updateCategory: Function,
  updateIncomeAndExpense: Function
): void {
  [PopupMenuElements.getPopupMenu('category'), PopupMenuElements.getPopupMenu('item')].forEach(el => {
    el.addEventListener('submit', event => {
      event.preventDefault();
      viewState.updateState();
      PopupMenuDOM.clearInputFields(viewState.state.menuType);
      PopupMenuDOM.togglePopupMenu(viewState.state.menuType, ViewElements.getOverlay(), 'hidden', '0');

      if (viewState.state.updateButtonClicked) {
        PopupMenuDOM.toggleDateInputField('category', true);
        PopupMenuDOM.toggleDateInputField('item', true);
      }

      if (
        viewState.state.buttonType === 'add-income-category' ||
        viewState.state.buttonType === 'add-expense-category'
      ) {
        addCategory();
      } else if (viewState.state.buttonType === 'add-income' || viewState.state.buttonType === 'add-expense') {
        addIncomeAndExpense();
      } else if (
        viewState.state.buttonType === 'edit-income-category' ||
        viewState.state.buttonType === 'edit-expense-category'
      ) {
        updateCategory();
      } else if (viewState.state.buttonType === 'edit-income' || viewState.state.buttonType === 'edit-expense') {
        updateIncomeAndExpense();
      }
    });
  });
}

export function handleBudgetPaginationEvent(paginateBudget: Function): void {
  BudgetElements.getBudgetContainer().addEventListener('click', event => {
    event.preventDefault();
    if (
      (event.target as HTMLButtonElement).closest('.btn-next-month') &&
      viewState.state.currentBudgetPage < +BudgetElements.getBudgetCount()
    ) {
      viewState.state.currentBudgetPage += 1;
      viewState.state.currentIncomeCategoryPage = 1;
      viewState.state.currentIncomePage = 1;
      viewState.state.currentExpenseCategoryPage = 1;
      viewState.state.currentExpensePage = 1;
      paginateBudget();
    }
    //
    else if (
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

export function handleIncomeCategoryPaginationEvent(paginateIncomeCategory: Function): void {
  CategoryElements.getFormElement('incomes').addEventListener('click', event => {
    event.preventDefault();
    if (
      (event.target as HTMLButtonElement).closest('.btn-next-income-category') &&
      viewState.state.currentIncomeCategoryPage < +CategoryElements.getFormAttributeValue('incomes')
    ) {
      viewState.state.currentIncomeCategoryPage += 1;
      viewState.state.currentIncomePage = 1;
      paginateIncomeCategory();
    }
    //
    else if (
      (event.target as HTMLButtonElement).closest('.btn-prev-income-category') &&
      viewState.state.currentIncomeCategoryPage !== 1
    ) {
      viewState.state.currentIncomeCategoryPage -= 1;
      viewState.state.currentIncomePage = 1;
      paginateIncomeCategory();
    }
  });
}

export function handleExpenseCategoryPaginationEvent(paginateExpenseCategory: Function): void {
  CategoryElements.getFormElement('expenses').addEventListener('click', event => {
    event.preventDefault();
    if (
      (event.target as HTMLButtonElement).closest('.btn-next-expense-category') &&
      viewState.state.currentExpenseCategoryPage < +CategoryElements.getFormAttributeValue('expenses')
    ) {
      viewState.state.currentExpenseCategoryPage += 1;
      viewState.state.currentExpensePage = 1;
      paginateExpenseCategory();
    }
    //
    else if (
      (event.target as HTMLButtonElement).closest('.btn-prev-expense-category') &&
      viewState.state.currentExpenseCategoryPage !== 1
    ) {
      viewState.state.currentExpenseCategoryPage -= 1;
      viewState.state.currentExpensePage = 1;
      paginateExpenseCategory();
    }
  });
}

export function handleIncomePaginationEvent(paginateIncome: Function): void {
  IncomeAndExpenseElements.getFormElement('incomes').addEventListener('click', event => {
    event.preventDefault();
    if (
      (event.target as HTMLButtonElement).closest('.btn-next-income') &&
      viewState.state.currentIncomePage < +IncomeAndExpenseElements.getFormAttributeValue('incomes')
    ) {
      viewState.state.currentIncomePage += 1;
      paginateIncome();
    }
    //
    else if (
      (event.target as HTMLButtonElement).closest('.btn-prev-income') &&
      viewState.state.currentIncomePage !== 1
    ) {
      viewState.state.currentIncomePage -= 1;
      paginateIncome();
    }
  });
}

export function handleExpensePaginationEvent(paginateExpense: Function): void {
  IncomeAndExpenseElements.getFormElement('expenses').addEventListener('click', event => {
    event.preventDefault();
    if (
      (event.target as HTMLButtonElement).closest('.btn-next-expense') &&
      viewState.state.currentExpensePage < +IncomeAndExpenseElements.getFormAttributeValue('expenses')
    ) {
      viewState.state.currentExpensePage += 1;
      paginateExpense();
    }
    //
    else if (
      (event.target as HTMLButtonElement).closest('.btn-prev-expense') &&
      viewState.state.currentExpensePage !== 1
    ) {
      viewState.state.currentExpensePage -= 1;
      paginateExpense();
    }
  });
}

export function handleDeleteCategoryEvent(deleteIncomeCategory: Function, deleteExpenseCategory: Function): void {
  [CategoryElements.getFormElement('incomes'), CategoryElements.getFormElement('expenses')].forEach(el => {
    el.addEventListener('click', event => {
      event.preventDefault();
      if ((event.target as HTMLButtonElement).closest('.btn-delete-income-category')) deleteIncomeCategory();
      else if ((event.target as HTMLButtonElement).closest('.btn-delete-expense-category')) deleteExpenseCategory();
    });
  });
}

export function handleDeleteIncomeAndExpenseEvent(deleteIncome: Function, deleteExpense: Function): void {
  [IncomeAndExpenseElements.getFormElement('incomes'), IncomeAndExpenseElements.getFormElement('expenses')].forEach(
    el => {
      el.addEventListener('click', event => {
        event.preventDefault();
        if ((event.target as HTMLButtonElement).closest('.btn-delete-income')) deleteIncome();
        else if ((event.target as HTMLButtonElement).closest('.btn-delete-expense')) deleteExpense();
      });
    }
  );
}

export function handlePopupMenuUpdateEvent(): void {
  [
    CategoryElements.getFormElement('incomes'),
    CategoryElements.getFormElement('expenses'),
    IncomeAndExpenseElements.getFormElement('incomes'),
    IncomeAndExpenseElements.getFormElement('expenses'),
  ].forEach(el => {
    el.addEventListener('click', event => {
      event.preventDefault();
      if (
        (event.target as HTMLButtonElement).closest('.btn-edit-income-category') ||
        (event.target as HTMLButtonElement).closest('.btn-edit-expense-category')
      ) {
        viewState.state.updateButtonClicked = true;
        viewState.state.menuType = PopupMenuElements.getPopupMenu('category');
        if ((event.target as HTMLButtonElement).closest('.btn-edit-income-category')) {
          viewState.state.buttonType = 'edit-income-category';
        } else if ((event.target as HTMLButtonElement).closest('.btn-edit-expense-category')) {
          viewState.state.buttonType = 'edit-expense-category';
        }
        PopupMenuDOM.toggleDateInputField('category', false);
        PopupMenuDOM.togglePopupMenu(viewState.state.menuType, ViewElements.getOverlay(), 'visible', '1');
      }
      //
      else if (
        (event.target as HTMLButtonElement).closest('.btn-edit-income') ||
        (event.target as HTMLButtonElement).closest('.btn-edit-expense')
      ) {
        viewState.state.updateButtonClicked = true;
        viewState.state.menuType = PopupMenuElements.getPopupMenu('item');
        if ((event.target as HTMLButtonElement).closest('.btn-edit-income')) {
          viewState.state.buttonType = 'edit-income';
        } else if ((event.target as HTMLButtonElement).closest('.btn-edit-expense')) {
          viewState.state.buttonType = 'edit-expense';
        }
        PopupMenuDOM.toggleDateInputField('item', false);
        PopupMenuDOM.togglePopupMenu(viewState.state.menuType, ViewElements.getOverlay(), 'visible', '1');
      }
    });
  });
}
