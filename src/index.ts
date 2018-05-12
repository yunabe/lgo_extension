import {
  IDisposable, DisposableDelegate
} from '@phosphor/disposable';

import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  ToolbarButton
} from '@jupyterlab/apputils';

import {
    CodeCell
} from '@jupyterlab/cells';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';

import {
  KernelMessage
} from '@jupyterlab/services';


/**
 *
 * Refs:
 *  http://jupyterlab.github.io/jupyterlab/modules/_services_src_kernel_messages_.kernelmessage.html#createshellmessage
 *  https://github.com/jupyterlab/jupyterlab/blob/c9c199cca4724532a55d2517a6ab1cb77c67e329/packages/services/src/kernel/default.ts#L397
 */
function addFormatButton(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): ToolbarButton {
  let callback = () => {
    let kernel = context.session.kernel;
    if (!kernel) {
      return;
    }
    let notebook = panel.notebook;
    if (!notebook) {
      return;
    }
    let active = notebook.activeCell;
     if (!active) {
      return;
    }
    if (!(active instanceof CodeCell)) {
      return;
    }
     let options: KernelMessage.IOptions = {
      msgType: 'gofmt_request',
      channel: 'shell',
      username: kernel.username,
      session: kernel.clientId
    };
    let content = {
      code: active.model.value.text,
    };
    let future = kernel.sendShellMessage(KernelMessage.createShellMessage(options, content), true);
    future.onReply = (reply: KernelMessage.IShellMessage)=>{
      let content = reply.content;
      if (content.status == "ok") {
        active.model.value.text = content.code as string;
      }
    };
  };
  let button = new ToolbarButton({
    className: 'formatGoButton',
    onClick: callback,
    tooltip: 'Format Go'
  });
  let i = document.createElement('i');
  i.classList.add('fa', 'fa-align-left');
  button.node.appendChild(i);
  panel.toolbar.insertItem(5, 'formatGo', button);
  return button;
}

class ButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
    let button: ToolbarButton = null;
    context.session.kernelChanged.connect(()=>{
      if (button || context.session.kernel.name != 'lgo') {
        return;
      }
      button = addFormatButton(panel, context);
    });
    return new DisposableDelegate(() => {
      if (button) {
        button.dispose();
      }
    });
  }
};

/**
 * Initialization data for the lgo_extension extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'lgo_extension',
  autoStart: true,
  activate: activate
};

/**
 * Activate the extension.
 */
function activate(app: JupyterLab) {
  app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());
};

export default extension;
