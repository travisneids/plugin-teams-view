import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import reducers, { namespace } from './states';

const PLUGIN_NAME = 'TeamsViewPlugin';

export default class TeamsViewPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);

    const workerLocationsArray = flex.Manager.getInstance().workerClient.attributes.locations
    // node strips the quotes but necessary for our query so extra work below
    const workerLocationsQuoted = "'" + workerLocationsArray.join("','") + "'";

    // setup a hidden filter - data.attributes is our target of list of workers
    flex.TeamsView.defaultProps.hiddenFilter = `data.attributes.locations IN [${workerLocationsQuoted}]`
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
