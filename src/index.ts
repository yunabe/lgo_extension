import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the lgo_extension extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'lgo_extension',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension lgo_extension is activated!');
  }
};

export default extension;
