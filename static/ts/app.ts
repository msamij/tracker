import { BudgetPagination } from '@budgetViews/pagination/budget';
import { ExpenseCategoryPagination, IncomeCategoryPagination } from '@budgetViews/pagination/category';
import { ExpensePagination, IncomePagination } from '@budgetViews/pagination/incomeAndExpense';
import { ViewState } from '@budgetViews/state';
import { DeleteCategory } from '@DOM/delete';
import { renderCategory, renderIncomeAndExpense } from '@DOM/render';
import budgetElements from '@DOMElements/budget';
import categoryElements from '@DOMElements/category';
import incomeAndExpenseElements from '@DOMElements/incomeAndExpense';
import { popupMenuElements } from '@DOMElements/popup';
import {
  HandleAddNewItemEvent,
  handleBudgetPaginationEvent,
  handleDeleteCategoryEvent,
  handleExpenseCategoryPaginationEvent,
  handleExpensePaginationEvent,
  handleIncomeCategoryPaginationEvent,
  handleIncomePaginationEvent,
  handleOverlayEvent,
  HandlePopupMenuEvent,
} from '@events/event';
import { getJsonDataAsString, requestDeleteCategory } from '@models/Model';

// ADMIN PASSWORD: c056BH89Pm
// TODO:
// 1: Implement Pagination on budget, categories, incomes and expenses (DONE NEEDS TESTING).
// 2: Implement Delete action on incomeCategory, expenseCategory, incomes and expenses.
// 3: Implement modify action on incomeCategory, expenseCategory and incomes and expenses.

export const viewState = new ViewState(popupMenuElements, categoryElements);

const budgetPagination = new BudgetPagination(getJsonDataAsString);
const incomePagination = new IncomePagination(getJsonDataAsString);
const expensePagination = new ExpensePagination(getJsonDataAsString);
const incomeCategoryPagination = new IncomeCategoryPagination(getJsonDataAsString);
const expenseCategoryPagination = new ExpenseCategoryPagination(getJsonDataAsString);
const deleteIncomeCategory = new DeleteCategory('income', getJsonDataAsString, requestDeleteCategory);
const deleteExpenseCategory = new DeleteCategory('expense', getJsonDataAsString, requestDeleteCategory);

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

handleDeleteCategoryEvent(
  deleteIncomeCategory.delete.bind(deleteIncomeCategory),
  deleteExpenseCategory.delete.bind(deleteExpenseCategory)
);
