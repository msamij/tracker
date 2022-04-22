import { PaginationDOMUpdateAdapter } from '@budgetViews/pagination/paginationView';
import { IncomeAndExpensePaginationButton } from '@components/paginationButtons';
import { BudgetElements } from '@DOMElements/budget';
import { CategoryElements } from '@DOMElements/category';
import { IncomeAndExpenseElements } from '@DOMElements/incomeAndExpense';
import { Model } from '@models/Model';
import {
  BUDGET_MENU_URL,
  EXPENSE_CATEGORY_PAGE_URL,
  EXPENSE_PAGE_URL,
  INCOME_CATEGORY_PAGE_URL,
  INCOME_PAGE_URL,
} from '@utils/config';
import { constructDate } from '@utils/helpers';
import { viewState } from 'app';

abstract class DeleteItem extends PaginationDOMUpdateAdapter {
  protected abstract parent: HTMLFormElement;
  protected abstract getCurrentPage(): number;
  protected abstract parentDataSetAttribute: (type: 'incomes' | 'expenses') => string;

  constructor(protected type: 'income' | 'expense') {
    super();
    this.type = type;
  }

  protected deleteIncomeAndExpenseOnUI(): void {
    if (+IncomeAndExpenseElements.getFormAttributeValue(`${this.type}s`) > 0) {
      while (IncomeAndExpenseElements.getFormElement(`${this.type}s`).firstChild) {
        IncomeAndExpenseElements.getFormElement(`${this.type}s`).firstChild.remove();
      }
    }
  }

  protected updateButtonsForPageOne(): void {
    if (this.parent.children[0] instanceof HTMLButtonElement) this.parent.children[0].remove();
    if (this.parent.children[2] instanceof HTMLButtonElement) this.parent.children[2].remove();
  }

  // This'll execute when current page > 1
  protected updateButtonsOnPageDelete(): void {
    if (this.getCurrentPage() === +this.parentDataSetAttribute(`${this.type}s`)) {
      if (this.parent.children[1] instanceof HTMLButtonElement) this.parent.children[1].remove();
      if (this.parent.children[2] instanceof HTMLButtonElement) this.parent.children[2].remove();
    }

    // If we got back to first page.
    if (+this.parentDataSetAttribute(`${this.type}s`) === 1) {
      this.updateButtonsForPageOne();
      return;
    }
  }

  protected removeAddExpenseCategoryButtonOnPageDelete(): void {
    if (
      !+CategoryElements.getFormAttributeValue('expenses') &&
      !+IncomeAndExpenseElements.getFormAttributeValue('incomes') &&
      CategoryElements.getBoxRight('expense').children[0] instanceof HTMLButtonElement
    ) {
      CategoryElements.getAddCategoryButton('expense').remove();
    }
  }

  protected async updateBudget(): Promise<void> {
    const { budget } = await this.getJsonDataAsString(
      `${BUDGET_MENU_URL}budget/?month=${constructDate('month', BudgetElements.getDate())}&year=${constructDate(
        'year',
        BudgetElements.getDate()
      )}`
    );
    BudgetElements.setBudget = budget;
  }
}

export class DeleteCategory extends DeleteItem {
  protected data: Model;
  protected parent: HTMLFormElement;
  protected parentDataSetAttribute: (type: 'incomes' | 'expenses') => string;

  constructor(
    protected type: 'income' | 'expense',
    protected getJsonDataAsString: (url: string) => Promise<Model>,
    private requestDeleteCategory: (
      type: 'income' | 'expense',
      title: string,
      month: string,
      year: string
    ) => Promise<void>
  ) {
    super(type);
    this.getJsonDataAsString = getJsonDataAsString;
    this.requestDeleteCategory = requestDeleteCategory;
    this.parent = CategoryElements.getFormElement(`${this.type}s`);
    this.parentDataSetAttribute = CategoryElements.getFormAttributeValue.bind(CategoryElements);
  }

