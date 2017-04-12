var Scence = (function () {
    function Scence() {
    }
    return Scence;
}());
;
var WalkCommand = (function () {
    function WalkCommand(x, y) {
        this.x = x;
        this.y = y;
    }
    WalkCommand.prototype.execute = function (callback) {
        GameScene.getCurrentScene().moveTo(this.x, this.y, function () {
            callback();
        });
    };
    WalkCommand.prototype.cancel = function (callback) {
        GameScene.getCurrentScene().stopMove(function () {
            callback();
        });
    };
    return WalkCommand;
}());
var FightCommand = (function () {
    function FightCommand(ad) {
        this._hasBeenCancelled = false;
        this.enemyad = ad;
    }
    FightCommand.prototype.execute = function (callback) {
        var _this = this;
        console.log("开始战斗");
        console.log(UIScene.getCurrentScene().hero);
        var battle = new Battle(UIScene.getCurrentScene().hero, 1, this.enemyad, 6, 6);
        if (GameScene.getCurrentScene().stage.children.length != 0) {
            GameScene.getCurrentScene().stage.removeAll();
        }
        GameScene.getCurrentScene().stage.addChild(battle);
        // engine.setTimeout(() => {
        //  if (!this._hasBeenCancelled) {
        //     console.log("结束战斗")
        //     callback();
        // }
        //     }, this, 500)
        var batteEnd = setInterval(function () {
            if (battle.judgeEnemyDeath() == true) {
                console.log("敌人死亡,结束战斗,升级变强");
                UIScene.getCurrentScene().NPC_2.fighted = true;
                UIScene.getCurrentScene().hero.level++;
                UIScene.getCurrentScene().hero.CON.value += UIScene.getCurrentScene().hero.CONUP;
                UIScene.getCurrentScene().hero.CON.value += UIScene.getCurrentScene().hero.CONUP;
                callback();
                GameScene.getCurrentScene().stage.removeAll();
                clearInterval(batteEnd);
                if (_this.enemyad == "npc_2_png") {
                    SceneService.getInstance().notify(TaskService.getInstance().taskList["001"]);
                }
                UIScene.getCurrentScene().gameContinue();
            }
            if (battle.judgeHeroDeath() == true) {
                console.log("英雄阵亡，结束战斗");
                callback();
                GameScene.getCurrentScene().stage.removeAll();
                clearInterval(batteEnd);
                UIScene.getCurrentScene().gamebadend();
            }
        }, this, 500);
    };
    FightCommand.prototype.cancel = function (callback) {
        console.log("脱离战斗");
        this._hasBeenCancelled = true;
        setTimeout(function () {
            callback();
        }, this, 100);
    };
    return FightCommand;
}());
var TalkCommand = (function () {
    function TalkCommand(npcad) {
        this.npcid = npcad;
    }
    TalkCommand.prototype.execute = function (callback) {
        if (this.npcid == "NPC_1") {
            UIScene.getCurrentScene().dp1.showDpanel();
        }
        if (this.npcid == "NPC_2") {
            UIScene.getCurrentScene().dp2.showDpanel();
        }
        console.log("打开对话框");
        setTimeout(function () {
            console.log("结束对话");
            callback();
        }, this, 500);
    };
    TalkCommand.prototype.cancel = function (callback) {
        if (this.npcid == "NPC_1") {
            UIScene.getCurrentScene().dp1.disshowDpanel();
        }
        if (this.npcid == "NPC_2") {
            UIScene.getCurrentScene().dp2.disshowDpanel();
        }
        console.log("关闭对话框");
        callback();
    };
    return TalkCommand;
}());
var EquipCommand = (function () {
    function EquipCommand(name, ad, atk) {
        this.name = name;
        this.ad = ad;
        this.atk = atk;
    }
    EquipCommand.prototype.execute = function (callback) {
        var ruen_1 = [new rune(2), new rune(3)];
        this.item = new Equipment(this.name, this.ad, 1, this.atk, ruen_1);
        UIScene.getCurrentScene().hero.equip(this.item);
        GameScene.getCurrentScene().stage.removeChild(UIScene.getCurrentScene().item);
        callback();
    };
    EquipCommand.prototype.cancel = function (callback) {
        UIScene.getCurrentScene().hero.equipments = [];
        callback();
    };
    return EquipCommand;
}());
var CommandList = (function () {
    function CommandList() {
        this._list = [];
        this._frozen = false;
    }
    CommandList.prototype.addCommand = function (command) {
        this._list.push(command);
    };
    CommandList.prototype.cancel = function () {
        var _this = this;
        this._frozen = true;
        var command = this.currentCommand;
        setTimeout(function () {
            if (_this._frozen) {
                _this._frozen = false;
            }
        }, this, 100);
        if (command) {
            command.cancel(function () {
                _this._frozen = false;
            });
            this._list = [];
        }
    };
    CommandList.prototype.execute = function () {
        var _this = this;
        if (this._frozen) {
            setTimeout(this.execute, this, 100);
            return;
        }
        var command = this._list.shift();
        this.currentCommand = command;
        if (command) {
            console.log("执行下一命令", command);
            command.execute(function () {
                _this.execute();
            });
        }
        else {
            console.log("全部命令执行完毕");
        }
    };
    return CommandList;
}());
