import {Router} from 'esp-js';
import {ComponentFactoryBase, Logger, componentFactory } from 'esp-js-ui';
import TradingModuleContainerConst from '../tradingModuleContainerConst';
import BlotterState from './models/blotterState';
import BlotterModel from './models/blotterModel';

let _log = Logger.create('BlotterComponentFactory');

@componentFactory('tradingModule_blotterComponentFactory', 'Blotter')
export default class BlotterComponentFactory extends ComponentFactoryBase {
    private _router : Router;
    constructor(container, router:Router) {
        super(container);
        this._router = router;
    }
    // override
    _createComponent(childContainer, state:BlotterState):BlotterModel {
        _log.verbose('Creating blotter model');
        state = state || BlotterState.create();
        let model:BlotterModel = childContainer.resolve(TradingModuleContainerConst.blotterModel, state);
        model.observeEvents();
        return model;
    }
}