  async delete(): Promise<void> {
    // All these must be done in the same order.
    await this.deleteCategory();
    await this.updateBudget();

    if (+CategoryElements.getFormAttributeValue(`${this.type}s`) === 1) {
      this.updateUIOnPageOneDelete();
      this.updateStateOnPageOneDelete();
      this.removeAddExpenseCategoryButtonOnPageDelete();
    }
    //
    else if (+CategoryElements.getFormAttributeValue(`${this.type}s`) > 1) {
      this.updateStateOnPageDelete();
      this.updateButtonsOnPageDelete();
      await this.getNewData();
      this.updateUIOnPageDelete();
    }
  }

  private async deleteCategory(): Promise<void> {
    await this.requestDeleteCategory(
      this.type,
      CategoryElements.getCategoryTitle(this.type),
      constructDate('month', CategoryElements.getCategoryDate(this.type)),
      constructDate('year', CategoryElements.getCategoryDate(this.type))
    );
  }

  private async getNewData(): Promise<void> {
    const baseUrl = this.type === 'income' ? INCOME_CATEGORY_PAGE_URL : EXPENSE_CATEGORY_PAGE_URL;
    const currentPage = this.getCurrentPage();

    await this.saveData(
      `${baseUrl}${currentPage}/?month=${+constructDate(
        'month',
        CategoryElements.getCategoryDate(`${this.type}`)
      )}&year=${+constructDate('year', CategoryElements.getCategoryDate(`${this.type}`))}`
    );
  }

  private updateUIOnPageOneDelete(): void {
    while (CategoryElements.getFormElement(`${this.type}s`).firstChild) {
      CategoryElements.getFormElement(`${this.type}s`).firstChild.remove();
    }

    IncomeAndExpenseElements.getAddButton(`${this.type}`).remove();
    this.deleteIncomeAndExpenseOnUI();
  }

  private updateStateOnPageOneDelete(): void {
    CategoryElements.setFormAttributeValue(`${this.type}s`, 0);
    IncomeAndExpenseElements.setFormAttributeValue(`${this.type}s`, 0);
  }

  // This'll execute when current page > 1
  private updateUIOnPageDelete(): void {
    this.type === 'income' ? this.validateAndUpdateIncomeCategory() : this.updateExpenseCategory();

    this.validateAndUpdateIncomeAndExpense(
      `${this.type}`,
      +IncomeAndExpenseElements.getFormAttributeValue(`${this.type}s`),
      this.type === 'income' ? this.data.incomeCount : this.data.expenseCount
    );

    this.updateButtons(
      viewState.state.prevCount,
      this.type == 'income' ? this.data.incomeCount : this.data.expenseCount,
      IncomeAndExpenseElements.getFormElement(`${this.type}s`),
      new IncomeAndExpensePaginationButton().getComponentMarkup('next', `add-${this.type}`)
    );
  }

  private updateStateOnPageDelete(): void {
    CategoryElements.setFormAttributeValue(
      `${this.type}s`,
      +CategoryElements.getFormAttributeValue(`${this.type}s`) - 1
    );

    if (this.getCurrentPage() > +CategoryElements.getFormAttributeValue(`${this.type}s`)) {
      this.type === 'income'
        ? (viewState.state.currentIncomeCategoryPage = +CategoryElements.getFormAttributeValue('incomes'))
        : (viewState.state.currentExpenseCategoryPage = +CategoryElements.getFormAttributeValue('expenses'));
    }
  }

  protected getCurrentPage(): number {
    return this.type === 'income'
      ? viewState.state.currentIncomeCategoryPage
      : viewState.state.currentExpenseCategoryPage;
  }
}

export class DeleteIncomeAndExpense extends DeleteItem {
  protected data: Model;
  protected parent: HTMLFormElement;
  protected parentDataSetAttribute: (type: 'incomes' | 'expenses') => string;

