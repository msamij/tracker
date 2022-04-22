/**
 * This class provide APi's to manipulate DOM for the Budget.
 */
export class BudgetElements {
  private constructor() {}

  static getBudgetContainer(): HTMLFormElement {
    return document.querySelector('.month-box');
  }
  static getBudgetCount(): string {
    return this.getBudgetContainer().dataset.value;
  }
  static getDate(): string {
    return (document.querySelector('.month-box__date') as HTMLHeadingElement).innerText;
  }
  static updateDate(date: string): void {
    document.querySelector('.month-box__date').textContent = date;
  }
  static set setBudget(budget: number) {
    document.querySelector('.income-box__heading--sub').textContent = '' + budget;
  }
  static updateBudget(budget: string, type: 'income' | 'expense'): void {
    let UIBudget: number = +document.querySelector('.income-box__heading--sub').textContent;

    if (type === 'income') UIBudget += +budget;
    else UIBudget -= +budget;

    document.querySelector('.income-box__heading--sub').textContent = UIBudget.toString();
  }
}
