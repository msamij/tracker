import { csrfToken } from '@utils/token';

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
