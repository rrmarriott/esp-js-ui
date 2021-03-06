import { observeEvent } from 'esp-js';
import { viewBinding } from 'esp-js-react';
import { RegionManager } from 'esp-js-ui';
import CashTileView from '../views/cashTileView';
import {
    Logger,
    ModelBase,
    IdFactory
} from 'esp-js-ui';
import CashTileState from './cashTileState';

let _log = Logger.create('BlotterTileModel');

@viewBinding(CashTileView)
export default class CashTileModel extends ModelBase {
    private _regionManager:RegionManager;
    private _initialState:CashTileState;
    constructor(
        router,
        regionManager:RegionManager,
        initialState:CashTileState // needs to be last due to how it's resolved via the container
    ) {
        super(IdFactory.createId('cashTileModel'), router);
        this._regionManager = regionManager;
        this._initialState = initialState;
    }
    public getTitle(): string {
        return 'Cash Tile';
    }

    public get symbol(): string {
        return this._initialState.symbol;
    }
    observeEvents():void {
        super.observeEvents();
        this._regionManager.addToRegion(
            this._initialState.regionName,
            this
        );
        this.addDisposable(() => {
            this._close();
        });
    }
    _close() {
        this._regionManager.removeFromRegion(this._initialState.regionName, this);
    }
}