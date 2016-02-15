'use strict';

import Colors from '../styles/Colors';
import Positions from '../styles/Positions';

const states = {
  components: new Map(),
  navigator: null,
  initialComponentName: null
};

function getInitialRoute() {
  return states.components.get(states.initialComponentName).toRoute();
}

function getNavigatorProps() {
  return {
    tintColor: Colors.TEAL_50,
    barTintColor: Colors.TEAL_500,
    titleTextColor: Colors.WHITE,
    shadowHidden: true,
    initialRoute: getInitialRoute(),
    itemWrapperStyle: {
      flex: 1,
      paddingBottom: 64
    },
    style: Positions.FLEX,
    translucent: false
  };
}

function setNavigator(navigator) {
  states.navigator = navigator;
}

function addComponent(name, component) {
  states.components.set(name, component);
}

function setInitialComponent(name) {
  states.initialComponentName = name;
}

function push(name, params = {}) {
  states.navigator.push(states.components.get(name).toRoute(params));
}

function pop() {
  states.navigator.pop();
}

export default {
  getNavigatorProps,
  setInitialComponent,
  setNavigator,
  addComponent,
  push,
  pop
};