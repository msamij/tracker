import { viewState } from 'app';
import viewElements from '@budgetViews/state';
import { renderMessage } from '@views/errorView';
import budgetElements from '@budgetViews/budgetView';
import { CategoryComponent } from '@components/category';
import categoryElements from '@budgetViews/categoryView';
import { AddButtonComponent } from '@components/addButton';
import { saveCategory, saveIncomeAndExpense } from '@models/Model';
import incomeAndExpenseElements from '@budgetViews/incomeAndExpenseView';
import { ExpenseCategoryButton } from '@components/expenseCategoryButton';
import { IncomeAndExpenseComponent } from '@budgetViews/components/incomeAndExpense';
import { formatDate, constructBudgetDate, validDate, constructDate } from '@utils/helpers';
import {
  CategoryPaginationButton,
  IncomeAndExpensePaginationButton,
  BudgetPaginationButton,
} from '@budgetViews/components/paginationButtons';
import budgetView from '@budgetViews/budgetView';

abstract class RenderValidator {
  protected abstract renderComponent(): void;
  protected componentId: 'income' | 'expense';

  protected validateAndRenderComponent(response: string): void {
    if (response !== 'success') renderMessage(viewElements.getMessageElement(), response);
    else {
      if (viewState.state.buttonType === 'add-income' || viewState.state.buttonType === 'add-income-category')
        this.componentId = 'income';
      else this.componentId = 'expense';
      renderMessage(viewElements.getMessageElement(), 'Successfully added 😀');
      this.renderComponent();
    }
  }
}

class RenderCategory extends RenderValidator {
  private component: CategoryComponent;

  async init(): Promise<void> {
    if (viewState.state.buttonType === 'add-expense-category') {
      if (!validDate(viewState.state.inputDate, formatDate(budgetView.getDate()))) {
        renderMessage(
          viewElements.getMessageElement(),
          `Date field must contain month ${constructDate(
            'month',
            viewState.state.categoryDate
          )} and year ${constructDate('year', viewState.state.categoryDate)}.`
        );
        return;
      }
    }

    this.validateAndRenderComponent(
      await saveCategory(viewState.state.buttonType, viewState.state.inputDate, viewState.state.inputTitle)
    );
  }

  protected renderComponent(): void {
    this.component = new CategoryComponent({
      count: +categoryElements.getFormAttributeValue(`${this.componentId}s`),
      parent: categoryElements.getFormElement(`${this.componentId}s`),
      title: viewState.state.inputTitle,
      date: formatDate(viewState.state.inputDate),
      type: this.componentId,
    });
    this.component.renderComponent('beforeend');

    // Category date is different from current budget date.
    if (viewState.state.categoryDate) {
      if (
        constructDate('month', viewState.state.inputDate) !== constructDate('month', viewState.state.categoryDate) ||
        constructDate('year', viewState.state.inputDate) !== constructDate('year', viewState.state.categoryDate)
      ) {
        new BudgetPaginationButton({
          count: +budgetElements.getBudgetCount(),
          parent: budgetElements.getBudgetContainer(),
          pageType: 'next',
        }).renderComponent('beforeend');

        budgetElements.getBudgetContainer().dataset.value = (+budgetElements.getBudgetCount() + 1).toString();
        return;
      }
    }

    new CategoryPaginationButton(
      categoryElements.getFormElement(`${this.componentId}s`),
      +categoryElements.getFormAttributeValue(`${this.componentId}s`)
    ).renderComponent('beforeend');

    new AddButtonComponent({
      count: +categoryElements.getFormAttributeValue(`${this.componentId}s`),
      parent: incomeAndExpenseElements.getBoxLeft(`${this.componentId}s`),
      buttonType: this.componentId,
    }).renderComponent('afterbegin');

    this.component.updateComponentState(
      categoryElements.getFormElement(`${this.componentId}s`),
      +categoryElements.getFormAttributeValue(`${this.componentId}s`) + 1
    );

    if (+budgetElements.getBudgetContainer().dataset.value >= 1) return;
    else budgetElements.getBudgetContainer().dataset.value = '1';

    if (budgetElements.getDate() === '') {
      budgetElements.updateDate(constructBudgetDate(viewState.state.inputDate));
    }
  }
}

class RenderIncomeAndExpense extends RenderValidator {
  private component: IncomeAndExpenseComponent;

  async init(): Promise<void> {
    if (!validDate(viewState.state.inputDate, viewState.state.categoryDate)) {
      renderMessage(
        viewElements.getMessageElement(),
        `Date field must contain month ${constructDate('month', viewState.state.categoryDate)} and year ${constructDate(
          'year',
          viewState.state.categoryDate
        )}.`
      );
      return;
    }

    this.validateAndRenderComponent(
      await saveIncomeAndExpense(
        viewState.state.buttonType,
        viewState.state.inputDate,
        viewState.state.inputTitle,
        viewState.state.inputAmount,
        viewState.state.categoryTitle
      )
    );
  }

  protected renderComponent(): void {
    this.component = new IncomeAndExpenseComponent({
      count: +incomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`),
      parent: incomeAndExpenseElements.getFormElement(`${this.componentId}s`),
      title: viewState.state.inputTitle,
      amount: viewState.state.inputAmount,
      date: formatDate(viewState.state.inputDate),
      type: this.componentId,
    });
    this.component.renderComponent('beforeend');

    new IncomeAndExpensePaginationButton({
      count: +incomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`),
      parent: incomeAndExpenseElements.getFormElement(`${this.componentId}s`),
      buttonType: viewState.state.buttonType,
      pageType: 'next',
    }).renderComponent('beforeend');

    this.component.updateComponentState(
      incomeAndExpenseElements.getFormElement(`${this.componentId}s`),
      +incomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`) + 1
    );

    if (
      this.componentId === 'income' &&
      !(categoryElements.getExpenseCategoryContainer().children[0] instanceof HTMLButtonElement)
    )
      new ExpenseCategoryButton({
        count: +incomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`),
        parent: categoryElements.getExpenseCategoryContainer(),
      }).renderComponent('afterbegin');

    budgetElements.updateBudget(viewState.state.inputAmount, `${this.componentId}`);
  }
}

export const renderCategory = new RenderCategory();
export const renderIncomeAndExpense = new RenderIncomeAndExpense();

// new CategoryPaginationButton({
//   componentParent: categoryElements.getFormElement(`${this.componentId}s`),
//   componentCount: +categoryElements.getFormAttributeValue(`${this.componentId}s`),
//   buttonType: viewState.state.buttonType as 'add-income-category' | 'add-expense-category',
//   pageType: 'next',
// }).renderComponent('beforeend');
