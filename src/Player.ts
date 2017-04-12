
class Player extends engine.DisplayObjectContainer {
   // _main: Main;
    //_PA: PlayAnimation;
    _label: engine.TextField;
    _stateMachine: StateMachine;
    _body: engine.Bitmap;
    _ifidle: boolean;
    _ifwalk: boolean;
    _i: number = 0;
    _ad: string;

    constructor(ad: string) {
        super();
        this._ad = ad;
        this._body = new engine.Bitmap();
        this._body.src = ad;
        this.addChild(this._body);
        this._body.width = TileMap.TILE_SIZE;
        this._body.height = TileMap.TILE_SIZE;
        // this._body.anchorOffsetX = this._body.width / 2;
        // this._body.anchorOffsetY = this._body.height / 2;
        this._stateMachine = new StateMachine();
        // this._body.x = TileMap.TILE_SIZE/2;
        // this._body.y = TileMap.TILE_SIZE/2;
        this._ifidle = true;
        this._ifwalk = false;

    }
    public move(targetX: number, targetY: number) {

        // if (targetX > this._body.x) {
        //     this._body.skewY = 180;
        // }
        // else {
        //     this._body.skewY = 0;
        // }
        this._stateMachine.setState(new PlayerMoveState(this));

    }

    public behurt() {

    }

    public attack() {

    }

    public idle() {

        this._stateMachine.setState(new PlayerIdleState(this));

    }


    public startWalk() {
        var list = [this._ad,this._ad,this._ad,this._ad,this._ad,this._ad,this._ad,this._ad,this._ad,this._ad,this._ad,this._ad];
        var count = -1;
        engine.Ticker.getInstance().register(() => {
            count = count + 0.2;
            if (count >= list.length) {
                count = 0;
            }


            this._body.src = list[Math.floor(count)];


        });


    }

    public startidle() {

        var list = [this._ad,this._ad,this._ad,this._ad,this._ad,this._ad,this._ad,this._ad,this._ad,this._ad,this._ad,this._ad];
        var count = -1;
        engine.Ticker.getInstance().register(() => {
            count = count + 0.2;
            if (count >= list.length) {
                count = 0;
            }

            this._body.src = list[Math.floor(count)];

        });



    }

}

class PlayerState implements State {

    _player: Player;

    constructor(player: Player) {
        this._player = player;

    }

    onEnter() { }
    onExit() { }

}

interface State {
    onEnter();
    onExit();
}

class PlayerMoveState extends PlayerState {

    onEnter() {

        // engine.setTimeout(() => {
        //     this._player.move;
        // }, this, 500)
        this._player._ifwalk = true;

        this._player.startWalk();

    }
    onExit() {
        this._player._ifwalk = false;
    }


}

class PlayerIdleState extends PlayerState {

    onEnter() {
        // this._player._label.text = "idle";
        // engine.setTimeout(() => {
        //     this._player.idle();
        // }, this, 500)
        this._player._ifidle = true;
        this._player.startidle();

    }
    onExit() {
        this._player._ifidle = false;
    }


}

class StateMachine {
    CurrentState: State;

    setState(e: State) {

        if (this.CurrentState != null) {
            this.CurrentState.onExit();
        }
        this.CurrentState = e;
        e.onEnter();
    }

}