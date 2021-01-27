const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let clearTimerDisposable = vscode.commands.registerCommand(
    "no-chubby.stopTimer",
    async () => {
      const id = context.workspaceState.get("currentTimerId");
      if (!id) {
        vscode.window.showInformationMessage("I didn't found any to stop");
        return;
      }

      clearInterval(id);
      vscode.window.showInformationMessage(
        "I cleared the Timer before i repeated it 1000 times"
      );
      context.workspaceState.update("currentTimerId", null);
    }
  );

  // Start New Timer
  let startTimerDisposable = vscode.commands.registerCommand(
    "no-chubby.startTimer",
    async () => {
      const message = await vscode.window.showInputBox();
      if (!message === undefined) return;
      const rawMinutes = parseInt(await vscode.window.showInputBox());
      if (rawMinutes === undefined) return;
      const minutes = parseInt(rawMinutes);
      if (isNaN(minutes)) {
        vscode.window.showInformationMessage(
          "The value for NaN (Not a number)"
        );
        return;
      }

      let looped = 1; // once
      const id = setInterval(() => {
        if (looped > 1000) {
          clearInterval(id);
          vscode.window.showInformationMessage(
            "Stopping the timer. Repeated 1000 times"
          );
        }
        vscode.window.showInformationMessage(
          `Hey reminding you :) "${message}"`,
          "Ok"
        );
      }, minutes);

      vscode.window.showInformationMessage(
        `Started a timer for ${minutes} to remind "${message}"`
      );
      context.workspaceState.update("currentTimerId", id);
    }
  );

  context.subscriptions.push(clearTimerDisposable, startTimerDisposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
