class BudgetElements {
  getBudgetContainer(): HTMLFormElement {
    return document.querySelector('.month-box');
  }
  getBudgetCount(): string {
    return this.getBudgetContainer().dataset.value;
  }
  getDate(): string {
    return (document.querySelector('.month-box__date') as HTMLHeadingElement).innerText;
  }
  updateDate(date: string): void {
    document.querySelector('.month-box__date').textContent = date;
  }
  set setBudget(budget: number) {
    document.querySelector('.income-box__heading--sub').textContent = '' + budget;
  }
  updateBudget(budget: string, type: 'income' | 'expense'): void {
    let UIBudget: number = +document.querySelector('.income-box__heading--sub').textContent;

    if (type === 'income') UIBudget += +budget;
    else UIBudget -= +budget;

    document.querySelector('.income-box__heading--sub').textContent = UIBudget.toString();
  }
}

export default new BudgetElements();
