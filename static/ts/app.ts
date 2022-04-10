import { getJsonData } from '@models/Model';
import { ViewState } from '@budgetViews/state';
import budgetElements from '@DOMElements/budget';
import categoryElements from '@DOMElements/category';
import { popupMenuElements } from '@DOMElements/popup';
import { BudgetPagination } from '@budgetViews/pagination/budget';
import incomeAndExpenseElements from '@DOMElements/incomeAndExpense';
import { renderCategory, renderIncomeAndExpense } from '@budgetViews/render';
import { incomePaginationView, expensePaginationView } from '@budgetViews/pagination/incomeAndExpense';
import { incomeCategoryPaginationView, expenseCategoryPaginationView } from '@budgetViews/pagination/category';
import {
  HandleAddNewItemEvent,
  handleOverlayEvent,
  HandlePopupMenuEvent,
  handleBudgetPaginationEvent,
  handleIncomePaginationEvent,
  handleExpensePaginationEvent,
  handleIncomeCategoryPaginationEvent,
  handleExpenseCategoryPaginationEvent,
} from '@events/event';

// ADMIN PASSWORD: c056BH89Pm
// TODO:
// 1: Implement Pagination on budget, categories, incomes and expenses (DONE NEEDS TESTING).
// 2: Implement Delete action on incomeCategory, expenseCategory, incomes and expenses.
// 3: Implement modify action on incomeCategory, expenseCategory and incomes and expenses.

export const viewState = new ViewState(popupMenuElements, categoryElements);
const budgetPagination = new BudgetPagination(getJsonData);

HandlePopupMenuEvent();

handleOverlayEvent();

HandleAddNewItemEvent(
  renderCategory.render.bind(renderCategory),
  renderIncomeAndExpense.render.bind(renderIncomeAndExpense)
);

handleBudgetPaginationEvent(
  budgetElements.getBudgetContainer(),
  budgetPagination.updateDOMOnBudgetPagination.bind(budgetPagination)
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
