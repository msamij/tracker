import { getJsonData } from '@models/Model';
import { ViewState } from '@budgetViews/state';
import budgetElements from '@DOMElements/budget';
import categoryElements from '@DOMElements/category';
import { popupMenuElements } from '@DOMElements/popup';
import { BudgetPagination } from '@budgetViews/pagination/budget';
import incomeAndExpenseElements from '@DOMElements/incomeAndExpense';
import { renderCategory, renderIncomeAndExpense } from '@DOM/render';
import { IncomePagination, ExpensePagination } from '@budgetViews/pagination/incomeAndExpense';
import { IncomeCategoryPagination, ExpenseCategoryPagination } from '@budgetViews/pagination/category';
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
const incomePagination = new IncomePagination(getJsonData);
const expensePagination = new ExpensePagination(getJsonData);
const incomeCategoryPagination = new IncomeCategoryPagination(getJsonData);
const expenseCategoryPagination = new ExpenseCategoryPagination(getJsonData);

HandlePopupMenuEvent();

handleOverlayEvent();

HandleAddNewItemEvent(
  renderCategory.render.bind(renderCategory),
  renderIncomeAndExpense.render.bind(renderIncomeAndExpense)
);

handleBudgetPaginationEvent(
  budgetElements.getBudgetContainer(),
  budgetPagination.updateDOMOnPagination.bind(budgetPagination)
);

handleIncomeCategoryPaginationEvent(
  categoryElements.getFormElement('incomes'),
  incomeCategoryPagination.updateDOMOnPagination.bind(incomeCategoryPagination)
);

handleIncomePaginationEvent(
  incomeAndExpenseElements.getFormElement('incomes'),
  incomePagination.updateDOMOnPagination.bind(incomePagination)
);

handleExpenseCategoryPaginationEvent(
  categoryElements.getFormElement('expenses'),
  expenseCategoryPagination.updateDOMOnPagination.bind(expenseCategoryPagination)
);

handleExpensePaginationEvent(
  incomeAndExpenseElements.getFormElement('expenses'),
  expensePagination.updateDOMOnPagination.bind(expensePagination)
);
