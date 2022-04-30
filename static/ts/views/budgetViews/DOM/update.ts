import { CategoryElements } from '@DOMElements/category';
import { IncomeAndExpenseElements } from '@DOMElements/incomeAndExpense';
import { Model } from '@models/Model';
import { constructDate } from '@utils/helpers';
import { viewState } from 'app';
import { BudgetElements } from '../DOMElements/budget';

export class UpdateCategory {
  private categoryType: 'income' | 'expense';

  constructor(
    private requestUpdateCategory: (
      type: 'income' | 'expense',
      year: string,
      month: string,
      title: string,
      newTitle: string
    ) => Promise<void>
  ) {}

  async updateCategory(): Promise<void> {
    viewState.state.buttonType === 'edit-income-category'
      ? (this.categoryType = 'income')
      : (this.categoryType = 'expense');

    await this.requestUpdateCategory(
      this.categoryType,
      constructDate('year', CategoryElements.getCategoryDate(this.categoryType)),
      constructDate('month', CategoryElements.getCategoryDate(this.categoryType)),
      CategoryElements.getCategoryTitle(this.categoryType),
      viewState.state.inputTitle
    );

    CategoryElements.setCategoryTitle(this.categoryType, viewState.state.inputTitle);
  }
}

export class UpdateIncomeAndExpense {
  private type: 'income' | 'expense';

  constructor(
    private requestUpdateIncomeAndExpense: (
      type: 'income' | 'expense',
      year: string,
      month: string,
      title: string,
      newTitle: string,
      categoryTitle: string,
      newAmount: string
    ) => Promise<Model>
  ) {}

  async updateIncomeAndExpense(): Promise<void> {
    viewState.state.buttonType === 'edit-income' ? (this.type = 'income') : (this.type = 'expense');

    const { budget } = await this.requestUpdateIncomeAndExpense(
      this.type,
      constructDate('year', IncomeAndExpenseElements.getIncomeAndExpenseDate(this.type)),
      constructDate('month', IncomeAndExpenseElements.getIncomeAndExpenseDate(this.type)),
      IncomeAndExpenseElements.getIncomeAndExpenseTitle(this.type),
      viewState.state.inputTitle,
      CategoryElements.getCategoryTitle(this.type),
      viewState.state.inputAmount
    );

    IncomeAndExpenseElements.setIncomeAndExpenseTitle(this.type, viewState.state.inputTitle);
    IncomeAndExpenseElements.setIncomeAndExpenseAmount(this.type, +viewState.state.inputAmount);
    BudgetElements.setBudget = budget;
  }
}
