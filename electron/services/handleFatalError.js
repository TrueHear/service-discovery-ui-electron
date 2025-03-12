/**
 * Handles fatal errors in the app by logging and optionally displaying an error message.
 *
 * @param {Error} error - The error to handle.
 * @param {Electron.App} app - The Electron app instance.
 * @param {Electron.Dialog} dialog - The Electron dialog module.
 */
function handleFatalError(error, app, dialog) {
  console.error('[-] Fatal Error:', error.message);
  console.error(error.stack);

  // Show an error message box to the user
  if (dialog) {
    dialog.showErrorBox('Fatal Error', `An unexpected error occurred:\n\n${error.message}`);
  }

  // Exit the app to prevent further issues
  if (app) {
    app.quit();
  }
}

export default handleFatalError;
