import { processPostRequest } from '@AJAX/Ajax';
import { AuthView } from '@views/authViews/authView';
import { renderMessage } from '@views/errorView';

async function controlFormSubmit(): Promise<void> {
  // disble form buttons while form being submitted to server.
  authView.toggleButtonClick(true);

  const response = await processPostRequest(
    {
      username: authView.username(),
      password1: authView.password(),
      password2: authView.confirmPassword(),
    },
    authView.url()
  );

  if (response === 'success') location.replace('/budget-menu/');
  else {
    authView.toggleButtonClick(false);
    renderMessage(authView.errorNode, response);
  }
}

const authView = new AuthView(controlFormSubmit);
