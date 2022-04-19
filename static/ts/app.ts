import { BudgetPagination } from '@budgetViews/pagination/budget';
import { ExpenseCategoryPagination, IncomeCategoryPagination } from '@budgetViews/pagination/category';
import { ExpensePagination, IncomePagination } from '@budgetViews/pagination/incomeAndExpense';
import { ViewState } from '@budgetViews/state';
import { DeleteCategory } from '@DOM/delete';
import { RenderCategory, RenderIncomeAndExpense } from '@DOM/render';
import { CategoryElements } from '@DOMElements/category';
import { PopupMenuElements } from '@DOMElements/popup';
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
import { getJsonDataAsString, requestDeleteCategory, saveCategory, saveIncomeAndExpense } from '@models/Model';

// ADMIN PASSWORD: c056BH89Pm
// TODO:
// 1: Implement Pagination on budget, categories, incomes and expenses (DONE NEEDS TESTING).
// 2: Implement Delete action on incomeCategory, expenseCategory, incomes and expenses.
// 3: Implement modify action on incomeCategory, expenseCategory and incomes and expenses.

export const viewState = new ViewState(PopupMenuElements, CategoryElements);

const budgetPagination = new BudgetPagination(getJsonDataAsString);
const incomePagination = new IncomePagination(getJsonDataAsString);
const expensePagination = new ExpensePagination(getJsonDataAsString);
const incomeCategoryPagination = new IncomeCategoryPagination(getJsonDataAsString);
const expenseCategoryPagination = new ExpenseCategoryPagination(getJsonDataAsString);

const renderCategory = new RenderCategory(getJsonDataAsString, saveCategory);
const renderIncomeAndExpense = new RenderIncomeAndExpense(saveIncomeAndExpense);

const deleteIncomeCategory = new DeleteCategory('income', getJsonDataAsString, requestDeleteCategory);
const deleteExpenseCategory = new DeleteCategory('expense', getJsonDataAsString, requestDeleteCategory);

HandlePopupMenuEvent();

handleOverlayEvent();

HandleAddNewItemEvent(
  renderCategory.render.bind(renderCategory),
  renderIncomeAndExpense.render.bind(renderIncomeAndExpense)
);

handleBudgetPaginationEvent(budgetPagination.updateDOMOnPagination.bind(budgetPagination));
handleIncomePaginationEvent(incomePagination.updateDOMOnPagination.bind(incomePagination));
handleExpensePaginationEvent(expensePagination.updateDOMOnPagination.bind(expensePagination));
handleIncomeCategoryPaginationEvent(incomeCategoryPagination.updateDOMOnPagination.bind(incomeCategoryPagination));
handleExpenseCategoryPaginationEvent(expenseCategoryPagination.updateDOMOnPagination.bind(expenseCategoryPagination));

handleDeleteCategoryEvent(
  deleteIncomeCategory.delete.bind(deleteIncomeCategory),
  deleteExpenseCategory.delete.bind(deleteExpenseCategory)
);
