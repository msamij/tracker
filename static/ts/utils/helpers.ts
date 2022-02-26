import { csrfToken } from '@utils/token';

export function validDate(date: string, categoryDate: string): boolean {
  const month = constructDate('month', date);
  const year = constructDate('year', date);

  const categoryMonth = constructDate('month', categoryDate);
  const categoryYear = constructDate('year', categoryDate);

  if (month !== categoryMonth || year !== categoryYear) return false;
  return true;
}

/**
 *
 * @param requestBody object.
 * @param url string.
 * @returns response as promise string.
 *
 **/
export async function processPostRequest(requestBody: {}, url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken('csrftoken'),
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = response.text().then(function (res) {
      return res;
    });
    return responseText;
  } catch (error) {
    throw new Error(error);
  }
}

export async function processGetRequest(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const responseText = response.text().then(function (res) {
      return res;
    });
    return responseText;
  } catch (error) {
    throw new Error(error);
  }
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
  const months: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

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
