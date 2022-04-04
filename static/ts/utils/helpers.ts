export function validDate(date: string, validationDate: string): boolean {
  const month = constructDate('month', date);
  const year = constructDate('year', date);

  const categoryMonth = constructDate('month', validationDate);
  const categoryYear = constructDate('year', validationDate);

  if (month !== categoryMonth || year !== categoryYear) return false;
  return true;
}

/**
 *
 * Constructs date as month, year, day or full date and returns it as a string.
 * @param dateType Type of date this function should construct must be either
 * 'month', 'year', 'day', or 'date'
 * @param dateValue date value on which to construct the date.
 * @returns date value as string.
 *
 **/
export function constructDate(dateType: 'month' | 'year' | 'day', dateValue: string): string {
  if (dateType === 'month') return ('0' + (new Date(dateValue).getMonth() + 1)).slice(-2);
  else if (dateType === 'year') return '' + new Date(dateValue).getFullYear();
  else if (dateType === 'day') return ('0' + new Date(dateValue).getDate()).slice(-2);
  else return dateValue;
}

export function formatDate(fullDate: string): string {
  const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let month = new Date(fullDate).getMonth() + 1;
  let date = ('0' + new Date(fullDate).getDate()).slice(-2);
  let year = '' + new Date(fullDate).getFullYear();

  return `${months[month - 1]} ${date}, ${year}`;
}

export function constructBudgetDate(dateString: string) {
  const months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return `${months[new Date(dateString).getMonth()]} ${constructDate('year', dateString)}`;
}