  constructor(
    protected type: 'income' | 'expense',
    protected getJsonDataAsString: (url: string) => Promise<Model>,
    private requestDeleteIncomeAndExpense: (
      type: 'income' | 'expense',
      title: string,
      categoryTitle: string,
      month: string,
      year: string
    ) => Promise<void>
  ) {
    super(type);
    this.getJsonDataAsString = getJsonDataAsString;
    this.requestDeleteIncomeAndExpense = requestDeleteIncomeAndExpense;
    this.parent = IncomeAndExpenseElements.getFormElement(`${this.type}s`);
    this.parentDataSetAttribute = IncomeAndExpenseElements.getFormAttributeValue.bind(IncomeAndExpenseElements);
  }

  async delete(): Promise<void> {
    // All these must be done in the same order.
    await this.deleteIncomeAndExpense();
    await this.updateBudget();

    if (+IncomeAndExpenseElements.getFormAttributeValue(`${this.type}s`) === 1) {
      this.deleteIncomeAndExpenseOnUI();
      this.updateStateOnPageOneDelete();
      this.removeAddExpenseCategoryButtonOnPageDelete();
    }
    //
    else if (+IncomeAndExpenseElements.getFormAttributeValue(`${this.type}s`) > 1) {
      this.updateStateOnPageDelete();
      this.updateButtonsOnPageDelete();
      await this.getNewData();
      this.updateUIOnPageDelete();
    }
  }

  private async deleteIncomeAndExpense(): Promise<void> {
    await this.requestDeleteIncomeAndExpense(
      this.type,
      IncomeAndExpenseElements.getIncomeAndExpenseTitle(this.type),
      CategoryElements.getCategoryTitle(this.type),
      constructDate('month', IncomeAndExpenseElements.getIncomeAndExpenseDate(this.type)),
      constructDate('year', IncomeAndExpenseElements.getIncomeAndExpenseDate(this.type))
    );
  }

  private async getNewData(): Promise<void> {
    const baseUrl = this.type === 'income' ? INCOME_PAGE_URL : EXPENSE_PAGE_URL;
    const currentPage = this.getCurrentPage();

    await this.saveData(
      `${baseUrl}${currentPage}/?month=${+constructDate(
        'month',
        IncomeAndExpenseElements.getIncomeAndExpenseDate(`${this.type}`)
      )}&year=${+constructDate(
        'year',
        IncomeAndExpenseElements.getIncomeAndExpenseDate(`${this.type}`)
      )}&title=${CategoryElements.getCategoryTitle(`${this.type}`)}`
    );
  }

  // This'll execute when current page > 1
  private updateUIOnPageDelete(): void {
    this.validateAndUpdateIncomeAndExpense(
      `${this.type}`,
      +IncomeAndExpenseElements.getFormAttributeValue(`${this.type}s`),
      this.type === 'income' ? this.data.incomeCount : this.data.expenseCount
    );

    this.updateButtons(
      viewState.state.prevCount,
      this.type == 'income' ? this.data.incomeCount : this.data.expenseCount,
      IncomeAndExpenseElements.getFormElement(`${this.type}s`),
      new IncomeAndExpensePaginationButton().getComponentMarkup('next', `add-${this.type}`)
    );
  }

  private updateStateOnPageDelete(): void {
    IncomeAndExpenseElements.setFormAttributeValue(
      `${this.type}s`,
      +IncomeAndExpenseElements.getFormAttributeValue(`${this.type}s`) - 1
    );

    if (this.getCurrentPage() > +IncomeAndExpenseElements.getFormAttributeValue(`${this.type}s`)) {
      this.type === 'income'
        ? (viewState.state.currentIncomePage = +IncomeAndExpenseElements.getFormAttributeValue('incomes'))
        : (viewState.state.currentExpensePage = +IncomeAndExpenseElements.getFormAttributeValue('expenses'));
    }
  }

  private updateStateOnPageOneDelete(): void {
    IncomeAndExpenseElements.setFormAttributeValue(`${this.type}s`, 0);
  }

  protected getCurrentPage(): number {
    return this.type === 'income' ? viewState.state.currentIncomePage : viewState.state.currentExpensePage;
  }
}
