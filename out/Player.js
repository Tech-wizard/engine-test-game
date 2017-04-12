var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(ad) {
        var _this = _super.call(this) || this;
        _this._i = 0;
        _this._ad = ad;
        _this._body = new engine.Bitmap();
        _this._body.src = ad;
        _this.addChild(_this._body);
        _this._body.width = TileMap.TILE_SIZE;
        _this._body.height = TileMap.TILE_SIZE;
        // this._body.anchorOffsetX = this._body.width / 2;
        // this._body.anchorOffsetY = this._body.height / 2;
        _this._stateMachine = new StateMachine();
        // this._body.x = TileMap.TILE_SIZE/2;
        // this._body.y = TileMap.TILE_SIZE/2;
        _this._ifidle = true;
        _this._ifwalk = false;
        return _this;
    }
    Player.prototype.move = function (targetX, targetY) {
        // if (targetX > this._body.x) {
        //     this._body.skewY = 180;
        // }
        // else {
        //     this._body.skewY = 0;
        // }
        this._stateMachine.setState(new PlayerMoveState(this));
    };
    Player.prototype.behurt = function () {
    };
    Player.prototype.attack = function () {
    };
    Player.prototype.idle = function () {
        this._stateMachine.setState(new PlayerIdleState(this));
    };
    Player.prototype.startWalk = function () {
        var _this = this;
        var list = [this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad];
        var count = -1;
        engine.Ticker.getInstance().register(function () {
            count = count + 0.2;
            if (count >= list.length) {
                count = 0;
            }
            _this._body.src = list[Math.floor(count)];
        });
    };
    Player.prototype.startidle = function () {
        var _this = this;
        var list = [this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad, this._ad];
        var count = -1;
        engine.Ticker.getInstance().register(function () {
            count = count + 0.2;
            if (count >= list.length) {
                count = 0;
            }
            _this._body.src = list[Math.floor(count)];
        });
    };
    return Player;
}(engine.DisplayObjectContainer));
var PlayerState = (function () {
    function PlayerState(player) {
        this._player = player;
    }
    PlayerState.prototype.onEnter = function () { };
    PlayerState.prototype.onExit = function () { };
    return PlayerState;
}());
var PlayerMoveState = (function (_super) {
    __extends(PlayerMoveState, _super);
    function PlayerMoveState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlayerMoveState.prototype.onEnter = function () {
        // engine.setTimeout(() => {
        //     this._player.move;
        // }, this, 500)
        this._player._ifwalk = true;
        this._player.startWalk();
    };
    PlayerMoveState.prototype.onExit = function () {
        this._player._ifwalk = false;
    };
    return PlayerMoveState;
}(PlayerState));
var PlayerIdleState = (function (_super) {
    __extends(PlayerIdleState, _super);
    function PlayerIdleState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlayerIdleState.prototype.onEnter = function () {
        // this._player._label.text = "idle";
        // engine.setTimeout(() => {
        //     this._player.idle();
        // }, this, 500)
        this._player._ifidle = true;
        this._player.startidle();
    };
    PlayerIdleState.prototype.onExit = function () {
        this._player._ifidle = false;
    };
    return PlayerIdleState;
}(PlayerState));
var StateMachine = (function () {
    function StateMachine() {
    }
    StateMachine.prototype.setState = function (e) {
        if (this.CurrentState != null) {
            this.CurrentState.onExit();
        }
        this.CurrentState = e;
        e.onEnter();
    };
    return StateMachine;
}());
