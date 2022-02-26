import budgetView from '@budgetViews/budgetView';
import categoryElements from '@budgetViews/categoryView';
import viewElements, { ViewState } from '@budgetViews/state';
import budgetPaginationView from '@budgetViews/pagination/budget';
import { incomePaginationView, expensePaginationView } from '@budgetViews/pagination/incomeAndExpense';
import { popupMenuElements, popupMenuDOM } from '@budgetViews/popupView';
import { renderCategory, renderIncomeAndExpense } from '@budgetViews/renderView';
import incomeAndExpenseElements from '@budgetViews/incomeAndExpenseView';
import { incomeCategoryPaginationView, expenseCategoryPaginationView } from '@budgetViews/pagination/category';
import {
  HandleAddNewEvent,
  HandleOverlayEvent,
  HandlePopupMenuEvent,
  handleBudgetPaginationEvent,
  handleIncomePaginationEvent,
  handleExpensePaginationEvent,
  handleIncomeCategoryPaginationEvent,
  handleExpenseCategoryPaginationEvent,
} from '@events/viewEvent';

// ADMIN PASSWORD: c056BH89Pm
// TODO:
// 1: Implement Pagination on budget, categories, incomes and expenses (DONE NEEDS TESTING).
// 2: Implement Modification in incomeCategory, expenseCategory, incomes and expenses.

export const viewState = new ViewState(popupMenuElements, categoryElements);

HandleOverlayEvent({
  overlay: viewElements.getOverlay(),
  viewState: viewState,
  togglePopupMenu: popupMenuDOM.togglePopupMenu,
});

HandlePopupMenuEvent({
  overlay: viewElements.getOverlay(),
  container: viewElements.getContainer(),
  viewState: viewState,
  getPopupMenu: popupMenuElements.getPopupMenu,
  getPopupMenuClickedButton: popupMenuDOM.getPopupMenuClickedButton,
  togglePopupMenu: popupMenuDOM.togglePopupMenu,
});

HandleAddNewEvent(
  {
    overlay: viewElements.getOverlay(),
    viewState: viewState,
    getPopupMenu: popupMenuElements.getPopupMenu,
    clearInputFields: popupMenuDOM.clearInputFields,
    togglePopupMenu: popupMenuDOM.togglePopupMenu,
  },
  renderCategory.init.bind(renderCategory),
  renderIncomeAndExpense.init.bind(renderIncomeAndExpense)
);

handleBudgetPaginationEvent(
  budgetView.getBudgetContainer(),
  budgetPaginationView.paginateBudget.bind(budgetPaginationView)
);

handleIncomeCategoryPaginationEvent(
  categoryElements.getFormElement('incomes'),
  incomeCategoryPaginationView.paginateIncomeCategory.bind(incomeCategoryPaginationView)
);

handleIncomePaginationEvent(
  incomeAndExpenseElements.getFormElement('incomes'),
  incomePaginationView.paginateIncome.bind(incomePaginationView)
);

handleExpenseCategoryPaginationEvent(
  categoryElements.getFormElement('expenses'),
  expenseCategoryPaginationView.paginateExpenseCategory.bind(expenseCategoryPaginationView)
);

handleExpensePaginationEvent(
  incomeAndExpenseElements.getFormElement('expenses'),
  expensePaginationView.paginateExpense.bind(expensePaginationView)
);
