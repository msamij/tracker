import budgetView from '@budgetViews/budgetView';
import categoryElements from '@budgetViews/categoryView';
import viewElements, { ViewState } from '@budgetViews/state';
import budgetPaginationView from '@budgetViews/pagination/budget';
import incomeAndExpenseElements from '@budgetViews/incomeAndExpenseView';
import { popupMenuElements, popupMenuDOM } from '@budgetViews/popupView';
import { renderCategory, renderIncomeAndExpense } from '@budgetViews/renderView';
import { incomePaginationView, expensePaginationView } from '@budgetViews/pagination/incomeAndExpense';
import { incomeCategoryPaginationView, expenseCategoryPaginationView } from '@budgetViews/pagination/category';
import {
  HandleAddNewEvent,
  setupOverlayEventListener,
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
// 2: Implement Delete action on incomeCategory, expenseCategory, incomes and expenses.
// 3: Implement modify action on incomeCategory, expenseCategory and incomes and expenses.

export const viewState = new ViewState(popupMenuElements, categoryElements);

setupOverlayEventListener();

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
  budgetPaginationView.updateDOMOnBudgetPagination.bind(budgetPaginationView)
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
