var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SceneType;
(function (SceneType) {
    SceneType[SceneType["menu"] = 0] = "menu";
    SceneType[SceneType["pick"] = 1] = "pick";
    SceneType[SceneType["about"] = 2] = "about";
    SceneType[SceneType["start"] = 3] = "start";
    SceneType[SceneType["continue"] = 4] = "continue";
    SceneType[SceneType["bedend"] = 5] = "bedend";
    SceneType[SceneType["happyend"] = 6] = "happyend";
})(SceneType || (SceneType = {}));
var Gun = (function () {
    function Gun() {
    }
    return Gun;
}());
var AK47 = (function (_super) {
    __extends(AK47, _super);
    function AK47() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AK47.prototype.show = function () {
        console.log('ak47 shoot.');
    };
    return AK47;
}(Gun));
var M4A1 = (function (_super) {
    __extends(M4A1, _super);
    function M4A1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    M4A1.prototype.show = function () {
        console.log('m4a1 shoot.');
    };
    return M4A1;
}(Gun));
var SenceFactory = (function () {
    function SenceFactory() {
    }
    SenceFactory.createGun = function (type) {
        switch (type) {
            case SceneType.about:
                return new AK47();
            case SceneType.bedend:
                return new M4A1();
            case SceneType.continue:
                return new AK47();
            case SceneType.continue:
                return new AK47();
            case SceneType.happyend:
                return new AK47();
            case SceneType.menu:
                return new AK47();
            case SceneType.menu:
                return new AK47();
            case SceneType.pick:
                return new AK47();
            case SceneType.start:
                return new AK47();
            default:
                throw Error('not sence yet');
        }
    };
    return SenceFactory;
}());
SenceFactory.createGun(SceneType.AK).show();
SenceFactory.createGun(SceneType.M4A1).show();
var canvas = document.getElementById("app");
var stage = engine.run(canvas);
var scene = new GameScene();
GameScene.replaceScene(scene);
GameScene.getCurrentScene().stage = stage;
var pickscene = new UIScene();
UIScene.replaceScene(pickscene);
UIScene.getCurrentScene().gameMenu();
//this.hero = SetTriangle(0);
//UIScene.getCurrentScene().gamestart();
