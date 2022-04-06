import { viewState } from 'app';
import viewElements from '@DOMElements/view';
import { renderMessage } from '@views/errorView';
import { AddButton } from '@components/addButton';
import budgetElements from '@DOMElements/budget';
import categoryElements from '@DOMElements/category';
import { CategoryComponent } from '@components/category';
import { saveCategory, saveIncomeAndExpense } from '@models/Model';
import incomeAndExpenseElements from '@DOMElements/incomeAndExpense';
import { ExpenseCategoryButton } from '@components/expenseCategoryButton';
import { IncomeAndExpenseComponent } from '@budgetViews/components/incomeAndExpense';
import { formatDate, constructBudgetDate, validDate, constructDate } from '@utils/helpers';
import {
  CategoryPaginationButton,
  IncomeAndExpensePaginationButton,
  BudgetPaginationButton,
} from '@budgetViews/components/paginationButtons';

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
  private addButton: AddButton;
  private categoryComponent: CategoryComponent;
  private budgetPageButton: BudgetPaginationButton;
  private categoryPageButton: CategoryPaginationButton;

  async init(): Promise<void> {
    if (viewState.state.buttonType === 'add-expense-category') {
      if (!validDate(viewState.state.inputDate, formatDate(budgetElements.getDate()))) {
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
    this.categoryComponent = new CategoryComponent(
      categoryElements.getFormElement(`${this.componentId}s`),
      +categoryElements.getFormAttributeValue(`${this.componentId}s`)
    );
    this.categoryComponent.renderComponent(
      'beforeend',
      this.categoryComponent.getComponentMarkup(
        this.componentId,
        viewState.state.inputTitle,
        formatDate(viewState.state.inputDate)
      )
    );

    // Category date is different from current budget date.
    if (viewState.state.categoryDate) {
      if (
        constructDate('month', viewState.state.inputDate) !== constructDate('month', viewState.state.categoryDate) ||
        constructDate('year', viewState.state.inputDate) !== constructDate('year', viewState.state.categoryDate)
      ) {
        this.budgetPageButton = new BudgetPaginationButton(
          budgetElements.getBudgetContainer(),
          +budgetElements.getBudgetCount()
        );
        this.budgetPageButton.renderComponent('beforeend', this.budgetPageButton.getComponentMarkup('next'));
        budgetElements.getBudgetContainer().dataset.value = (+budgetElements.getBudgetCount() + 1).toString();
        return;
      }
    }

    this.categoryPageButton = new CategoryPaginationButton(
      categoryElements.getFormElement(`${this.componentId}s`),
      +categoryElements.getFormAttributeValue(`${this.componentId}s`)
    );
    this.categoryPageButton.renderComponent(
      'beforeend',
      this.categoryPageButton.getComponentMarkup(
        'next',
        viewState.state.buttonType as 'add-income-category' | 'add-expense-category'
      )
    );

    this.addButton = new AddButton(
      incomeAndExpenseElements.getBoxLeft(`${this.componentId}s`),
      +categoryElements.getFormAttributeValue(`${this.componentId}s`)
    );
    this.addButton.renderComponent('afterbegin', this.addButton.getComponentMarkup(this.componentId));

    this.categoryComponent.updateComponentState(
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
  private incomeAndExpense: IncomeAndExpenseComponent;
  private expenseCategoryButton: ExpenseCategoryButton;
  private incomeAndExpensePageButton: IncomeAndExpensePaginationButton;

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
    this.incomeAndExpense = new IncomeAndExpenseComponent(
      incomeAndExpenseElements.getFormElement(`${this.componentId}s`),
      +incomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`)
    );
    this.incomeAndExpense.renderComponent(
      'beforeend',
      this.incomeAndExpense.getComponentMarkup(
        this.componentId,
        viewState.state.inputTitle,
        viewState.state.inputAmount,
        formatDate(viewState.state.inputDate)
      )
    );

    this.incomeAndExpensePageButton = new IncomeAndExpensePaginationButton(
      incomeAndExpenseElements.getFormElement(`${this.componentId}s`),
      +incomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`)
    );
    this.incomeAndExpensePageButton.renderComponent(
      'beforeend',
      this.incomeAndExpensePageButton.getComponentMarkup(
        'next',
        viewState.state.buttonType as 'add-income' | 'add-expense'
      )
    );

    this.incomeAndExpense.updateComponentState(
      incomeAndExpenseElements.getFormElement(`${this.componentId}s`),
      +incomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`) + 1
    );

    if (
      this.componentId === 'income' &&
      !(categoryElements.getExpenseCategoryContainer().children[0] instanceof HTMLButtonElement)
    ) {
      this.expenseCategoryButton = new ExpenseCategoryButton(
        categoryElements.getExpenseCategoryContainer(),
        +incomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`)
      );
      this.expenseCategoryButton.renderComponent('afterbegin', this.expenseCategoryButton.getComponentMarkup());
    }
    budgetElements.updateBudget(viewState.state.inputAmount, `${this.componentId}`);
  }
}

export const renderCategory = new RenderCategory();
export const renderIncomeAndExpense = new RenderIncomeAndExpense();
