import { BudgetPagination } from '@budgetViews/pagination/budget';
import { CategoryPagination } from '@budgetViews/pagination/category';
import { IncomeAndExpensePagination } from '@budgetViews/pagination/incomeAndExpense';
import { ViewState } from '@budgetViews/state';
import { DeleteCategory, DeleteIncomeAndExpense } from '@DOM/delete';
import { RenderCategory, RenderIncomeAndExpense } from '@DOM/render';
import { UpdateCategory, UpdateIncomeAndExpense } from '@views/budgetViews/DOM/update';
import { CategoryElements } from '@DOMElements/category';
import { PopupMenuElements } from '@DOMElements/popup';
import {
  handleFormSubmitEvent,
  handleBudgetPaginationEvent,
  handleDeleteCategoryEvent,
  handleDeleteIncomeAndExpenseEvent,
  handleExpenseCategoryPaginationEvent,
  handleExpensePaginationEvent,
  handleIncomeCategoryPaginationEvent,
  handleIncomePaginationEvent,
  handleOverlayEvent,
  handlePopupMenuEvent,
  handlePopupMenuUpdateEvent,
} from '@events/event';
import {
  getJsonDataAsString,
  requestDeleteCategory,
  requestDeleteIncomeAndExpense,
  requestUpdateCategory,
  requestUpdateIncomeAndExpense,
  saveCategory,
  saveIncomeAndExpense,
} from '@models/Model';

// ADMIN PASSWORD: c056BH89Pm
// TODO:
// 1: Implement Pagination on budget, categories, incomes and expenses (DONE NEEDS TESTING).
// 2: Implement Delete action on incomeCategory, expenseCategory, incomes and expenses (DONE NEEDS TESTING).
// 3: Implement Modify action on incomeCategory, expenseCategory and incomes and expenses (DONE NEEDS TESTING).

export const viewState = new ViewState(PopupMenuElements, CategoryElements);

// PAGINATION
const budgetPagination = new BudgetPagination(getJsonDataAsString);
const incomePagination = new IncomeAndExpensePagination('income', getJsonDataAsString);
const expensePagination = new IncomeAndExpensePagination('expense', getJsonDataAsString);
const incomeCategoryPagination = new CategoryPagination('income', getJsonDataAsString);
const expenseCategoryPagination = new CategoryPagination('expense', getJsonDataAsString);

const renderCategory = new RenderCategory(getJsonDataAsString, saveCategory);
const renderIncomeAndExpense = new RenderIncomeAndExpense(saveIncomeAndExpense);

// DELETE
const deleteIncomeCategory = new DeleteCategory('income', getJsonDataAsString, requestDeleteCategory);
const deleteExpenseCategory = new DeleteCategory('expense', getJsonDataAsString, requestDeleteCategory);
const deleteIncome = new DeleteIncomeAndExpense('income', getJsonDataAsString, requestDeleteIncomeAndExpense);
const deleteExpense = new DeleteIncomeAndExpense('expense', getJsonDataAsString, requestDeleteIncomeAndExpense);

// UPDATE
const updateCategory = new UpdateCategory(requestUpdateCategory);
const updateIncomeAndExpense = new UpdateIncomeAndExpense(requestUpdateIncomeAndExpense);

handlePopupMenuEvent();
handlePopupMenuUpdateEvent();
handleOverlayEvent();

handleFormSubmitEvent(
  renderCategory.render.bind(renderCategory),
  renderIncomeAndExpense.render.bind(renderIncomeAndExpense),
  updateCategory.updateCategory.bind(updateCategory),
  updateIncomeAndExpense.updateIncomeAndExpense.bind(updateIncomeAndExpense)
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
handleDeleteIncomeAndExpenseEvent(deleteIncome.delete.bind(deleteIncome), deleteExpense.delete.bind(deleteExpense));
