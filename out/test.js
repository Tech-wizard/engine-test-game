var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AStar = (function () {
    function AStar() {
        this._openList = []; //Array<TileNode>//
        this._closedList = []; //已考察表
        this._path = [];
        this._heuristic = this.diagonal;
        this._straightCost = 1.0;
        this._diagCost = Math.SQRT2;
    }
    AStar.prototype.findPath = function (grid) {
        this._grid = grid;
        this._openList = new Array();
        this._closedList = new Array();
        this._startNode = this._grid._startNode;
        this._endNode = this._grid._endNode;
        this._startNode.g = 0;
        this._startNode.h = this._heuristic(this._startNode);
        this._startNode.f = this._startNode.g + this._startNode.h;
        return this.search();
    };
    AStar.prototype.search = function () {
        var currentNode = this._startNode;
        while (currentNode != this._endNode) {
            var startX = Math.max(0, currentNode.x - 1);
            var endX = Math.min(this._grid._numCols - 1, currentNode.x + 1);
            var startY = Math.max(0, currentNode.y - 1);
            var endY = Math.min(this._grid._numRows - 1, currentNode.y + 1);
            for (var i = startX; i <= endX; i++) {
                for (var j = startY; j <= endY; j++) {
                    var test = this._grid._nodes[i][j];
                    if (test == currentNode || !test.walkable || !this._grid._nodes[currentNode.x][test.y].walkable || !this._grid._nodes[test.x][currentNode.y].walkable) {
                        continue;
                    }
                    var cost = this._straightCost;
                    if (!((currentNode.x == test.x) || (currentNode.y == test.y))) {
                        cost = this._diagCost;
                    }
                    var g = currentNode.g + cost;
                    var h = this._heuristic(test);
                    var f = g + h;
                    if (this.isOpen(test) || this.isClosed(test)) {
                        if (test.f > f) {
                            test.f = f;
                            test.g = g;
                            test.h = h;
                            test.parent = currentNode;
                        }
                    }
                    else {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = currentNode;
                        this._openList.push(test);
                    }
                }
            }
            this._closedList.push(currentNode); //已考察列表
            if (this._openList.length == 0) {
                return false;
            }
            //this._openList.sortOn("f", Array.NUMERIC); 把f从小到大排序
            // var allf:number[]=new Array();
            // for(var i=0;i<this._openList.length;i++){
            // allf[i]=this._openList[i].f;
            // }
            this._openList.sort(function (a, b) {
                // if (a.f > b.f) {
                // 	return 1;
                // } else if (a.f < b.f) {
                // 	return -1
                // } else {
                // 	return 0;
                // }
                return a.f - b.f;
            });
            currentNode = this._openList.shift();
        }
        this.buildPath();
        return true;
    };
    AStar.prototype.isOpen = function (node) {
        for (var i = 0; i < this._openList.length; i++) {
            if (this._openList[i] == node) {
                return true;
            }
        }
        return false;
        //return this._openList.indexOf(node) > 0 ? true : false;
    };
    AStar.prototype.isClosed = function (node) {
        for (var i = 0; i < this._closedList.length; i++) {
            if (this._closedList[i] == node) {
                return true;
            }
        }
        return false;
        //return this._closedList.indexOf(node) > 0 ? true : false;
    };
    AStar.prototype.buildPath = function () {
        this._path = new Array();
        var node = this._endNode;
        this._path.push(node);
        while (node != this._startNode) {
            node = node.parent;
            this._path.unshift(node); //开头加入
        }
    };
    AStar.prototype.manhattan = function (node) {
        return Math.abs(this._endNode.x - node.x) * this._straightCost + Math.abs(this._endNode.y - node.y) * this._straightCost;
    };
    AStar.prototype.euclidian = function (node) {
        var dx = this._endNode.x - node.x;
        var dy = this._endNode.y - node.y;
        return Math.sqrt(dx * dx + dy * dy) * this._straightCost;
    };
    AStar.prototype.diagonal = function (node) {
        var dx = Math.abs(this._endNode.x - node.x);
        var dy = Math.abs(this._endNode.y - node.y);
        var diag = Math.min(dx, dy);
        var straight = dx + dy;
        return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
    };
    AStar.prototype.visited = function () {
        return this._closedList.concat(this._openList);
    };
    AStar.prototype.validNode = function (node, currentNode) {
        if (currentNode == node || !node.walkable)
            return false;
        if (!this._grid._nodes[currentNode.x][node.y].walkable)
            return false;
        if (!this._grid._nodes[node.x][currentNode.y].walkable)
            return false;
        return true;
    };
    return AStar;
}());
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
var Grid = (function () {
    function Grid(numCols, numRows, data) {
        this._nodes = [];
        this._numCols = numCols;
        this._numRows = numRows;
        this._nodes = new Array();
        for (var i = 0; i < this._numCols; i++) {
            this._nodes[i] = new Array();
            for (var j = 0; j < this._numRows; j++) {
                this._nodes[i][j] = new TileNode(i, j);
                this._nodes[i][j].walkable = data[i + this._numCols * j].walkable;
            }
        }
    }
    Grid.prototype.setStartNode = function (x, y) {
        this._startNode = this._nodes[x][y];
    };
    Grid.prototype.setEndNode = function (x, y) {
        this._endNode = this._nodes[x][y];
    };
    return Grid;
}());
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, engine Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the engine nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY engine AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL engine AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Main;
}(engine.DisplayObjectContainer));
/**
 * 加载进度界面
 * Process interface loading
 */
//     private loadingView: LoadingUI;
//     public constructor() {
//         super();
//         this.addEventListener(engine.Event.ADDED_TO_STAGE, this.onAddToStage, this);
//     }
//     private onAddToStage(event: engine.Event) {
//         //设置加载进度界面
//         //Config to load process interface
//         this.loadingView = new LoadingUI();
//         this.stage.addChild(this.loadingView);
//         //初始化Resource资源加载库
//         //initiate Resource loading library
//         RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
//         RES.loadConfig("resource/default.res.json", "resource/");
//     }
//     /**
//      * 配置文件加载完成,开始预加载preload资源组。
//      * configuration file loading is completed, start to pre-load the preload resource group
//      */
//     private onConfigComplete(event: RES.ResourceEvent): void {
//         RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
//         RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
//         RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
//         RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
//         RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
//         RES.loadGroup("preload");
//     }
//     /**
//      * preload资源组加载完成
//      * Preload resource group is loaded
//      */
//     private onResourceLoadComplete(event: RES.ResourceEvent): void {
//         if (event.groupName == "preload") {
//             this.stage.removeChild(this.loadingView);
//             RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
//             RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
//             RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
//             RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
//             this.createGameScene();
//         }
//     }
//     /**
//      * 资源组加载出错
//      *  The resource group loading failed
//      */
//     private onItemLoadError(event: RES.ResourceEvent): void {
//         console.warn("Url:" + event.resItem.url + " has failed to load");
//     }
//     /**
//      * 资源组加载出错
//      *  The resource group loading failed
//      */
//     private onResourceLoadError(event: RES.ResourceEvent): void {
//         //TODO
//         console.warn("Group:" + event.groupName + " has failed to load");
//         //忽略加载失败的项目
//         //Ignore the loading failed projects
//         this.onResourceLoadComplete(event);
//     }
//     /**
//      * preload资源组加载进度
//      * Loading process of preload resource group
//      */
//     private onResourceProgress(event: RES.ResourceEvent): void {
//         if (event.groupName == "preload") {
//             this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
//         }
//     }
//     private textfield: engine.TextField;
//     /**
//      * 创建游戏场景
//      * Create a game scene
//      */
//     private createGameScene(): void {
//        var scene = new GameScene();
//         GameScene.replaceScene(scene);
//         GameScene.getCurrentScene().main = this;
//          var pickscene = new UIScene();
//        UIScene.replaceScene(pickscene);
//        UIScene.getCurrentScene().gameMenu();
//      }
// private createBitmapByName(name: string): engine.Bitmap {
//         var result = new engine.Bitmap();
//         var texture: engine.Texture = RES.getRes(name);
//         result.texture = texture;
//         return result;
//     }
//     /**
//      * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
//      * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
//      */
// } 
var TileMap = (function (_super) {
    __extends(TileMap, _super);
    function TileMap(player) {
        var _this = _super.call(this) || this;
        _this._speed = 3;
        _this.moveX = [];
        _this.moveY = [];
        _this.init();
        _this._player = player;
        _this._i = 0;
        return _this;
    }
    TileMap.prototype.init = function () {
        randomMap(testmap);
        //createMap(testmap);
        // console.log(testmap);
        for (var i = 0; i < testmap.length; i++) {
            var data = testmap[i];
            var tile = new Tile(data);
            this.addChild(tile);
        }
        this.touchEnabled = true;
        this.addEventListener(engine.TouchEvent.TOUCH_TAP, function (e) {
            var localX = e.offsetX;
            var localY = e.offsetY;
            var gridX = Math.floor(localX / TileMap.TILE_SIZE);
            var gridY = Math.floor(localY / TileMap.TILE_SIZE);
            if (SceneService.getInstance().list.length != 0) {
                SceneService.getInstance().list.cancel();
            }
            SceneService.getInstance().list.addCommand(new WalkCommand(gridX, gridY));
            SceneService.getInstance().list.execute();
            // 
            //                      this._player._body.x <= current.x * TileMap.TILE_SIZE + this._speed &&
            //                       this._player._body.x >= current.x * TileMap.TILE_SIZE - this._speed &&
            //                       this._player._body.y <= current.y * TileMap.TILE_SIZE + this._speed &&
            //                       this._player._body.y >= current.y * TileMap.TILE_SIZE - this._speed)
            // this._i = 1;
            // this.moveX[this._i] = this._astar._path[this._i].x * TileMap.TILE_SIZE + TileMap.TILE_SIZE / 2;
            // this.moveY[this._i] = this._astar._path[this._i].y * TileMap.TILE_SIZE + TileMap.TILE_SIZE / 2;
            // this._player.move(this.moveX[this._i], this.moveY[this._i]);
            // engine.Tween.get(this._player._body).to({ x: this.moveX[this._i], y: this.moveY[this._i] }, 600).wait(10).call(function () { this._player.idle() }, this);
            // var timer: engine.Timer = new engine.Timer(1000, this._astar._path.length - 2);
            // //注册事件侦听器
            // timer.addEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
            // timer.addEventListener(engine.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
            // //开始计时
            // timer.start();
            //}
        });
    };
    // private timerFunc() {
    //     this._i++;
    //     this.moveX[this._i] = this._astar._path[this._i].x * TileMap.TILE_SIZE + TileMap.TILE_SIZE / 2;
    //     this.moveY[this._i] = this._astar._path[this._i].y * TileMap.TILE_SIZE + TileMap.TILE_SIZE / 2;
    //     this._player.move(this.moveX[this._i], this.moveY[this._i]);
    //     engine.Tween.get(this._player._body).to({ x: this.moveX[this._i], y: this.moveY[this._i] }, 600).wait(10).call(function () { this._player.idle() }, this);
    // }
    // private timerComFunc() {
    //     console.log("计时结束");
    // }
    TileMap.prototype.addMonster = function () {
    };
    TileMap.prototype.replaceMap = function (object) {
        var monstersXY;
        for (var i = 0; i < testmap.length; i++) {
            if (testmap[i].walkable == false && testmap[i].x == object.x / TileMap.TILE_SIZE && testmap[i].y == object.y / TileMap.TILE_SIZE) {
                testmap[i].walkable = true;
                testmap[i].image = "Black_png";
            }
        }
    };
    return TileMap;
}(engine.DisplayObjectContainer));
TileMap.TILE_SIZE = 53;
TileMap.TILE_BATTLE_SIZE = 80;
TileMap.TILE_SPEED = 4;
TileMap.TILE_X = 11;
TileMap.TILE_Y = 15;
function randomnum(a, b) {
    return a + Math.floor(Math.random() * b);
}
function checkNeighborWalls(tileData) {
    var count = 0;
    if (tileData.x == 0 || tileData.x == TileMap.TILE_X) {
        count++;
    }
    if (tileData.y == 0 || tileData.y == TileMap.TILE_Y) {
        count++;
    }
    if (tileData.x == 0 && tileData.y == 0) {
        count++;
    }
    if (tileData.x == 0 && tileData.y == TileMap.TILE_Y) {
        count++;
    }
    if (tileData.x == TileMap.TILE_X && tileData.y == 0) {
        count++;
    }
    if (tileData.x == TileMap.TILE_X && tileData.y == TileMap.TILE_Y) {
        count++;
    }
    config.forEach(function (element) {
        if (tileData.x > 0 && tileData.y > 0 && tileData.x < 11 && tileData.y < 15) {
            if (element.x == tileData.x + 1 && element.y == tileData.y && element.walkable == false) {
                count++;
            }
            if (element.x == tileData.x + 1 && element.y == tileData.y + 1 && element.walkable == false) {
                count++;
            }
            if (element.x == tileData.x && element.y == tileData.y + 1 && element.walkable == false) {
                count++;
            }
            if (element.x == tileData.x - 1 && element.y == tileData.y && element.walkable == false) {
                count++;
            }
            if (element.x == tileData.x - 1 && element.y == tileData.y - 1 && element.walkable == false) {
                count++;
            }
            if (element.x == tileData.x && element.y == tileData.y - 1 && element.walkable == false) {
                count++;
            }
        }
    });
    return count;
}
function randomMap(map) {
    map.forEach(function (element) {
        switch (Math.floor(Math.random() * 100) % 5) {
            case 0:
                element.walkable = true;
                element.image = "Black_png";
                break;
            case 1:
                element.walkable = true;
                element.image = "Black_png";
                break;
            case 2:
                element.walkable = true;
                element.image = "Black_png";
                break;
            case 3:
                element.walkable = false;
                element.image = "White_png";
                break;
            case 4:
                element.walkable = true;
                element.image = "Black_png";
                break;
        }
        if (element.x == 0 && element.y == 0) {
            element.walkable = true;
            element.image = "Black_png";
        }
        if (element.x == 1 && element.y == 1) {
            element.walkable = true;
            element.image = "Black_png";
        }
        if (element.x == 1 && element.y == 0) {
            element.walkable = true;
            element.image = "Black_png";
        }
        if (element.x == 0 && element.y == 1) {
            element.walkable = true;
            element.image = "Black_png";
        }
        if (element.x == UIScene.getCurrentScene().NPC_1.x / TileMap.TILE_SIZE && element.y == UIScene.getCurrentScene().NPC_1.y / TileMap.TILE_SIZE) {
            element.walkable = true;
            element.image = "Black_png";
        }
        if (element.x == UIScene.getCurrentScene().NPC_2.x / TileMap.TILE_SIZE && element.y == UIScene.getCurrentScene().NPC_2.y / TileMap.TILE_SIZE) {
            element.walkable = true;
            element.image = "Black_png";
        }
        if (element.x == 10 && element.y == 1) {
            element.walkable = true;
            element.image = "Black_png";
        }
    });
}
function createMap(map) {
    map.forEach(function (element) {
        var count = checkNeighborWalls(element);
        console.log(count);
        if (element.walkable == false) {
            if (count >= 4) {
                element.walkable = false;
                element.image = "White_png";
            }
            else {
                element.walkable = true;
                element.image = "Black_png";
            }
        }
        if (element.walkable == true) {
            if (count >= 5) {
                element.walkable = false;
                element.image = "White_png";
            }
        }
    });
}
function createWay(map, x, y) {
}
var testmap = [
    { x: 0, y: 0, walkable: true, image: "Black_png" },
    { x: 1, y: 0, walkable: true, image: "Black_png" },
    { x: 2, y: 0, walkable: true, image: "Black_png" },
    { x: 3, y: 0, walkable: true, image: "Black_png" },
    { x: 4, y: 0, walkable: true, image: "Black_png" },
    { x: 5, y: 0, walkable: true, image: "Black_png" },
    { x: 6, y: 0, walkable: true, image: "Black_png" },
    { x: 7, y: 0, walkable: true, image: "Black_png" },
    { x: 8, y: 0, walkable: true, image: "Black_png" },
    { x: 9, y: 0, walkable: true, image: "Black_png" },
    { x: 10, y: 0, walkable: true, image: "Black_png" },
    { x: 11, y: 0, walkable: true, image: "Black_png" },
    { x: 0, y: 1, walkable: true, image: "Black_png" },
    { x: 1, y: 1, walkable: true, image: "Black_png" },
    { x: 2, y: 1, walkable: true, image: "Black_png" },
    { x: 3, y: 1, walkable: true, image: "Black_png" },
    { x: 4, y: 1, walkable: true, image: "Black_png" },
    { x: 5, y: 1, walkable: true, image: "Black_png" },
    { x: 6, y: 1, walkable: true, image: "Black_png" },
    { x: 7, y: 1, walkable: true, image: "Black_png" },
    { x: 8, y: 1, walkable: true, image: "Black_png" },
    { x: 9, y: 1, walkable: true, image: "Black_png" },
    { x: 10, y: 1, walkable: true, image: "Black_png" },
    { x: 11, y: 1, walkable: true, image: "Black_png" },
    { x: 0, y: 2, walkable: true, image: "Black_png" },
    { x: 1, y: 2, walkable: true, image: "Black_png" },
    { x: 2, y: 2, walkable: true, image: "Black_png" },
    { x: 3, y: 2, walkable: true, image: "Black_png" },
    { x: 4, y: 2, walkable: true, image: "Black_png" },
    { x: 5, y: 2, walkable: true, image: "Black_png" },
    { x: 6, y: 2, walkable: true, image: "Black_png" },
    { x: 7, y: 2, walkable: true, image: "Black_png" },
    { x: 8, y: 2, walkable: true, image: "Black_png" },
    { x: 9, y: 2, walkable: true, image: "Black_png" },
    { x: 10, y: 2, walkable: true, image: "Black_png" },
    { x: 11, y: 2, walkable: true, image: "Black_png" },
    { x: 0, y: 3, walkable: true, image: "Black_png" },
    { x: 1, y: 3, walkable: true, image: "Black_png" },
    { x: 2, y: 3, walkable: true, image: "Black_png" },
    { x: 3, y: 3, walkable: true, image: "Black_png" },
    { x: 4, y: 3, walkable: true, image: "Black_png" },
    { x: 5, y: 3, walkable: true, image: "Black_png" },
    { x: 6, y: 3, walkable: true, image: "Black_png" },
    { x: 7, y: 3, walkable: true, image: "Black_png" },
    { x: 8, y: 3, walkable: true, image: "Black_png" },
    { x: 9, y: 3, walkable: true, image: "Black_png" },
    { x: 10, y: 3, walkable: true, image: "Black_png" },
    { x: 11, y: 3, walkable: true, image: "Black_png" },
    { x: 0, y: 4, walkable: true, image: "Black_png" },
    { x: 1, y: 4, walkable: true, image: "Black_png" },
    { x: 2, y: 4, walkable: true, image: "Black_png" },
    { x: 3, y: 4, walkable: true, image: "Black_png" },
    { x: 4, y: 4, walkable: true, image: "Black_png" },
    { x: 5, y: 4, walkable: true, image: "Black_png" },
    { x: 6, y: 4, walkable: true, image: "Black_png" },
    { x: 7, y: 4, walkable: true, image: "Black_png" },
    { x: 8, y: 4, walkable: true, image: "Black_png" },
    { x: 9, y: 4, walkable: true, image: "Black_png" },
    { x: 10, y: 4, walkable: true, image: "Black_png" },
    { x: 11, y: 4, walkable: true, image: "Black_png" },
    { x: 0, y: 5, walkable: true, image: "Black_png" },
    { x: 1, y: 5, walkable: true, image: "Black_png" },
    { x: 2, y: 5, walkable: true, image: "Black_png" },
    { x: 3, y: 5, walkable: true, image: "Black_png" },
    { x: 4, y: 5, walkable: true, image: "Black_png" },
    { x: 5, y: 5, walkable: true, image: "Black_png" },
    { x: 6, y: 5, walkable: true, image: "Black_png" },
    { x: 7, y: 5, walkable: true, image: "Black_png" },
    { x: 8, y: 5, walkable: true, image: "Black_png" },
    { x: 9, y: 5, walkable: true, image: "Black_png" },
    { x: 10, y: 5, walkable: true, image: "Black_png" },
    { x: 11, y: 5, walkable: true, image: "Black_png" },
    { x: 0, y: 6, walkable: true, image: "Black_png" },
    { x: 1, y: 6, walkable: true, image: "Black_png" },
    { x: 2, y: 6, walkable: true, image: "Black_png" },
    { x: 3, y: 6, walkable: true, image: "Black_png" },
    { x: 4, y: 6, walkable: true, image: "Black_png" },
    { x: 5, y: 6, walkable: true, image: "Black_png" },
    { x: 6, y: 6, walkable: true, image: "Black_png" },
    { x: 7, y: 6, walkable: true, image: "Black_png" },
    { x: 8, y: 6, walkable: true, image: "Black_png" },
    { x: 9, y: 6, walkable: true, image: "Black_png" },
    { x: 10, y: 6, walkable: true, image: "Black_png" },
    { x: 11, y: 6, walkable: true, image: "Black_png" },
    { x: 0, y: 7, walkable: true, image: "Black_png" },
    { x: 1, y: 7, walkable: true, image: "Black_png" },
    { x: 2, y: 7, walkable: true, image: "Black_png" },
    { x: 3, y: 7, walkable: true, image: "Black_png" },
    { x: 4, y: 7, walkable: true, image: "Black_png" },
    { x: 5, y: 7, walkable: true, image: "Black_png" },
    { x: 6, y: 7, walkable: true, image: "Black_png" },
    { x: 7, y: 7, walkable: true, image: "Black_png" },
    { x: 8, y: 7, walkable: true, image: "Black_png" },
    { x: 9, y: 7, walkable: true, image: "Black_png" },
    { x: 10, y: 7, walkable: true, image: "Black_png" },
    { x: 11, y: 7, walkable: true, image: "Black_png" },
    { x: 0, y: 8, walkable: true, image: "Black_png" },
    { x: 1, y: 8, walkable: true, image: "Black_png" },
    { x: 2, y: 8, walkable: true, image: "Black_png" },
    { x: 3, y: 8, walkable: true, image: "Black_png" },
    { x: 4, y: 8, walkable: true, image: "Black_png" },
    { x: 5, y: 8, walkable: true, image: "Black_png" },
    { x: 6, y: 8, walkable: true, image: "Black_png" },
    { x: 7, y: 8, walkable: true, image: "Black_png" },
    { x: 8, y: 8, walkable: true, image: "Black_png" },
    { x: 9, y: 8, walkable: true, image: "Black_png" },
    { x: 10, y: 8, walkable: true, image: "Black_png" },
    { x: 11, y: 8, walkable: true, image: "Black_png" },
    { x: 0, y: 9, walkable: true, image: "Black_png" },
    { x: 1, y: 9, walkable: true, image: "Black_png" },
    { x: 2, y: 9, walkable: true, image: "Black_png" },
    { x: 3, y: 9, walkable: true, image: "Black_png" },
    { x: 4, y: 9, walkable: true, image: "Black_png" },
    { x: 5, y: 9, walkable: true, image: "Black_png" },
    { x: 6, y: 9, walkable: true, image: "Black_png" },
    { x: 7, y: 9, walkable: true, image: "Black_png" },
    { x: 8, y: 9, walkable: true, image: "Black_png" },
    { x: 9, y: 9, walkable: true, image: "Black_png" },
    { x: 10, y: 9, walkable: true, image: "Black_png" },
    { x: 11, y: 9, walkable: true, image: "Black_png" },
    { x: 0, y: 10, walkable: true, image: "Black_png" },
    { x: 1, y: 10, walkable: true, image: "Black_png" },
    { x: 2, y: 10, walkable: true, image: "Black_png" },
    { x: 3, y: 10, walkable: true, image: "Black_png" },
    { x: 4, y: 10, walkable: true, image: "Black_png" },
    { x: 5, y: 10, walkable: true, image: "Black_png" },
    { x: 6, y: 10, walkable: true, image: "Black_png" },
    { x: 7, y: 10, walkable: true, image: "Black_png" },
    { x: 8, y: 10, walkable: true, image: "Black_png" },
    { x: 9, y: 10, walkable: true, image: "Black_png" },
    { x: 10, y: 10, walkable: true, image: "Black_png" },
    { x: 11, y: 10, walkable: true, image: "Black_png" },
    { x: 0, y: 11, walkable: true, image: "Black_png" },
    { x: 1, y: 11, walkable: true, image: "Black_png" },
    { x: 2, y: 11, walkable: true, image: "Black_png" },
    { x: 3, y: 11, walkable: true, image: "Black_png" },
    { x: 4, y: 11, walkable: true, image: "Black_png" },
    { x: 5, y: 11, walkable: true, image: "Black_png" },
    { x: 6, y: 11, walkable: true, image: "Black_png" },
    { x: 7, y: 11, walkable: true, image: "Black_png" },
    { x: 8, y: 11, walkable: true, image: "Black_png" },
    { x: 9, y: 11, walkable: true, image: "Black_png" },
    { x: 10, y: 11, walkable: true, image: "Black_png" },
    { x: 11, y: 11, walkable: true, image: "Black_png" },
    { x: 0, y: 12, walkable: true, image: "Black_png" },
    { x: 1, y: 12, walkable: true, image: "Black_png" },
    { x: 2, y: 12, walkable: true, image: "Black_png" },
    { x: 3, y: 12, walkable: true, image: "Black_png" },
    { x: 4, y: 12, walkable: true, image: "Black_png" },
    { x: 5, y: 12, walkable: true, image: "Black_png" },
    { x: 6, y: 12, walkable: true, image: "Black_png" },
    { x: 7, y: 12, walkable: true, image: "Black_png" },
    { x: 8, y: 12, walkable: true, image: "Black_png" },
    { x: 9, y: 12, walkable: true, image: "Black_png" },
    { x: 10, y: 12, walkable: true, image: "Black_png" },
    { x: 11, y: 12, walkable: true, image: "Black_png" },
    { x: 0, y: 13, walkable: true, image: "Black_png" },
    { x: 1, y: 13, walkable: true, image: "Black_png" },
    { x: 2, y: 13, walkable: true, image: "Black_png" },
    { x: 3, y: 13, walkable: true, image: "Black_png" },
    { x: 4, y: 13, walkable: true, image: "Black_png" },
    { x: 5, y: 13, walkable: true, image: "Black_png" },
    { x: 6, y: 13, walkable: true, image: "Black_png" },
    { x: 7, y: 13, walkable: true, image: "Black_png" },
    { x: 8, y: 13, walkable: true, image: "Black_png" },
    { x: 9, y: 13, walkable: true, image: "Black_png" },
    { x: 10, y: 13, walkable: true, image: "Black_png" },
    { x: 11, y: 13, walkable: true, image: "Black_png" },
    { x: 0, y: 14, walkable: true, image: "Black_png" },
    { x: 1, y: 14, walkable: true, image: "Black_png" },
    { x: 2, y: 14, walkable: true, image: "Black_png" },
    { x: 3, y: 14, walkable: true, image: "Black_png" },
    { x: 4, y: 14, walkable: true, image: "Black_png" },
    { x: 5, y: 14, walkable: true, image: "Black_png" },
    { x: 6, y: 14, walkable: true, image: "Black_png" },
    { x: 7, y: 14, walkable: true, image: "Black_png" },
    { x: 8, y: 14, walkable: true, image: "Black_png" },
    { x: 9, y: 14, walkable: true, image: "Black_png" },
    { x: 10, y: 14, walkable: true, image: "Black_png" },
    { x: 11, y: 14, walkable: true, image: "Black_png" },
    { x: 0, y: 15, walkable: true, image: "Black_png" },
    { x: 1, y: 15, walkable: true, image: "Black_png" },
    { x: 2, y: 15, walkable: true, image: "Black_png" },
    { x: 3, y: 15, walkable: true, image: "Black_png" },
    { x: 4, y: 15, walkable: true, image: "Black_png" },
    { x: 5, y: 15, walkable: true, image: "Black_png" },
    { x: 6, y: 15, walkable: true, image: "Black_png" },
    { x: 7, y: 15, walkable: true, image: "Black_png" },
    { x: 8, y: 15, walkable: true, image: "Black_png" },
    { x: 9, y: 15, walkable: true, image: "Black_png" },
    { x: 10, y: 15, walkable: true, image: "Black_png" },
    { x: 11, y: 15, walkable: true, image: "Black_png" },
];
var config = [
    { x: 0, y: 0, walkable: true, image: "Black_png" },
    { x: 1, y: 0, walkable: true, image: "Black_png" },
    { x: 2, y: 0, walkable: true, image: "Black_png" },
    { x: 3, y: 0, walkable: false, image: "White_png" },
    { x: 4, y: 0, walkable: true, image: "Black_png" },
    { x: 5, y: 0, walkable: true, image: "Black_png" },
    { x: 6, y: 0, walkable: true, image: "Black_png" },
    { x: 7, y: 0, walkable: false, image: "White_png" },
    { x: 8, y: 0, walkable: false, image: "White_png" },
    { x: 9, y: 0, walkable: true, image: "Black_png" },
    { x: 10, y: 0, walkable: true, image: "Black_png" },
    { x: 11, y: 0, walkable: true, image: "Black_png" },
    { x: 0, y: 1, walkable: true, image: "Black_png" },
    { x: 1, y: 1, walkable: false, image: "White_png" },
    { x: 2, y: 1, walkable: true, image: "Black_png" },
    { x: 3, y: 1, walkable: true, image: "Black_png" },
    { x: 4, y: 1, walkable: true, image: "Black_png" },
    { x: 5, y: 1, walkable: false, image: "White_png" },
    { x: 6, y: 1, walkable: true, image: "Black_png" },
    { x: 7, y: 1, walkable: false, image: "White_png" },
    { x: 8, y: 1, walkable: false, image: "White_png" },
    { x: 9, y: 1, walkable: true, image: "Black_png" },
    { x: 10, y: 1, walkable: false, image: "White_png" },
    { x: 11, y: 1, walkable: false, image: "White_png" },
    { x: 0, y: 2, walkable: true, image: "Black_png" },
    { x: 1, y: 2, walkable: true, image: "Black_png" },
    { x: 2, y: 2, walkable: true, image: "Black_png" },
    { x: 3, y: 2, walkable: false, image: "White_png" },
    { x: 4, y: 2, walkable: true, image: "Black_png" },
    { x: 5, y: 2, walkable: true, image: "Black_png" },
    { x: 6, y: 2, walkable: true, image: "Black_png" },
    { x: 7, y: 2, walkable: false, image: "White_png" },
    { x: 8, y: 2, walkable: false, image: "White_png" },
    { x: 9, y: 2, walkable: true, image: "Black_png" },
    { x: 10, y: 2, walkable: true, image: "Black_png" },
    { x: 11, y: 2, walkable: true, image: "Black_png" },
    { x: 0, y: 3, walkable: true, image: "Black_png" },
    { x: 1, y: 3, walkable: false, image: "White_png" },
    { x: 2, y: 3, walkable: true, image: "Black_png" },
    { x: 3, y: 3, walkable: true, image: "Black_png" },
    { x: 4, y: 3, walkable: true, image: "Black_png" },
    { x: 5, y: 3, walkable: false, image: "White_png" },
    { x: 6, y: 3, walkable: true, image: "Black_png" },
    { x: 7, y: 3, walkable: true, image: "Black_png" },
    { x: 8, y: 3, walkable: false, image: "White_png" },
    { x: 9, y: 3, walkable: false, image: "White_png" },
    { x: 10, y: 3, walkable: false, image: "White_png" },
    { x: 11, y: 3, walkable: true, image: "Black_png" },
    { x: 0, y: 4, walkable: true, image: "Black_png" },
    { x: 1, y: 4, walkable: true, image: "Black_png" },
    { x: 2, y: 4, walkable: true, image: "Black_png" },
    { x: 3, y: 4, walkable: false, image: "White_png" },
    { x: 4, y: 4, walkable: true, image: "Black_png" },
    { x: 5, y: 4, walkable: false, image: "White_png" },
    { x: 6, y: 4, walkable: true, image: "Black_png" },
    { x: 7, y: 4, walkable: true, image: "Black_png" },
    { x: 8, y: 4, walkable: true, image: "Black_png" },
    { x: 9, y: 4, walkable: true, image: "Black_png" },
    { x: 10, y: 4, walkable: true, image: "Black_png" },
    { x: 11, y: 4, walkable: true, image: "Black_png" },
    { x: 0, y: 5, walkable: false, image: "White_png" },
    { x: 1, y: 5, walkable: false, image: "White_png" },
    { x: 2, y: 5, walkable: false, image: "White_png" },
    { x: 3, y: 5, walkable: false, image: "White_png" },
    { x: 4, y: 5, walkable: false, image: "White_png" },
    { x: 5, y: 5, walkable: false, image: "White_png" },
    { x: 6, y: 5, walkable: true, image: "Black_png" },
    { x: 7, y: 5, walkable: false, image: "White_png" },
    { x: 8, y: 5, walkable: true, image: "Black_png" },
    { x: 9, y: 5, walkable: true, image: "Black_png" },
    { x: 10, y: 5, walkable: false, image: "White_png" },
    { x: 11, y: 5, walkable: false, image: "White_png" },
    { x: 0, y: 6, walkable: true, image: "Black_png" },
    { x: 1, y: 6, walkable: true, image: "Black_png" },
    { x: 2, y: 6, walkable: true, image: "Black_png" },
    { x: 3, y: 6, walkable: true, image: "Black_png" },
    { x: 4, y: 6, walkable: true, image: "Black_png" },
    { x: 5, y: 6, walkable: true, image: "Black_png" },
    { x: 6, y: 6, walkable: true, image: "Black_png" },
    { x: 7, y: 6, walkable: true, image: "Black_png" },
    { x: 8, y: 6, walkable: true, image: "Black_png" },
    { x: 9, y: 6, walkable: true, image: "Black_png" },
    { x: 10, y: 6, walkable: true, image: "Black_png" },
    { x: 11, y: 6, walkable: true, image: "Black_png" },
    { x: 0, y: 7, walkable: false, image: "White_png" },
    { x: 1, y: 7, walkable: false, image: "White_png" },
    { x: 2, y: 7, walkable: false, image: "White_png" },
    { x: 3, y: 7, walkable: false, image: "White_png" },
    { x: 4, y: 7, walkable: true, image: "Black_png" },
    { x: 5, y: 7, walkable: false, image: "White_png" },
    { x: 6, y: 7, walkable: false, image: "White_png" },
    { x: 7, y: 7, walkable: true, image: "Black_png" },
    { x: 8, y: 7, walkable: false, image: "White_png" },
    { x: 9, y: 7, walkable: true, image: "Black_png" },
    { x: 10, y: 7, walkable: false, image: "White_png" },
    { x: 11, y: 7, walkable: false, image: "White_png" },
    { x: 0, y: 8, walkable: true, image: "Black_png" },
    { x: 1, y: 8, walkable: false, image: "White_png" },
    { x: 2, y: 8, walkable: true, image: "Black_png" },
    { x: 3, y: 8, walkable: true, image: "Black_png" },
    { x: 4, y: 8, walkable: false, image: "White_png" },
    { x: 5, y: 8, walkable: true, image: "Black_png" },
    { x: 6, y: 8, walkable: false, image: "White_png" },
    { x: 7, y: 8, walkable: true, image: "Black_png" },
    { x: 8, y: 8, walkable: false, image: "White_png" },
    { x: 9, y: 8, walkable: true, image: "Black_png" },
    { x: 10, y: 8, walkable: false, image: "White_png" },
    { x: 11, y: 8, walkable: true, image: "Black_png" },
    { x: 0, y: 9, walkable: true, image: "Black_png" },
    { x: 1, y: 9, walkable: false, image: "White_png" },
    { x: 2, y: 9, walkable: true, image: "Black_png" },
    { x: 3, y: 9, walkable: false, image: "White_png" },
    { x: 4, y: 9, walkable: false, image: "White_png" },
    { x: 5, y: 9, walkable: true, image: "Black_png" },
    { x: 6, y: 9, walkable: true, image: "Black_png" },
    { x: 7, y: 9, walkable: true, image: "Black_png" },
    { x: 8, y: 9, walkable: false, image: "White_png" },
    { x: 9, y: 9, walkable: true, image: "Black_png" },
    { x: 10, y: 9, walkable: true, image: "Black_png" },
    { x: 11, y: 9, walkable: true, image: "Black_png" },
    { x: 0, y: 10, walkable: true, image: "Black_png" },
    { x: 1, y: 10, walkable: false, image: "White_png" },
    { x: 2, y: 10, walkable: true, image: "Black_png" },
    { x: 3, y: 10, walkable: true, image: "Black_png" },
    { x: 4, y: 10, walkable: true, image: "Black_png" },
    { x: 5, y: 10, walkable: true, image: "Black_png" },
    { x: 6, y: 10, walkable: false, image: "White_png" },
    { x: 7, y: 10, walkable: true, image: "Black_png" },
    { x: 8, y: 10, walkable: false, image: "White_png" },
    { x: 9, y: 10, walkable: false, image: "White_png" },
    { x: 10, y: 10, walkable: false, image: "White_png" },
    { x: 11, y: 10, walkable: true, image: "Black_png" },
    { x: 0, y: 11, walkable: true, image: "Black_png" },
    { x: 1, y: 11, walkable: true, image: "Black_png" },
    { x: 2, y: 11, walkable: true, image: "Black_png" },
    { x: 3, y: 11, walkable: true, image: "Black_png" },
    { x: 4, y: 11, walkable: true, image: "Black_png" },
    { x: 5, y: 11, walkable: true, image: "Black_png" },
    { x: 6, y: 11, walkable: true, image: "Black_png" },
    { x: 7, y: 11, walkable: true, image: "Black_png" },
    { x: 8, y: 11, walkable: false, image: "White_png" },
    { x: 9, y: 11, walkable: true, image: "Black_png" },
    { x: 10, y: 11, walkable: true, image: "Black_png" },
    { x: 11, y: 11, walkable: true, image: "Black_png" },
    { x: 0, y: 12, walkable: true, image: "Black_png" },
    { x: 1, y: 12, walkable: true, image: "Black_png" },
    { x: 2, y: 12, walkable: true, image: "Black_png" },
    { x: 3, y: 12, walkable: true, image: "Black_png" },
    { x: 4, y: 12, walkable: true, image: "Black_png" },
    { x: 5, y: 12, walkable: true, image: "Black_png" },
    { x: 6, y: 12, walkable: true, image: "Black_png" },
    { x: 7, y: 12, walkable: true, image: "Black_png" },
    { x: 8, y: 12, walkable: false, image: "White_png" },
    { x: 9, y: 12, walkable: true, image: "Black_png" },
    { x: 10, y: 12, walkable: true, image: "Black_png" },
    { x: 11, y: 12, walkable: true, image: "Black_png" },
    { x: 0, y: 13, walkable: true, image: "Black_png" },
    { x: 1, y: 13, walkable: true, image: "Black_png" },
    { x: 2, y: 13, walkable: true, image: "Black_png" },
    { x: 3, y: 13, walkable: true, image: "Black_png" },
    { x: 4, y: 13, walkable: true, image: "Black_png" },
    { x: 5, y: 13, walkable: true, image: "Black_png" },
    { x: 6, y: 13, walkable: true, image: "Black_png" },
    { x: 7, y: 13, walkable: true, image: "Black_png" },
    { x: 8, y: 13, walkable: false, image: "White_png" },
    { x: 9, y: 13, walkable: true, image: "Black_png" },
    { x: 10, y: 13, walkable: true, image: "Black_png" },
    { x: 11, y: 13, walkable: true, image: "Black_png" },
    { x: 0, y: 14, walkable: true, image: "Black_png" },
    { x: 1, y: 14, walkable: true, image: "Black_png" },
    { x: 2, y: 14, walkable: true, image: "Black_png" },
    { x: 3, y: 14, walkable: true, image: "Black_png" },
    { x: 4, y: 14, walkable: true, image: "Black_png" },
    { x: 5, y: 14, walkable: true, image: "Black_png" },
    { x: 6, y: 14, walkable: true, image: "Black_png" },
    { x: 7, y: 14, walkable: true, image: "Black_png" },
    { x: 8, y: 14, walkable: false, image: "White_png" },
    { x: 9, y: 14, walkable: true, image: "Black_png" },
    { x: 10, y: 14, walkable: true, image: "Black_png" },
    { x: 11, y: 14, walkable: true, image: "Black_png" },
    { x: 0, y: 15, walkable: true, image: "Black_png" },
    { x: 1, y: 15, walkable: true, image: "Black_png" },
    { x: 2, y: 15, walkable: true, image: "Black_png" },
    { x: 3, y: 15, walkable: true, image: "Black_png" },
    { x: 4, y: 15, walkable: true, image: "Black_png" },
    { x: 5, y: 15, walkable: true, image: "Black_png" },
    { x: 6, y: 15, walkable: true, image: "Black_png" },
    { x: 7, y: 15, walkable: true, image: "Black_png" },
    { x: 8, y: 15, walkable: false, image: "White_png" },
    { x: 9, y: 15, walkable: true, image: "Black_png" },
    { x: 10, y: 15, walkable: true, image: "Black_png" },
    { x: 11, y: 15, walkable: true, image: "Black_png" },
];
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        var bitmap = new engine.Bitmap();
        bitmap.src = data.image;
        bitmap.width = TileMap.TILE_SIZE;
        bitmap.height = TileMap.TILE_SIZE;
        _this.x = data.x * TileMap.TILE_SIZE;
        _this.y = data.y * TileMap.TILE_SIZE;
        _this.addChild(bitmap);
        return _this;
    }
    return Tile;
}(engine.DisplayObjectContainer));
var TileNode = (function () {
    // bitmap: egret.Bitmap = null;
    function TileNode(x, y) {
        this.walkable = true;
        this.x = x;
        this.y = y;
    }
    return TileNode;
}());
// interface State {
//     onEnter();
//     onExit();
// }
// abstract class AbstractPage  extends engine.DisplayObjectContainer implements State {  //egret.Sprite
//     onEnter() {
//     }
//     onExit() {
//     }
// }
// class PageContainer extends engine.DisplayObjectContainer {
//     private _pageList: AbstractPage[] = [];
//     private _currentIndex = 0;
//     private _touchBeginLocationY = 0;
//     private _touchDistance = 0;
//     private static HEIGHT = 1136;
//     constructor() {
//         super();
//         this.addListener();
//         this.touchEnabled = true;
//         this._pageList = [new FirstPage(), new SecondPage(), new ThirdPage()];
//         this.updatePagePosition();
//         this.updatePageDepth();
//         this._pageList[0].onEnter();
//     }
//     private addListener() {
//         this.addEventListener(engine.TouchEvent.TOUCH_BEGIN, (e: MouseEvent) => {
//             this._touchBeginLocationY = e.offsetY;
//             this.addEventListener(engine.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler);
//         });
//         this.addEventListener(engine.TouchEvent.TOUCH_END, (e) => {
//             this.removeEventListener(engine.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler);
//             this.onTouchEndHandler(e);
//         });
//     }
//     private onTouchEndHandler(e: engine.TouchEvent) {
//         var currentPage = this._pageList[this._currentIndex];
//         var nextPage = this._pageList[this._currentIndex + 1];
//         var prevPage = this._pageList[this._currentIndex - 1];
//         if (this._touchDistance <= -PageContainer.HEIGHT / 2 && nextPage) {
//             engine.Tween.get(currentPage).to({ y: -PageContainer.HEIGHT }, 300).call(() => {
//                 this.updatePagePosition();
//                 this.changePage("next");
//                 this.updatePageDepth();
//             }, this).addEventListener("change", () => {
//                 this.updatePagePosition();
//             }, this)
//         }
//         else if (this._touchDistance >= PageContainer.HEIGHT / 2 && prevPage) {
//             engine.Tween.get(currentPage).to({ y: PageContainer.HEIGHT }, 300).call(() => {
//                 this.updatePagePosition();
//                 this.changePage("prev");
//                 this.updatePageDepth();
//             }, this).addEventListener("change", () => {
//                 this.updatePagePosition();
//             }, this)
//         }
//         else {
//             engine.Tween.get(currentPage).to({ y: 0 }, 300).call(() => {
//                 this.updatePagePosition();
//             }, this).addEventListener("change", () => {
//                 this.updatePagePosition();
//             }, this)
//         }
//     }
//     private onTouchMoveHandler(e: MouseEvent) {
//         var currentPage = this._pageList[this._currentIndex];
//         this._touchDistance = e.offsetY - this._touchBeginLocationY;
//         currentPage.y = this._touchDistance;
//         this.updatePagePosition();
//     }
//     private updatePageDepth() {
//         var currentPage = this._pageList[this._currentIndex];
//         var prevPage = this._pageList[this._currentIndex - 1];
//         var nextPage = this._pageList[this._currentIndex + 1];
//         this.removeAll();
//         if (prevPage) {
//             this.addChild(prevPage);
//         }
//         this.addChild(currentPage);
//         if (nextPage) {
//             this.addChild(nextPage);
//         }
//     }
//     private updatePagePosition() {
//         var currentPage = this._pageList[this._currentIndex];
//         var prevPage = this._pageList[this._currentIndex - 1];
//         if (prevPage) {
//             prevPage.y = currentPage.y - PageContainer.HEIGHT;
//         }
//         var nextPage = this._pageList[this._currentIndex + 1];
//         if (nextPage) {
//             nextPage.y = currentPage.y + PageContainer.HEIGHT;
//         }
//     }
//     changePage(mode: "next" | "prev") {
//         var currentPage = this._pageList[this._currentIndex];
//         var prevPage = this._pageList[this._currentIndex - 1];
//         var nextPage = this._pageList[this._currentIndex + 1];
//         if (mode == "next") {
//             currentPage.onExit();
//             this._currentIndex++;
//             nextPage.onEnter();
//         }
//         else if (mode == "prev") {
//             currentPage.onExit();
//             this._currentIndex--;
//             prevPage.onEnter();
//         }
//     }
// }
// class FirstPage extends AbstractPage {
//     private textField: engine.TextField;
//     constructor() {
//         super();
//         var BlackMask = new engine.Shape();
//         BlackMask.graphics.beginFill(0x000000, 1);
//         BlackMask.graphics.drawRect(0, 0, 640, 1136);
//         BlackMask.graphics.endFill();
//         this.addChild(BlackMask);
//     }
//     onEnter() {
//         this.textField = new engine.TextField();
//         this.textField.text = "        随着探索的深入，人们发现量子效应只是物质之海表面的涟漪，是物质更深层规律扰动的影子。当这些规律渐渐明朗时，在量子力学中飘忽不定的实在图象再次稳定下来，确定值重新代替了概率，新的宇宙模型中，本认为已经消失了的因果链再次浮动并清晰起来。\n物理学在近年来连续地大突破，很象上世纪初的那阵儿，现在，只要给定边界条件，我们就可以拨开量子效应的迷雾，准确地预测单个或一群基本粒子的运动和演化。注意我说的一群，如果群里粒子的数量足够大它就构成了一个宏观物体，也就是说我们现在可以在原子级别上建立一个宏观物体的数学模型。这种模型被称为镜象模拟，因为它能已百分之百的准确再现模拟对象的宏观过程，因为宏观模拟对象建立了一个数字镜象。打个比方吧：如果用镜象模拟方式为一个鸡蛋建立数学模型，也就是将组成鸡蛋的每一个原子的状态都输入模拟的数据库，当这个模型在计算机中运行时，如果给出的边界条件合适，内存中的那个虚拟鸡蛋就会孵出小鸡来，而且内存中的虚拟小鸡，与现实中的那个鸡蛋孵出的小鸡一模一样，连每一根毛尖都不差一丝一毫！你往下想如果这个模拟目标比鸡蛋在大些呢？大到一棵树，一个人，很多人；大到一座城市，一个国家，甚至大到整个地球？我是一个狂想爱好者，热衷于在想象中大一切都推向终极，这就让我想到，如果镜象模拟的对象是整个宇宙会怎么样？！想想，整个宇宙！奶奶的，在一个计算机内存中运行的宇宙！从诞生到毁灭……”    ——刘慈欣《镜子》\n        我是一名疯狂科学家，我借助超弦计算机达到了模拟宇宙的程序，我称之为创世游戏，在原子级别模拟整个宇宙。超弦计算机具有终极容量，为这种模拟运算提供了硬件基础，对宇宙的镜象模拟必须从某个初始状态开始，也就是说，要在模拟开始时是某个时间断面上，将宇宙的全部原子状态一个一个地输入计算机，在原子级别上构建一个初始宇宙模型。正好存在着那样一个时间断面，宇宙是十分简单的，甚至比鸡蛋和细菌都简单，比现实中最简单的东西都简单，因为它那时的原子数是零，没有大小，没有结构。这就是大爆炸奇点。超弦理论已经建立了完善的奇点模型，我们只需要将这个模型用软件实现，输入计算机运算就可以了.\n        超弦计算机的主机其实只有一个烟盒大小，但原子电路需要在超低温下运行，所以主机浸在这个绝热容器里的液氮中。我将液晶显示器支起来，动了一下鼠标，处于休眠状态的超弦计算机立刻苏醒过来，液晶屏亮起来，象睁开了一只惺忪的睡眼，显示出一个很简单的界面，仅由一个下拉文本框和一个小小的标题组成，标题是：请选择创世启暴参数：";
//         this.addChild(this.textField);
//         this.textField.size = '24';
//         this.textField.y = 40;
//         this.textField.x = 20;
//         this.textField.width = 620;
//         //this.textField.textAlign = engine.HorizontalAlign.CENTER;
//     }
//     onExit() {
//         this.removeChild(this.textField);
//     }
// }
// class SecondPage extends AbstractPage {
//     private textField: engine.TextField;
//     constructor() {
//         super();
//         var rect = new engine.Shape();
//         rect.graphics.beginFill(0x000000, 1);
//         rect.graphics.drawRect(0, 0, 640, 1136);
//         rect.graphics.endFill();
//         this.addChild(rect);
//         this.textField = new engine.TextField();
//         this.textField.text = "    我们点了一下文本框旁边的箭头，下啦出一行行数据组，每组有十几个数据项，各行看上去差别很大，“奇点的性质由十八个参数确定，参数组合原则上是无限的，但根据超弦理论的推断，能够产生创世爆炸的参数组是有限的，但由多少组还是个迷。这里显示的只是其中的一小部分，我们随便选一组吧。”\n选中一组参数后，屏幕立刻变成了乳白色，正中凸现了两个醒目的大按纽：\n     “引爆 取消 ”  点了引爆按纽，屏幕上只剩一片乳白，“这白色象征虚无，这里没有空间，时间也还没有开始，什么都没有。”\n        屏幕左下角出现了一个红色数字“0”\n这个数字是宇宙演化的时间，0的出现说明奇点已经生成，它没有大小，所以我们看不到。\n       红色数字开始飞快增长。\n       屏幕中央出现了一个兰色的小点，很快增大为一个球体，发出耀眼的蓝光。球体急剧膨胀，很快占满整个屏幕，软件将视野拉远，球体重新缩为遥远处的一点，但爆炸中的宇宙很快又充满了整个屏幕。这个过程反复重复着，频率很快，仿佛是一手宏伟乐曲的节拍。\n      宇宙现在正处于暴胀阶段，它的膨胀速度远远超过光速。\n    随着球体膨胀速度的降低，视野拉开的频率渐渐慢了下来，随着能量密度的降低，球体的颜色由蓝向黄渐变，后来宇宙的色彩在红色上固定了下来，并渐渐变暗，屏幕上视野不再拉远，变成黑色的球体在屏幕上很缓慢地膨胀着。\n      好，现在踞大爆炸已经一百亿年了，这个宇宙处于稳定的演化阶段，我们进去看看吧。\n       宇宙呈现一个无际的黑色平面，有无数银光闪闪的直线与黑的平面垂直相交。这个宇宙维数比我们的低，是个二点五维的宇宙。\n       看这个黑色没有厚度的二维平面就是这个宇宙的太空，直径约500亿光年；那些与平面垂直的亮线就是太空中的恒星，她们都有几亿光年长，但无限细，只有一维。分数维的宇宙很少见，我要把这组创世参数记下来。\n     等下，更有意思的事情发生了，探测器显示这个宇宙里可能存在二维形式的生命活动，我们顺着时空预览图像的信息，将时间轴再向后点了一点，几十亿年的跨度，波澜壮阔的几何世界在眼前展开，二维智慧生命的发展速度领我感到震惊。让我们来见识一下这二维宇宙里的纷争与演变吧。我点下了追踪键，视角不断下沉。";
//         this.addChild(this.textField);
//         this.textField.size = '24';
//         this.textField.y = 40;
//         this.textField.x = 20;
//         this.textField.width = 620;
//     }
//     onEnter() {
//     }
//     onExit() {
//     }
// }
// class ThirdPage extends AbstractPage {
//     private textField: engine.TextField;
//     private back: engine.TextField = new engine.TextField();
//     constructor() {
//         super();
//         var rect = new engine.Shape();
//         rect.graphics.beginFill(0x000000, 1);
//         rect.graphics.drawRect(0, 0, 640, 1136);
//         rect.graphics.endFill();
//         this.addChild(rect);
//         this.textField = new engine.TextField();
//         this.textField.text = " 这是一个战争年代，二维的争端与纷乱并不比人类的世界暴力血腥，因为二维生命的寿命和坚韧程度相比较于人类（假如不同维度的宇宙的时间可以比较的话）近乎于无穷，二维间的战斗，建立于互相改变二维生命的几何形状为手段，以改变对方的几何形态（意识形态？）为目的，似乎并不像人类涉及到生命的毁灭与残酷的破坏，可能二维生命的智能比我预想的要高不少（有自我意识，有社会分级），这也更加提起了我的兴趣。借由控制台程序，我选择了一些有特征的创造二维世界历史的个体的视角来进行观测。\n      由于对于二维生命没有发现和能识别的有声以及文字语言（？），作为mad scientist的我将用春秋笔法客观的记下我认为的发生了的一切。\n      战争的分歧来自于几何形态的不同，以对称多边形和椭圆为代表的纯形派与其他不规则的几何图形所代表的混沌派产生了愈演愈烈的冲突，两方之间亿万的大小不一的二维生物从出生到漫长的岁月死亡都一直不断的相互厮打着，碰撞着。由于战争不断，多数图形的形状越来越扭曲，混乱，这对于混沌派来讲再好不过了，随着战线的近乎无限的延长，混沌派的以指数增长转换着纯形派的战士。无数规则的形状不再规则，转而投向敌营。在面对敌人压倒性的优势下，纯形派并不退缩，在战时全力推动着二维世界的军事科技为第一目标，由极大大数量级的个纯形的错落缺坚固的排列与不以混沌方式的挤压而组成的“城墙”为最后一道防线，坚守着自己的阵地。亘古的时间长河流淌到近乎干涸的时候，改变局势的个体终于出现了。\n        不知是生来还是后天挤压而形成的纯正形状出现了，扭转形势的纯正几何攻击在战场上近乎于战神的存在，分别是等边三角形，正方形，圆，已三种不同的几何力量矫正了所有二维生物于纯形，二维宇宙迎来了新的时代，纯形的规律决定了最小量级下物质的形状。";
//         this.addChild(this.textField);
//         this.textField.size = '24';
//         this.textField.y = 40;
//         this.textField.x = 20;
//         this.textField.width = 620;
//     }
//     onEnter() {
//         this.back.text = "返回";
//         this.back.size = '30';
//         this.back.touchEnabled = true;
//         this.back.y = 900;
//         this.back.x = 300;
//         this.addChild(this.back);
//         this.back.addEventListener(engine.TouchEvent.TOUCH_TAP, () => {
//             GameScene.getCurrentScene().stage.removeAll();
//             UIScene.getCurrentScene().gameMenu();
//         })
//     }
//     onExit() {
//     }
// } 
var Button = (function (_super) {
    __extends(Button, _super);
    function Button(ad) {
        var _this = _super.call(this) || this;
        _this.body = new engine.Bitmap();
        _this.body.src = ad;
        _this.addChild(_this.body);
        _this.touchEnabled = true;
        return _this;
    }
    return Button;
}(engine.DisplayObjectContainer));
var Panel = (function (_super) {
    __extends(Panel, _super);
    function Panel() {
        return _super.call(this) || this;
    }
    return Panel;
}(engine.DisplayObjectContainer));
var PropertyPanel = (function (_super) {
    __extends(PropertyPanel, _super);
    function PropertyPanel(hero) {
        var _this = _super.call(this) || this;
        _this.weaponflag = false;
        _this.tfname = new engine.TextField();
        _this.tfHP = new engine.TextField();
        _this.tfSTR = new engine.TextField();
        _this.tfFP = new engine.TextField();
        _this.tfATK = new engine.TextField();
        _this.tfCON = new engine.TextField();
        _this.tfDEX = new engine.TextField();
        _this.tfMAG = new engine.TextField();
        _this.tfSPD = new engine.TextField();
        _this.tfquality = new engine.TextField();
        _this.tfHIT = new engine.TextField();
        _this.tfCRIT = new engine.TextField();
        _this.tfEV = new engine.TextField();
        _this.tfweaponname = new engine.TextField();
        _this.tfweaponSTR = new engine.TextField();
        _this.tfweaponCON = new engine.TextField();
        _this.tfweaponDEX = new engine.TextField();
        _this.tfweaponMAG = new engine.TextField();
        _this.tfweaponSPD = new engine.TextField();
        _this.tfweaponATK = new engine.TextField();
        _this.body = new engine.Shape();
        _this.body.touchEnabled = true;
        _this.body.graphics.beginFill("#000000", 0.6);
        _this.body.graphics.drawRect(0, 0, 640, 400);
        _this.body.graphics.endFill();
        _this.closeButton = new Button("close_png");
        _this.weaponButton = new Button("block2_png");
        _this.closeButton.body.alpha = 0.95;
        _this.closeButton.body.width = 60;
        _this.closeButton.body.height = 60;
        _this.closeButton.body.x = 570;
        _this.closeButton.body.y = 340;
        _this.weaponButton.body.width = 60;
        _this.weaponButton.body.height = 60;
        _this.weaponButton.body.x = 80;
        _this.weaponButton.body.y = 250;
        _this.closeButton.touchEnabled = true;
        _this.closeButton.addEventListener(engine.TouchEvent.TOUCH_TAP, _this.disshowDpanel);
        _this.weaponButton.touchEnabled = true;
        _this.weaponButton.addEventListener(engine.TouchEvent.TOUCH_TAP, _this.updateweaponpanel);
        _this.addChild(_this.body);
        _this.addChild(_this.closeButton);
        _this.addChild(_this.weaponButton);
        _this.hero = hero;
        _this.tfname.x = 230;
        _this.tfname.y = 25;
        _this.tfFP.x = 230;
        _this.tfFP.y = 50;
        _this.tfATK.x = 230;
        _this.tfATK.y = 75;
        _this.tfHP.x = 230;
        _this.tfHP.y = 100;
        _this.tfSTR.x = 230;
        _this.tfSTR.y = 125;
        _this.tfCON.x = 230;
        _this.tfCON.y = 150;
        _this.tfMAG.x = 230;
        _this.tfMAG.y = 175;
        _this.tfDEX.x = 230;
        _this.tfDEX.y = 200;
        _this.tfSPD.x = 230;
        _this.tfSPD.y = 225;
        _this.tfHIT.x = 230;
        _this.tfHIT.y = 250;
        _this.tfEV.x = 230;
        _this.tfEV.y = 275;
        _this.tfCRIT.x = 230;
        _this.tfCRIT.y = 300;
        _this.Update();
        _this.showDpanel();
        return _this;
    }
    PropertyPanel.prototype.Update = function () {
        this.hero.heroInformationUpdate();
        if (this.hero.equipments.length != 0) {
            this.weaponButton.body.src = this.hero.equipments[0].ad;
        }
        this.tfname.text = this.hero.name;
        this.tfHP.text = "HP： " + this.hero.curHP.value + "/" + this.hero._maxHP.value;
        this.tfATK.text = this.hero._ATK.getDescription();
        this.tfCON.text = this.hero.CON.getDescription();
        this.tfCRIT.text = this.hero._CRIT.getDescription();
        this.tfDEX.text = this.hero.DEX.getDescription();
        this.tfEV.text = this.hero._EV.getDescription();
        this.tfFP.text = "战斗力： " + this.hero.fightPower;
        this.tfHIT.text = this.hero._HIT.getDescription();
        this.tfMAG.text = this.hero.MAG.getDescription();
        this.tfquality.text = this.hero.quality.getDescription();
        this.tfSPD.text = this.hero.SPD.getDescription();
        this.tfSTR.text = this.hero.STR.getDescription();
    };
    PropertyPanel.prototype.updateweaponpanel = function () {
        if (this.weaponflag == false && this.hero.equipments.length != 0) {
            this.showWeaponpanel();
        }
        else {
            if (this.weaponflag == true) {
                this.disshowWeaponpanel();
            }
        }
    };
    PropertyPanel.prototype.showWeaponpanel = function () {
        this.weaponflag = true;
        this.weaponbody = new engine.Shape();
        this.weaponbody.touchEnabled = true;
        this.weaponbody.graphics.beginFill("#000000", 0.5);
        this.weaponbody.graphics.drawRect(0, 0, 300, 240);
        this.weaponbody.graphics.endFill();
        this.addChild(this.weaponbody);
        this.addChild(this.tfweaponname);
        this.addChild(this.tfweaponATK);
        this.addChild(this.tfweaponCON);
        this.addChild(this.tfweaponDEX);
        this.addChild(this.tfweaponMAG);
        this.addChild(this.tfweaponSPD);
        this.addChild(this.tfweaponSTR);
        this.tfweaponname.text = this.hero.equipments[0].name;
        this.tfweaponname.x = 20;
        this.tfweaponname.y = 30;
        this.tfweaponATK.text = "附加伤害：" + this.hero.equipments[0]._attack;
        this.tfweaponATK.x = 20;
        this.tfweaponATK.y = 55;
        this.tfweaponSTR.text = "附加形状：" + this.hero.equipments[0].STR;
        this.tfweaponSTR.x = 20;
        this.tfweaponSTR.y = 80;
        this.tfweaponCON.text = "附加面积：" + this.hero.equipments[0].CON;
        this.tfweaponCON.x = 20;
        this.tfweaponCON.y = 105;
        this.tfweaponMAG.text = "附加抽象：" + this.hero.equipments[0].MAG;
        this.tfweaponMAG.x = 20;
        this.tfweaponMAG.y = 130;
        this.tfweaponDEX.text = "附加稳定：" + this.hero.equipments[0].DEX;
        this.tfweaponDEX.x = 20;
        this.tfweaponDEX.y = 155;
        this.tfweaponSPD.text = "附加速度：" + this.hero.equipments[0].SPD;
        this.tfweaponSPD.x = 20;
        this.tfweaponSPD.y = 180;
    };
    PropertyPanel.prototype.disshowWeaponpanel = function () {
        this.weaponflag = false;
        this.removeChild(this.tfweaponname);
        this.removeChild(this.tfweaponATK);
        this.removeChild(this.tfweaponCON);
        this.removeChild(this.tfweaponDEX);
        this.removeChild(this.tfweaponMAG);
        this.removeChild(this.tfweaponSPD);
        this.removeChild(this.tfweaponSTR);
        this.removeChild(this.weaponbody);
    };
    PropertyPanel.prototype.showDpanel = function () {
        PropertyPanel.flag = 1;
        this.addChild(this.tfname);
        this.addChild(this.tfATK);
        this.addChild(this.tfCON);
        this.addChild(this.tfCRIT);
        this.addChild(this.tfDEX);
        this.addChild(this.tfEV);
        this.addChild(this.tfFP);
        this.addChild(this.tfHIT);
        this.addChild(this.tfHP);
        this.addChild(this.tfMAG);
        this.addChild(this.tfquality);
        this.addChild(this.tfSPD);
        this.addChild(this.tfSTR);
    };
    PropertyPanel.prototype.disshowDpanel = function () {
        PropertyPanel.flag = 0;
        this.removeChild(this.tfname);
        this.removeChild(this.body);
        this.removeChild(this.closeButton);
        this.removeChild(this.weaponButton);
        this.removeChild(this.tfATK);
        this.removeChild(this.tfCON);
        this.removeChild(this.tfCRIT);
        this.removeChild(this.tfDEX);
        this.removeChild(this.tfEV);
        this.removeChild(this.tfFP);
        this.removeChild(this.tfHIT);
        this.removeChild(this.tfHP);
        this.removeChild(this.tfMAG);
        this.removeChild(this.tfquality);
        this.removeChild(this.tfSPD);
        this.removeChild(this.tfSTR);
        //this.disshowWeaponpanel();
    };
    return PropertyPanel;
}(engine.DisplayObjectContainer));
PropertyPanel.flag = 0;
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
var Property = (function () {
    function Property(name, value) {
        this.name = name;
        this.value = value;
        //this.isRate = isRate;
    }
    Property.prototype.getDescription = function () {
        return this.name + ": + " + this.value;
    };
    return Property;
}());
var Properties = (function () {
    function Properties() {
        this.all = [new Property("攻击", 100)];
    }
    Properties.prototype.getAtkDescription = function () {
        return this.atk.getDescription();
    };
    Properties.prototype.getDefDescription = function () {
        return this.def.getDescription();
    };
    Properties.prototype.getProperty = function (propertyName) {
        return this.all[propertyName];
    };
    return Properties;
}());
var PropertyName;
(function (PropertyName) {
    PropertyName[PropertyName["STR"] = 0] = "STR";
    PropertyName[PropertyName["CON"] = 1] = "CON";
    PropertyName[PropertyName["DEX"] = 2] = "DEX";
    PropertyName[PropertyName["MAG"] = 3] = "MAG";
    PropertyName[PropertyName["SPD"] = 4] = "SPD";
})(PropertyName || (PropertyName = {}));
var PropertiesDisplayUtils = (function () {
    function PropertiesDisplayUtils() {
    }
    PropertiesDisplayUtils.createAllPropertiesDecription = function (properties) {
        var container = new engine.DisplayObjectContainer();
        for (var _i = 0, _a = properties.all; _i < _a.length; _i++) {
            var p = _a[_i];
            var tf = new engine.TextField();
            tf.text = PropertiesDisplayUtils.getDescription(p);
            container.addChild(tf);
        }
        return container;
    };
    PropertiesDisplayUtils.getDescription = function (property, color) {
        if (property.isRate) {
            var textColor = property.value >= 500 ? "red" : "green";
            return property.name + ": +<red>" + (property.value / 10).toFixed(2);
        }
        else {
            return property.name + ": + " + property.value;
        }
    };
    return PropertiesDisplayUtils;
}());
var User = (function () {
    // pet: pet;
    function User(name) {
        this.cash = 0;
        this.gold = 0;
        this.exp = 0;
        this.totalExp = 0;
        this.level = 1;
        this.heros = [];
        this._herosInTeam = [];
        this.name = name;
    }
    Object.defineProperty(User.prototype, "herosInTeam", {
        get: function () {
            return this.heros.filter(function (hero) { return hero.isInTeam; });
        },
        enumerable: true,
        configurable: true
    });
    //@Cache
    User.prototype.getFightPower = function () {
        var result = 0;
        this.herosInTeam.map(function (hero) { return result += hero.getFightPower(); });
        // result += this.pet.getFightPower();
        return result;
    };
    User.prototype.changeHeroTeam = function (heroToUp, heroToDown) {
    };
    User.prototype.mountEquipment = function (equip, hero) {
        //User.packages.remove(equip);       //单例
        hero.mount(equip);
    };
    return User;
}());
var Package = (function () {
    function Package() {
    }
    return Package;
}());
var qualityType;
(function (qualityType) {
    qualityType[qualityType["C"] = 0] = "C";
    qualityType[qualityType["B"] = 1] = "B";
    qualityType[qualityType["A"] = 2] = "A";
    qualityType[qualityType["S"] = 3] = "S";
    qualityType[qualityType["SS"] = 4] = "SS";
})(qualityType || (qualityType = {}));
var equipmentType;
(function (equipmentType) {
    equipmentType[equipmentType["weapon"] = 0] = "weapon";
    equipmentType[equipmentType["cloth"] = 1] = "cloth";
    equipmentType[equipmentType["accessorie"] = 2] = "accessorie";
})(equipmentType || (equipmentType = {}));
var occupationType;
(function (occupationType) {
})(occupationType || (occupationType = {}));
var Hero = (function () {
    function Hero(name, str, con, dex, mag, spd, quality) {
        this.skills = [];
        this.isInTeam = false;
        this.equipments = [];
        this.level = 1;
        this.curHP = new Property("当前HP", null);
        this._maxHP = new Property("最大HP", null);
        this.curMP = new Property("当前MP", null);
        this._maxMP = new Property("最大MP", null);
        this._ATK = new Property("伤害", null);
        this._CRIT = new Property("暴击", null);
        this._EV = new Property("闪避", null);
        this._HIT = new Property("命中", null);
        this.name = name;
        this.STR = new Property("形状力", str);
        this.CON = new Property("面积", con);
        this.DEX = new Property("稳定性", dex);
        this.MAG = new Property("抽象性", mag);
        this.SPD = new Property("速度", spd);
        this.quality = new Property("成长", quality);
        this.heroInformationUpdate();
    }
    Hero.prototype.mount = function (equip) {
    };
    Hero.prototype.equip = function (equipment) {
        this.equipments.push(equipment);
        this.heroInformationUpdate();
    };
    Object.defineProperty(Hero.prototype, "maxHp", {
        get: function () {
            return this.CON.value * 10;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Hero.prototype, "maxMp", {
        get: function () {
            return this.MAG.value * 10;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Hero.prototype, "HIT", {
        get: function () {
            return this.DEX.value * 7 + this.SPD.value * 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Hero.prototype, "CRIT", {
        get: function () {
            return this.DEX.value * 11;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Hero.prototype, "EV", {
        get: function () {
            return this.DEX.value * 5 + this.SPD.value * 7;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Hero.prototype, "ATK", {
        get: function () {
            var result = 0;
            this.equipments.forEach(function (e) { return result += e._attack; });
            result += this.STR.value;
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Hero.prototype, "fightPower", {
        get: function () {
            return this.getFightPower();
        },
        enumerable: true,
        configurable: true
    });
    Hero.prototype.getFightPower = function () {
        return this._ATK.value * 5 + this.SPD.value * 4 + this.STR.value * 10 + this.MAG.value * 8 + this.CON.value * 6 + this.DEX.value * 11;
    };
    Hero.prototype.levelup = function () {
        this.level++;
        this.STR.value += this.STRUP;
        this.CON.value += this.CONUP;
        this.heroInformationUpdate();
    };
    Hero.prototype.heroInformationUpdate = function () {
        var _this = this;
        this.equipments.forEach(function (e) { return _this.STR.value += e.STR; });
        this.equipments.forEach(function (e) { return _this.CON.value += e.CON; });
        this.equipments.forEach(function (e) { return _this.DEX.value += e.DEX; });
        this.equipments.forEach(function (e) { return _this.MAG.value += e.MAG; });
        this.equipments.forEach(function (e) { return _this.SPD.value += e.SPD; });
        this._ATK.value = this.ATK;
        this._CRIT.value = this.CRIT;
        this._EV.value = this.EV;
        this._HIT.value = this.HIT;
        this._maxHP.value = this.maxHp;
        this.curHP.value = this._maxHP.value;
        this._maxMP.value = this.maxMp;
        this.curMP.value = this._maxMP.value / 2;
    };
    return Hero;
}());
var Equipment = (function () {
    function Equipment(name, ad, type, atk, runes) {
        this.STR = 0; //力量
        this.CON = 0; //体力
        this.DEX = 0; //技巧
        this.MAG = 0; //魔力
        this.SPD = 0; //速度
        this.runes = [];
        this.ad = ad;
        this.name = name;
        this.equipmentType = type;
        this._attack = atk;
        this.runes = runes;
        this.equipmentUpdate();
    }
    Equipment.prototype.equipmentUpdate = function () {
        var _this = this;
        this.runes.forEach(function (e) { return _this.STR += e.STR; });
        this.runes.forEach(function (e) { return _this.CON += e.CON; });
        this.runes.forEach(function (e) { return _this.DEX += e.DEX; });
        this.runes.forEach(function (e) { return _this.SPD += e.SPD; });
        this.runes.forEach(function (e) { return _this.MAG += e.MAG; });
    };
    return Equipment;
}());
// class jewel {
// }
var rune = (function () {
    function rune(quality) {
        this.STR = 0; //力量
        this.CON = 0; //体力
        this.DEX = 0; //技巧
        this.MAG = 0; //魔力
        this.SPD = 0; //速度
        this.quality = quality;
        switch (Math.floor(Math.random() * 3)) {
            case 0:
                this.STR += Math.floor(Math.random() * 6) * this.quality;
                break;
            case 1:
                this.CON += Math.floor(Math.random() * 6) * this.quality;
                break;
            case 2:
                this.DEX += Math.floor(Math.random() * 6) * this.quality;
                break;
            case 3:
                this.MAG += Math.floor(Math.random() * 6) * this.quality;
                break;
            case 4:
                this.SPD += Math.floor(Math.random() * 6) * this.quality;
                break;
        }
    }
    return rune;
}());
function SetTriangle(lv) {
    var sanjiao = new Hero("三角", 47 + 7 * lv, 77 + 7 * lv, 10, 10, 2, 7);
    sanjiao.CONUP = 7;
    sanjiao.STRUP = 7;
    sanjiao.skills = [
        { x: 40, y: 1000, name: "<射击>", image: "Skill_1_png", inf: "普通的\n远程攻击", ratio: 100, MPneed: 5, distance: 2, type: 0, num: 1 },
        { x: 170 - 2, y: 1000, name: "<轰击>", image: "Skill_1_png", inf: "聚集锋芒的\n重型远程攻击", ratio: 350, MPneed: 70, distance: 3, type: 0, num: 1 },
        { x: 300 - 4, y: 1000, name: "<划击>", image: "Skill_1_png", inf: "不擅长的\n近战攻击", ratio: 80, MPneed: 0, distance: 1, type: 0, num: 1 },
        { x: 430 - 6, y: 1000, name: "<尖锐化>", image: "Skill_1_png", inf: "三角高速旋转\n本次战斗中\n永久提升速度", ratio: 100, MPneed: 100, distance: 0, type: SkillType.speedbuff, num: 1 },
        { x: 560 - 8, y: 1000, name: "<三角移动>", image: "Skill_1_png", inf: "移动一格\n并回复10MP", ratio: 0, MPneed: -10, distance: 1, type: 4, num: 1 },
    ];
    return sanjiao;
}
function SetSquare(lv) {
    var fangkuai = new Hero("方块", 50 + 10 * lv, 100 + 10 * lv, 8, 10, 2, 10);
    fangkuai.CONUP = 10;
    fangkuai.STRUP = 10;
    fangkuai.skills = [
        { x: 40, y: 1000, name: "<棱刮>", image: "Skill_1_png", inf: "普通的\n近战攻击", ratio: 100, MPneed: 0, distance: 1, type: 0, num: 2 },
        { x: 170, y: 1000, name: "<格式打击>", image: "Skill_1_png", inf: "猛扑的\n对敌人造成重创", ratio: 250, MPneed: 50, distance: 1, type: 0, num: 2 },
        { x: 290 + 6, y: 1000, name: "<空格>", image: "Skill_1_png", inf: "向所指方向\n跳跃一格\n并撞击敌人", ratio: 125, MPneed: 30, distance: 2, type: SkillType.jump, num: 2 },
        { x: 420 + 4, y: 1000, name: "<栅格化>", image: "Skill_1_png", inf: "方块更方了\n本次战斗中\n永久提升攻击力", ratio: 150, MPneed: 100, distance: 2, type: SkillType.speedbuff, num: 2 },
        { x: 550 + 2, y: 1000, name: "<方块移动>", image: "Skill_1_png", inf: "上下左右\n一格的范围", ratio: 0, MPneed: 0, distance: 1, type: 4, num: 2 }
    ];
    return fangkuai;
}
function SetCircle(lv) {
    var zhengyuan = new Hero("正圆", 42 + 8 * lv, 120 + 12 * lv, 6, 10, 2, 10);
    zhengyuan.CONUP = 12;
    zhengyuan.STRUP = 8;
    zhengyuan.skills = [
        { x: 40, y: 1000, name: "<碾压>", image: "Skill_1_png", inf: "普通的攻击\n命中后回复8MP", ratio: 100, MPneed: -8, distance: 1, type: 0, num: 3 },
        { x: 170, y: 1000, name: "<飞盘>", image: "Skill_1_png", inf: "正圆自身的\n投影远程攻击\n命中后回复5MP", ratio: 80, MPneed: -5, distance: 2, type: 0, num: 3 },
        { x: 290 + 6, y: 1000, name: "<翻滚>", image: "Skill_1_png", inf: "直线大幅度移动\n回复2MP", ratio: 0, MPneed: -2, distance: 5, type: SkillType.roll, num: 3 },
        { x: 420 + 4, y: 1000, name: "<圆滑化>", image: "Skill_1_png", inf: "正圆变得\n更加圆润光滑\n按当前比例增长HP", ratio: 150, MPneed: 100, distance: 2, type: SkillType.HPbuff, num: 3 },
        { x: 550 + 2, y: 1000, name: "<正圆移动>", image: "Skill_1_png", inf: "上下左右\n一格的范围", ratio: 0, MPneed: 0, distance: 1, type: 4, num: 3 },
    ];
    return zhengyuan;
}
var SceneService = (function () {
    function SceneService() {
        this.observerList = [];
        this.list = new CommandList();
        SceneService.count++;
        if (SceneService.count > 1) {
            throw "singleton!!!";
        }
    }
    SceneService.getInstance = function () {
        if (SceneService.instance == null) {
            SceneService.instance = new SceneService();
        }
        return SceneService.instance;
    };
    SceneService.prototype.addObserver = function (observer) {
        for (var i = 0; i < this.observerList.length; i++) {
            if (observer == this.observerList[i])
                return ErrorCode.REPEAT_OBSERVER;
        }
        this.observerList.push(observer);
    };
    SceneService.prototype.notify = function (task) {
        for (var _i = 0, _a = this.observerList; _i < _a.length; _i++) {
            var observer = _a[_i];
            observer.onChange(task);
        }
    };
    return SceneService;
}());
SceneService.count = 0;
var GameScene = (function () {
    function GameScene() {
    }
    GameScene.replaceScene = function (scene) {
        GameScene.scene = scene;
    };
    GameScene.getCurrentScene = function () {
        return GameScene.scene;
    };
    GameScene.prototype.moveTo = function (x, y, callback) {
        var _this = this;
        console.log("开始移动");
        var playerX = Math.floor(GameScene.getCurrentScene().player._body.x / TileMap.TILE_SIZE);
        var playerY = Math.floor(GameScene.getCurrentScene().player._body.y / TileMap.TILE_SIZE);
        // var playerX: number = 0;
        // var playerY: number = 0;
        var gridX = x;
        var gridY = y;
        var astar = new AStar();
        var grid = new Grid(12, 16, testmap);
        grid.setStartNode(playerX, playerY);
        grid.setEndNode(gridX, gridY);
        //console.log(grid._nodes);
        if (astar.findPath(grid)) {
            astar._path.map(function (tile) {
                console.log("x:" + tile.x + ",y:" + tile.y);
            });
            var path = astar._path;
            var current = path.shift();
            this.ticker = function () {
                playerX = Math.floor(GameScene.getCurrentScene().player._body.x / TileMap.TILE_SIZE + 0.5);
                playerY = Math.floor(GameScene.getCurrentScene().player._body.y / TileMap.TILE_SIZE + 0.5);
                // playerX = Math.ceil(GameScene.getCurrentScene().player._body.x / TileMap.TILE_SIZE);
                // playerY = Math.ceil(GameScene.getCurrentScene().player._body.y / TileMap.TILE_SIZE);
                var diffX = TileMap.TILE_SPEED * (current.x - playerX);
                var diffY = TileMap.TILE_SPEED * (current.y - playerY);
                GameScene.getCurrentScene().player._body.x += diffX;
                GameScene.getCurrentScene().player._body.y += diffY;
                // if (Math.abs(GameScene.getCurrentScene().player._body.x - TileMap.TILE_SIZE * current.x) < TileMap.TILE_SPEED) {
                // }
                if (playerX == current.x && playerY == current.y) {
                    engine.Ticker.getInstance().unregister(_this.ticker);
                    // var tween = engine.Tween.get(GameScene.getCurrentScene().player._body);
                    // tween.to({ x: current.x * TileMap.TILE_SIZE, y: current.y * TileMap.TILE_SIZE }, 100);
                    engine.Ticker.getInstance().register(_this.ticker);
                    // GameScene.getCurrentScene().player._body.x = current.x * TileMap.TILE_SIZE;
                    // GameScene.getCurrentScene().player._body.y = current.y * TileMap.TILE_SIZE;
                    if (astar._path.length == 0) {
                        engine.Ticker.getInstance().unregister(_this.ticker);
                        console.log("结束移动");
                        callback();
                    }
                    else {
                        current = path.shift();
                    }
                }
            };
            engine.Ticker.getInstance().register(this.ticker);
            playerX = Math.floor(GameScene.getCurrentScene().player._body.x / TileMap.TILE_SIZE + 0.5);
            playerY = Math.floor(GameScene.getCurrentScene().player._body.y / TileMap.TILE_SIZE + 0.5);
        }
    };
    GameScene.prototype.stopMove = function (callback) {
        var playerX = Math.floor(GameScene.getCurrentScene().player._body.x / TileMap.TILE_SIZE + 0.5);
        var playerY = Math.floor(GameScene.getCurrentScene().player._body.y / TileMap.TILE_SIZE + 0.5);
        engine.Ticker.getInstance().unregister(this.ticker);
        GameScene.getCurrentScene().player._body.x = playerX * TileMap.TILE_SIZE;
        GameScene.getCurrentScene().player._body.y = playerY * TileMap.TILE_SIZE;
        setTimeout(function () {
            console.log("中断移动");
            callback();
        }, this, 500);
    };
    return GameScene;
}());
GameScene.scene = new GameScene();
var UIScene = (function () {
    function UIScene() {
    }
    UIScene.replaceScene = function (scene) {
        UIScene.scene = scene;
    };
    UIScene.getCurrentScene = function () {
        return UIScene.scene;
    };
    UIScene.prototype.gameMenu = function () {
        var stageW = 640;
        var stageH = 1136;
        var BlackMask = new engine.Shape();
        BlackMask.graphics.beginFill("#000000", 1);
        BlackMask.graphics.drawRect(0, 0, stageW, stageH);
        BlackMask.graphics.endFill();
        BlackMask.graphics.width = stageW;
        BlackMask.graphics.height = stageH;
        GameScene.getCurrentScene().stage.addChild(BlackMask);
        //   UIScene.getCurrentScene().hero = SetTriangle();
        //   var battle = new Battle(UIScene.getCurrentScene().hero,1,"npc_2_png",6,6);
        //  GameScene.getCurrentScene().main.addChild(battle);
        // var WhiteMask = new engine.Shape();
        // WhiteMask.graphics.beginFill("#FFFFFF", 1);
        // WhiteMask.graphics.drawRect(0, 0, stageW, stageH);
        // WhiteMask.graphics.endFill();
        // WhiteMask.graphics.width = stageW;
        // WhiteMask.graphics.height = stageH;
        // //this.addChild(WhiteMask);
        // //WhiteMask.alpha = 0;
        var back = new engine.Bitmap();
        back.src = "menu.jpg";
        GameScene.getCurrentScene().stage.addChild(back);
        var stageW = 640;
        var stageH = 1136;
        back.width = stageW;
        back.height = stageH;
        back.y = -150;
        var count = 0;
        engine.Ticker.getInstance().register(function () {
            if (count < 5) {
                back.scaleY *= 1.003;
            }
            else if (count < 10 || count >= 5) {
                back.scaleY /= 1.003;
            }
            count += 0.5;
            if (count >= 10) {
                count = 0;
            }
        });
        var Title = new engine.TextField();
        //Title.textColor = #ffffff;
        //Title.width = stageW - 172;
        // Title.textAlign = "center";
        Title.text = "二维位面之纯形争霸";
        Title.size = '50';
        Title.font = '黑体';
        Title.x = 100;
        Title.y = 100;
        GameScene.getCurrentScene().stage.addChild(Title);
        var start = new engine.TextField();
        // start.textColor = #ffffff;
        // start.width = stageW - 172;
        // start.textAlign = "center";
        start.text = "开始游戏2";
        start.size = '40';
        start.font = '黑体';
        start.x = 90;
        start.y = 800;
        GameScene.getCurrentScene().stage.addChild(start);
        start.touchEnabled = true;
        start.addEventListener(engine.TouchEvent.TOUCH_TAP, function () {
            console.log(start);
            GameScene.getCurrentScene().stage.removeChild(start);
            GameScene.getCurrentScene().stage.removeChild(material);
            GameScene.getCurrentScene().stage.removeChild(about);
            GameScene.getCurrentScene().stage.removeChild(Title);
            GameScene.getCurrentScene().stage.removeChild(back);
            UIScene.getCurrentScene().showPick();
        });
        var material = new engine.TextField();
        // material.textColor = #ffffff;
        // material.width = stageW - 172;
        // material.textAlign = "center";
        material.text = "背景资料";
        material.size = '40';
        material.font = '黑体';
        material.x = 90;
        material.y = 850;
        GameScene.getCurrentScene().stage.addChild(material);
        // material.touchEnabled = true;
        // material.addEventListener(engine.TouchEvent.TOUCH_TAP, () => {
        //     var p = new PageContainer();
        //     GameScene.getCurrentScene().stage.removeAll();
        //     GameScene.getCurrentScene().stage.addChild(p);
        // })
        var about = new engine.TextField();
        // about.textColor = #ffffff;
        // about.width = stageW - 172;
        // about.textAlign = "center";
        about.text = "游戏理念";
        about.size = '40';
        about.font = '黑体';
        about.x = 90;
        about.y = 900;
        GameScene.getCurrentScene().stage.addChild(about);
        about.touchEnabled = true;
        about.addEventListener(engine.TouchEvent.TOUCH_TAP, function (e) {
            GameScene.getCurrentScene().stage.removeAll();
            UIScene.getCurrentScene().gameabout();
        });
    };
    UIScene.prototype.showPick = function () {
        var _this = this;
        var pick = new engine.TextField();
        // pick.textColor = #ffffff;
        // pick.width = 640 - 172;
        // pick.textAlign = "center";
        pick.text = "选择进入一名纯形战士视角";
        pick.size = '36';
        pick.font = '黑体';
        pick.x = 90;
        pick.y = 400;
        GameScene.getCurrentScene().stage.addChild(pick);
        var sanjiao = new engine.TextField();
        // sanjiao.textColor = #ffffff;
        // sanjiao.width = 640 - 172;
        // sanjiao.textAlign = "center";
        sanjiao.text = "▲三角（善于迂回和远程输出）";
        sanjiao.size = '30';
        sanjiao.font = '黑体';
        sanjiao.x = 90;
        sanjiao.y = 600;
        GameScene.getCurrentScene().stage.addChild(sanjiao);
        sanjiao.touchEnabled = true;
        sanjiao.addEventListener(engine.TouchEvent.TOUCH_BEGIN, function (e) {
            _this.ad = "sanjiao_png";
            switch (_this.ad) {
                case "sanjiao_png":
                    console.log("sanjiao");
                    _this.hero = SetTriangle(0);
                    break;
                case "fangkuai_png":
                    _this.hero = SetSquare(0);
                    break;
                case "zhengyuan_png":
                    _this.hero = SetCircle(0);
                    break;
            }
            GameScene.getCurrentScene().stage.removeChild(pick);
            GameScene.getCurrentScene().stage.removeChild(sanjiao);
            GameScene.getCurrentScene().stage.removeChild(fangkuai);
            GameScene.getCurrentScene().stage.removeChild(zhengyuan);
            _this.gamestart();
        });
        var fangkuai = new engine.TextField();
        // fangkuai.textColor = #ffffff;
        // fangkuai.width = 640 - 172;
        // fangkuai.textAlign = "center";
        fangkuai.text = "■方块（侵略性强并善于近战）";
        fangkuai.size = '30';
        fangkuai.font = '黑体';
        fangkuai.x = 90;
        fangkuai.y = 650;
        GameScene.getCurrentScene().stage.addChild(fangkuai);
        fangkuai.touchEnabled = true;
        fangkuai.addEventListener(engine.TouchEvent.TOUCH_BEGIN, function (e) {
            _this.ad = "fangkuai_png";
            switch (_this.ad) {
                case "sanjiao_png":
                    console.log("sanjiao");
                    _this.hero = SetTriangle(0);
                    break;
                case "fangkuai_png":
                    _this.hero = SetSquare(0);
                    break;
                case "zhengyuan_png":
                    _this.hero = SetCircle(0);
                    break;
            }
            GameScene.getCurrentScene().stage.removeChild(pick);
            GameScene.getCurrentScene().stage.removeChild(sanjiao);
            GameScene.getCurrentScene().stage.removeChild(fangkuai);
            GameScene.getCurrentScene().stage.removeChild(zhengyuan);
            _this.gamestart();
        });
        var zhengyuan = new engine.TextField();
        // zhengyuan.textColor = #ffffff;
        // zhengyuan.width = 640 - 172;
        // zhengyuan.textAlign = "center";
        zhengyuan.text = "●正圆（兼具灵活性和消耗战）";
        zhengyuan.size = '30';
        zhengyuan.font = '黑体';
        zhengyuan.x = 90;
        zhengyuan.y = 700;
        GameScene.getCurrentScene().stage.addChild(zhengyuan);
        zhengyuan.touchEnabled = true;
        zhengyuan.addEventListener(engine.TouchEvent.TOUCH_BEGIN, function (e) {
            _this.ad = "zhengyuan_png";
            switch (_this.ad) {
                case "sanjiao_png":
                    console.log("sanjiao");
                    _this.hero = SetTriangle(0);
                    break;
                case "fangkuai_png":
                    _this.hero = SetSquare(0);
                    break;
                case "zhengyuan_png":
                    _this.hero = SetCircle(0);
                    break;
            }
            GameScene.getCurrentScene().stage.removeChild(pick);
            GameScene.getCurrentScene().stage.removeChild(sanjiao);
            GameScene.getCurrentScene().stage.removeChild(fangkuai);
            GameScene.getCurrentScene().stage.removeChild(zhengyuan);
            _this.gamestart();
        });
    };
    UIScene.prototype.gameabout = function () {
        var rect = new engine.Shape();
        var textField = new engine.TextField();
        rect.graphics.beginFill("#000000", 1);
        rect.graphics.drawRect(0, 0, 640, 1136);
        rect.graphics.endFill();
        GameScene.getCurrentScene().stage.addChild(rect);
        textField.text = "作者 14081216 白宇昆\n这是一款半即时的战棋对抗游戏\n改编的刘慈欣的《镜子》作为剧情背景\n在二维位面里\n形状越正，血统越纯\n面积=血量，边长=速度\n借几何喻人，反应现实\n未来可能会加入的新细节\n根据随机的颜色改变敌人的属性\nR攻击撞击力\nG连接深入能力\nB特殊攻击能力\n六边形，三角形等对战地图";
        GameScene.getCurrentScene().stage.addChild(textField);
        textField.size = '30';
        textField.y = 200;
        textField.x = 60;
        //textField.width = 620;
        var back = new engine.TextField();
        back.text = "返回";
        back.size = '30';
        back.touchEnabled = true;
        back.y = 900;
        back.x = 300;
        GameScene.getCurrentScene().stage.addChild(back);
        back.addEventListener(engine.TouchEvent.TOUCH_TAP, function (e) {
            GameScene.getCurrentScene().stage.removeAll();
            UIScene.getCurrentScene().gameMenu();
        });
    };
    UIScene.prototype.gamestart = function () {
        var equipmentButtun = new engine.TextField();
        equipmentButtun.text = "状态";
        equipmentButtun.size = '40';
        equipmentButtun.x = 280;
        equipmentButtun.y = 1000;
        GameScene.getCurrentScene().stage.addChild(equipmentButtun);
        equipmentButtun.touchEnabled = true;
        equipmentButtun.addEventListener(engine.TouchEvent.TOUCH_TAP, function (e) {
            if (PropertyPanel.flag == 0) {
                console.log(PropertyPanel.flag);
                var pp = new PropertyPanel(UIScene.getCurrentScene().hero);
                GameScene.getCurrentScene().stage.addChild(pp);
            }
        });
        var Dpanel_1 = new DialoguePanel("年轻纯种的纯形战士，我已经被腐化了\n去找还有希望被拯救的形状吧");
        var Dpanel_2 = new DialoguePanel("变得不规则好像也没什么不好\n先跟我较量看看吧");
        this.dp1 = Dpanel_1;
        this.dp2 = Dpanel_2;
        var NPC_1 = new NPC("NPC_1", "npc_1_png", TileMap.TILE_SIZE * 4, TileMap.TILE_SIZE * 4, this.dp1);
        var NPC_2 = new NPC("NPC_2", "npc_2_png", TileMap.TILE_SIZE * 6, TileMap.TILE_SIZE * 12, this.dp2);
        this.dp1.linkNPC = NPC_1;
        this.dp2.linkNPC = NPC_2;
        this.NPC_1 = NPC_1;
        this.NPC_2 = NPC_2;
        var task_0 = new Task("000", "对话任务", new NPCTalkTaskCondition(), 0);
        task_0.fromNpcId = "NPC_1";
        task_0.toNpcId = "NPC_2";
        task_0.desc = "救援伤残纯形几何体";
        task_0.NPCTaskTalk = "纯形的未来由你来守护！";
        task_0.total = 1;
        task_0.status = TaskStatus.ACCEPTABLE;
        var task_1 = new Task("001", "战斗任务", new KillMonsterTaskCondition(), 1);
        task_1.fromNpcId = "NPC_2";
        task_1.toNpcId = "NPC_2";
        task_1.desc = "寻访下方的几何体";
        task_1.NPCTaskTalk = "哈哈哈哈哈，放荡不羁";
        task_1.total = 1;
        task_1.status = TaskStatus.UNACCEPTABLE;
        TaskService.getInstance().addTask(task_0);
        TaskService.getInstance().addTask(task_1);
        var mainPanel = new TaskPanel(50, 850);
        this.taskPanel = mainPanel;
        TaskService.getInstance().addObserver(mainPanel);
        TaskService.getInstance().addObserver(NPC_1);
        TaskService.getInstance().addObserver(NPC_2);
        TaskService.getInstance().notify(TaskService.getInstance().getTaskByCustomRule());
        this.dp1.updateViewByTask(TaskService.getInstance().getTaskByCustomRule());
        this.dp2.updateViewByTask(TaskService.getInstance().getTaskByCustomRule());
        // var monster_1: MockKillMonsterButton = new MockKillMonsterButton("engine_icon_png", "001");
        // this.addChild(monster_1);
        // monster_1.body.x = 350;
        // monster_1.body.y = 600;
        this.item = new Item("五角星型残骸", "star_png", 5, TileMap.TILE_SIZE * 10, TileMap.TILE_SIZE * 1);
        var player = new Player(this.ad);
        GameScene.getCurrentScene().player = player;
        var map = new TileMap(GameScene.getCurrentScene().player);
        this.map = map;
        GameScene.getCurrentScene().stage.addChild(map);
        GameScene.getCurrentScene().stage.addChild(GameScene.getCurrentScene().player);
        GameScene.getCurrentScene().player.idle();
        var monster_1 = new Monster("buguize_2_png", "003");
        SceneService.getInstance().addObserver(monster_1);
        SceneService.getInstance().addObserver(task_1.condition);
        monster_1.x = TileMap.TILE_SIZE * randomnum(4, 2);
        monster_1.y = TileMap.TILE_SIZE * 10;
        GameScene.getCurrentScene().stage.addChild(monster_1);
        this.map.replaceMap(monster_1);
        var monster_2 = new Monster("buguize_2_png", "003");
        SceneService.getInstance().addObserver(monster_2);
        monster_2.x = TileMap.TILE_SIZE * 6;
        monster_2.y = TileMap.TILE_SIZE * 9;
        GameScene.getCurrentScene().stage.addChild(monster_2);
        this.map.replaceMap(monster_2);
        var monster_3 = new Monster("buguize_2_png", "003");
        SceneService.getInstance().addObserver(monster_3);
        monster_3.x = TileMap.TILE_SIZE * 5;
        monster_3.y = TileMap.TILE_SIZE * 13;
        GameScene.getCurrentScene().stage.addChild(monster_3);
        this.map.replaceMap(monster_3);
        GameScene.getCurrentScene().stage.addChild(NPC_1);
        GameScene.getCurrentScene().stage.addChild(NPC_2);
        GameScene.getCurrentScene().stage.addChild(this.dp1);
        GameScene.getCurrentScene().stage.addChild(this.dp2);
        GameScene.getCurrentScene().stage.addChild(this.item);
        GameScene.getCurrentScene().stage.addChild(mainPanel);
        setTimeout(function () {
            if (task_1.status == TaskStatus.SUBMITED) {
                GameScene.getCurrentScene().stage.removeAll();
                UIScene.getCurrentScene().gamebadend();
            }
        }, this, 2000);
    };
    UIScene.prototype.gameContinue = function () {
        var stageW = 640;
        var stageH = 1136;
        var BlackMask = new engine.Shape();
        BlackMask.graphics.beginFill("#000000", 1);
        BlackMask.graphics.drawRect(0, 0, stageW, stageH);
        BlackMask.graphics.endFill();
        BlackMask.graphics.width = stageW;
        BlackMask.graphics.height = stageH;
        GameScene.getCurrentScene().stage.addChild(BlackMask);
        var equipmentButtun = new engine.TextField();
        equipmentButtun.text = "状态";
        equipmentButtun.size = '40';
        equipmentButtun.x = 280;
        equipmentButtun.y = 1000;
        GameScene.getCurrentScene().stage.addChild(equipmentButtun);
        equipmentButtun.touchEnabled = true;
        equipmentButtun.addEventListener(engine.TouchEvent.TOUCH_TAP, function (e) {
            if (PropertyPanel.flag == 0) {
                console.log(PropertyPanel.flag);
                var pp = new PropertyPanel(UIScene.getCurrentScene().hero);
                GameScene.getCurrentScene().stage.addChild(pp);
            }
        });
        GameScene.getCurrentScene().stage.addChild(this.map);
        GameScene.getCurrentScene().stage.addChild(GameScene.getCurrentScene().player);
        GameScene.getCurrentScene().player.idle();
        GameScene.getCurrentScene().stage.addChild(this.taskPanel);
        GameScene.getCurrentScene().stage.addChild(this.NPC_1);
        GameScene.getCurrentScene().stage.addChild(this.NPC_2);
        GameScene.getCurrentScene().stage.addChild(this.dp1);
        GameScene.getCurrentScene().stage.addChild(this.dp2);
        //GameScene.getCurrentScene().main.addChild(this.item);
    };
    UIScene.prototype.gamebadend = function () {
        var no = new engine.Bitmap();
        no.src = "End_jpg";
        no.width = 640;
        no.height = 1134;
        GameScene.getCurrentScene().stage.addChild(no);
        var back = new engine.TextField();
        back.text = "返回主菜单";
        back.size = '30';
        back.touchEnabled = true;
        back.y = 900;
        back.x = 250;
        GameScene.getCurrentScene().stage.addChild(back);
        back.addEventListener(engine.TouchEvent.TOUCH_TAP, function (e) {
            GameScene.getCurrentScene().stage.removeAll();
            UIScene.getCurrentScene().gameMenu();
        });
    };
    UIScene.prototype.gamehappyend = function () {
        var blackback = new engine.Shape();
        blackback.graphics.beginFill("#000000", 1);
        blackback.graphics.drawRect(0, 0, 640, 1134);
        blackback.graphics.endFill();
        blackback.graphics.width = 640;
        blackback.graphics.height = 1134;
        GameScene.getCurrentScene().stage.addChild(blackback);
        var win = new engine.TextField();
        // win.textColor = #ffffff;
        // win.width = 640 - 172;
        // win.textAlign = "center";
        win.text = "纯形战士战胜了不规则几何体，但战斗仍将继续！";
        win.size = '50';
        win.font = '黑体';
        win.x = 100;
        win.y = 300;
        GameScene.getCurrentScene().stage.addChild(win);
        var back = new engine.TextField();
        back.text = "返回主菜单";
        back.size = '30';
        back.touchEnabled = true;
        back.y = 900;
        back.x = 250;
        GameScene.getCurrentScene().stage.addChild(back);
        back.addEventListener(engine.TouchEvent.TOUCH_TAP, function (e) {
            GameScene.getCurrentScene().stage.removeAll();
            UIScene.getCurrentScene().gameMenu();
        });
        var bcontinue = new engine.TextField();
        bcontinue.text = "继续游戏";
        bcontinue.size = '30';
        bcontinue.touchEnabled = true;
        bcontinue.y = 800;
        bcontinue.x = 250;
        GameScene.getCurrentScene().stage.addChild(bcontinue);
        bcontinue.addEventListener(engine.TouchEvent.TOUCH_TAP, function (e) {
            GameScene.getCurrentScene().stage.removeAll();
            UIScene.getCurrentScene().gameContinue();
        });
    };
    return UIScene;
}());
var Skill = (function (_super) {
    __extends(Skill, _super);
    function Skill(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        for (var i = 0; i < skillconfig.length; i++) {
            var data = skillconfig[i];
        }
        return _this;
        // this.name = name;
        // this.inf = inf;
        // this.ratio = ratio
        // this.MPneed = MPneed;
        // this.distance = distance;
        // this.type = type;
        // this.num = num;
    }
    return Skill;
}(engine.DisplayObjectContainer));
var SkillConstructor = (function (_super) {
    __extends(SkillConstructor, _super);
    function SkillConstructor(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        var bitmap = new engine.Bitmap();
        bitmap.src = data.image;
        bitmap.width = 128;
        bitmap.height = 128;
        _this.addChild(bitmap);
        _this.x = data.x;
        _this.y = data.y;
        var tfname = new engine.TextField();
        tfname.text = data.name;
        _this.addChild(tfname);
        bitmap.touchEnabled = true;
        bitmap.addEventListener(engine.TouchEvent.TOUCH_TAP, function (e) {
        });
        bitmap.addEventListener(engine.TouchEvent.TOUCH_BEGIN, function (e) {
        });
        return _this;
    }
    SkillConstructor.prototype.showSkillsInformation = function () {
    };
    return SkillConstructor;
}(engine.DisplayObjectContainer));
var SkillType;
(function (SkillType) {
    SkillType[SkillType["hurt"] = 0] = "hurt";
    SkillType[SkillType["speedbuff"] = 1] = "speedbuff";
    SkillType[SkillType["atkbuff"] = 2] = "atkbuff";
    SkillType[SkillType["HPbuff"] = 3] = "HPbuff";
    SkillType[SkillType["move"] = 4] = "move";
    SkillType[SkillType["roll"] = 5] = "roll";
    SkillType[SkillType["jump"] = 6] = "jump"; //跳跃
})(SkillType || (SkillType = {}));
var skillconfig = [
    { x: 30, y: 900, name: "射击", image: "Skill_1_png", inf: "普通远程攻击", ratio: 100, MPneed: 5, distance: 2, type: 0, num: 1 },
    { x: 160, y: 900, name: "轰击", image: "Skill_2_png", inf: "聚集锋芒的重型远程攻击", ratio: 350, MPneed: 70, distance: 3, type: 0, num: 1 },
    { x: 290, y: 900, name: "划击", image: "Skill_3_png", inf: "不擅长的近战攻击", ratio: 80, MPneed: 0, distance: 1, type: 0, num: 1 },
    { x: 420, y: 900, name: "尖锐化", image: "Skill_4_png", inf: "三角高速旋转，本回合增加行动次数", ratio: 100, MPneed: 50, distance: 0, type: 1, num: 1 },
    { x: 550, y: 900, name: "三角移动", image: "Skill_5_png", inf: "移动一格并回复10MP", ratio: 0, MPneed: -10, distance: 1, type: 4, num: 1 },
    { x: 30, y: 900, name: "棱刮", image: "", inf: "普通近战攻击", ratio: 100, MPneed: 0, distance: 1, type: 0, num: 2 },
    { x: 160, y: 900, name: "格式打击", image: "", inf: "猛扑对敌人造成重创", ratio: 250, MPneed: 50, distance: 1, type: 0, num: 2 },
    { x: 290, y: 900, name: "空格", image: "", inf: "向所指方向跳跃一格并撞击敌人", ratio: 125, MPneed: 30, distance: 2, type: 6, num: 2 },
    { x: 420, y: 900, name: "栅格化", image: "", inf: "方块变得更方了，本次战斗中永久提升攻击力", ratio: 150, MPneed: 5, distance: 2, type: 2, num: 2 },
    { x: 550, y: 900, name: "方块移动", image: "", inf: "上下左右一格的范围", ratio: 0, MPneed: 0, distance: 1, type: 4, num: 2 },
    { x: 30, y: 900, name: "碾压", image: "", inf: "普通攻击，命中后回复8MP", ratio: 125, MPneed: -8, distance: 1, type: 0, num: 3 },
    { x: 160, y: 900, name: "飞盘", image: "", inf: "正圆自身的投影攻击远程攻击，命中后回复5MP", ratio: 100, MPneed: -5, distance: 2, type: 0, num: 3 },
    { x: 290, y: 900, name: "翻滚", image: "", inf: "直线大幅度移动，回复2MP", ratio: 0, MPneed: -2, distance: 5, type: 5, num: 3 },
    { x: 420, y: 900, name: "圆滑化", image: "", inf: "正圆变得更加圆润光滑，按当前比例增长HP", ratio: 150, MPneed: 100, distance: 2, type: 3, num: 3 },
    { x: 550, y: 900, name: "正圆移动", image: "", inf: "上下左右一格的范围", ratio: 0, MPneed: 0, distance: 1, type: 4, num: 3 },
    { x: 30, y: 900, name: "不规则攻击", image: "", inf: "杂鱼也能打败纯形英雄", ratio: 100, MPneed: 0, distance: 3, type: 0, num: 4 },
    { x: 160, y: 900, name: "不规则移动", image: "", inf: "上下左右一格的范围", ratio: 0, MPneed: 0, distance: 1, type: 4, num: 4 },
];
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(name, ad, atk, x, y) {
        var _this = _super.call(this) || this;
        _this._body = new engine.Bitmap();
        _this._body.src = ad;
        _this._body.width = TileMap.TILE_SIZE;
        _this._body.height = TileMap.TILE_SIZE;
        _this.name = name;
        _this.ad = ad;
        _this.atk = atk;
        _this.x = x;
        _this.y = y;
        _this.addChild(_this._body);
        _this.touchEnabled = true;
        _this.addEventListener(engine.TouchEvent.TOUCH_TAP, function (e) {
            _this.onItemClick();
        });
        return _this;
    }
    Item.prototype.onChange = function () {
    };
    Item.prototype.onItemClick = function () {
        if (SceneService.getInstance().list, length != 0) {
            SceneService.getInstance().list.cancel();
        }
        SceneService.getInstance().list.addCommand(new WalkCommand(Math.floor(this.x / TileMap.TILE_SIZE), Math.floor(this.y / TileMap.TILE_SIZE)));
        SceneService.getInstance().list.addCommand(new EquipCommand(this.name, this.ad, this.atk));
        SceneService.getInstance().list.execute();
    };
    return Item;
}(engine.DisplayObjectContainer));
var NPC = (function (_super) {
    __extends(NPC, _super);
    //public NPCTalk:string;
    // public task:Task;
    function NPC(id, ad, x, y, dia) {
        var _this = _super.call(this) || this;
        _this.fighted = false;
        _this.dialoguePanel = dia;
        _this._body = new engine.Bitmap();
        _this._emoji = new engine.Bitmap();
        _this._body.src = ad;
        _this._emoji.src = "notice_png";
        _this._id = id;
        _this.x = x;
        _this.y = y;
        _this._body.width = _this._body.width / 2;
        _this._body.height = _this._body.height / 2;
        _this._emoji.width = 70;
        _this._emoji.height = 70;
        _this._emoji.y = -60;
        _this._emoji.x = -5;
        _this._emoji.alpha = 0;
        _this.addChild(_this._body);
        _this.addChild(_this._emoji);
        _this.touchEnabled = true;
        _this.addEventListener(engine.TouchEvent.TOUCH_BEGIN, _this.onNPCClick);
        return _this;
    }
    NPC.prototype.onChange = function (task) {
        if (task.status == TaskStatus.ACCEPTABLE && this._id == task.fromNpcId) {
            this._emoji.src = "notice_png";
            this._emoji.alpha = 1;
        }
        if (task.status == TaskStatus.DURING && this._id == task.fromNpcId) {
            this._emoji.alpha = 0;
        }
        if (task.status == TaskStatus.DURING && this._id == task.toNpcId) {
            this._emoji.src = "question_png";
            this._emoji.alpha = 1;
        }
        if (task.status == TaskStatus.CAN_SUBMIT && this._id == task.fromNpcId) {
            this._emoji.src = "question_png";
            this._emoji.alpha = 0;
        }
        if (task.status == TaskStatus.CAN_SUBMIT && this._id == task.toNpcId) {
            this._emoji.src = "question_png";
            this._emoji.alpha = 1;
        }
        if (task.status == TaskStatus.SUBMITED && this._id == task.toNpcId) {
            this._emoji.alpha = 0;
        }
    };
    NPC.prototype.onNPCClick = function (e) {
        TaskService.getInstance().accept();
        if (SceneService.getInstance().list, length != 0) {
            SceneService.getInstance().list.cancel();
        }
        SceneService.getInstance().list.addCommand(new WalkCommand(Math.floor(this.x / TileMap.TILE_SIZE), Math.floor(this.y / TileMap.TILE_SIZE)));
        SceneService.getInstance().list.addCommand(new TalkCommand(this._id));
        SceneService.getInstance().list.execute();
    };
    return NPC;
}(engine.DisplayObjectContainer));
var TaskPanel = (function (_super) {
    __extends(TaskPanel, _super);
    //task:Task
    function TaskPanel(x, y) {
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.y = y;
        _this.body = new engine.Shape();
        _this.body.graphics.beginFill("#000000", 0.4);
        _this.body.graphics.drawRect(0, 0, 600, 100);
        _this.body.graphics.endFill();
        _this.textField = new engine.TextField();
        _this.textField.text = "   任务进程    ";
        _this.textField.x = 0;
        _this.textField.x = 0;
        _this.textField2 = new engine.TextField();
        _this.textField2.text = "  任务状态    ";
        _this.textField2.x = 0;
        _this.textField2.y = 30;
        _this.textField3 = new engine.TextField();
        _this.textField2.text = "      ";
        _this.textField3.x = 0;
        _this.textField3.y = 55;
        _this.addChild(_this.body);
        _this.addChild(_this.textField);
        _this.addChild(_this.textField2);
        _this.addChild(_this.textField3);
        return _this;
    }
    TaskPanel.prototype.onChange = function (task) {
        console.log(task);
        this.textField.text = task.desc;
        var tf;
        switch (task.status) {
            case 0:
                tf = "未可接受";
                break;
            case 1:
                tf = "可接受";
                break;
            case 2:
                tf = "进行中";
                break;
            case 3:
                tf = "可完成";
                break;
            case 4:
                tf = "已完成";
                break;
        }
        this.textField2.text = task.name + " :" + tf;
        if (task.type == TaskType.Kill) {
            this.textField3.text = task.name + " :" + task.getcurrent() + "/" + task.total;
        }
    };
    return TaskPanel;
}(engine.DisplayObjectContainer));
var DialoguePanel = (function (_super) {
    __extends(DialoguePanel, _super);
    function DialoguePanel(talk) {
        var _this = _super.call(this) || this;
        _this.body = new engine.Shape();
        _this.body.graphics.beginFill("#000000", 0.7);
        _this.body.graphics.drawRect(0, 0, 600, 172);
        _this.body.graphics.endFill();
        _this.body.y = 450;
        _this.textField = new engine.TextField();
        _this.textField.text = talk;
        _this.button = new Button("close_png");
        _this.textField.x = 80;
        _this.textField.y = 500;
        _this.button.body.width = 40;
        _this.button.body.height = 40;
        _this.button.x = 500;
        _this.button.y = 550;
        _this.button.touchEnabled = true;
        _this.body.touchEnabled = true;
        _this.button.addEventListener(engine.TouchEvent.TOUCH_TAP, _this.onButtonClick);
        return _this;
    }
    DialoguePanel.prototype.showDpanel = function () {
        this.addChild(this.body);
        this.addChild(this.button);
        this.addChild(this.textField);
    };
    DialoguePanel.prototype.updateViewByTask = function (task) {
        this.currentTask = task;
        if (this.currentTask.id == "001" && this.linkNPC._id == "NPC_2") {
            this.textField.text = "变得不规则挺好的，哈哈哈，来跳舞吧！";
        }
        if (this.currentTask.status == TaskStatus.CAN_SUBMIT && this.currentTask.status == 4) {
            this.textField.text = this.currentTask.NPCTaskTalk;
        }
    };
    DialoguePanel.prototype.disshowDpanel = function () {
        this.removeChild(this.body);
        this.removeChild(this.button);
        this.removeChild(this.textField);
    };
    DialoguePanel.prototype.onButtonClick = function (e) {
        this.disshowDpanel();
        switch (this.currentTask.status) {
            case TaskStatus.ACCEPTABLE:
                TaskService.getInstance().accept(this.currentTask.id);
                // if (this.currentTask.id == "000") {
                //     TaskService.getInstance().finish(this.currentTask.id);
                //     if (TaskService.getInstance().getNextTask() != null) {
                //         TaskService.getInstance().getNextTask().status = TaskStatus.ACCEPTABLE;
                //         TaskService.getInstance().notify(TaskService.getInstance().getNextTask());
                //     }
                //     if (TaskService.getInstance().getTaskByCustomRule() != null) {
                //         this.updateViewByTask(TaskService.getInstance().getTaskByCustomRule());
                //         TaskService.getInstance().notify(TaskService.getInstance().getTaskByCustomRule());
                //     }
                // }
                break;
            case TaskStatus.CAN_SUBMIT:
                TaskService.getInstance().finish(this.currentTask.id);
                if (TaskService.getInstance().getNextTask() != null) {
                    TaskService.getInstance().getNextTask().status = TaskStatus.ACCEPTABLE;
                }
                if (TaskService.getInstance().getTaskByCustomRule() != null) {
                    console.log(TaskService.getInstance().getTaskByCustomRule());
                    this.updateViewByTask(TaskService.getInstance().getTaskByCustomRule());
                    TaskService.getInstance().notify(TaskService.getInstance().getTaskByCustomRule());
                }
                break;
            default:
                break;
        }
        if (this.linkNPC._id == "NPC_2" && this.linkNPC.fighted == false) {
            if (SceneService.getInstance().list, length != 0) {
                SceneService.getInstance().list.cancel();
            }
            SceneService.getInstance().list.addCommand(new FightCommand("npc_2_png"));
            SceneService.getInstance().list.execute();
        }
        else {
            this.textField.text = "我投降";
        }
    };
    return DialoguePanel;
}(engine.DisplayObjectContainer));
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster(ad, linkTask) {
        var _this = _super.call(this) || this;
        _this.count = 0;
        _this.ad = ad;
        _this.body = new engine.Bitmap();
        _this.body.src = ad;
        _this.body.width = TileMap.TILE_SIZE;
        _this.body.height = TileMap.TILE_SIZE;
        _this.linkTask = linkTask;
        _this.touchEnabled = true;
        _this.addEventListener(engine.TouchEvent.TOUCH_BEGIN, _this.onButtonClick);
        _this.addChild(_this.body);
        engine.Ticker.getInstance().register(function () {
            if (_this.count < 5) {
                _this.body.scaleY *= 1.01;
            }
            else if (_this.count < 10 || _this.count >= 5) {
                _this.body.scaleY /= 1.01;
            }
            _this.count += 0.5;
            if (_this.count >= 10) {
                _this.count = 0;
            }
        });
        return _this;
    }
    Monster.prototype.onButtonClick = function (e) {
        if (SceneService.getInstance().list, length != 0) {
            SceneService.getInstance().list.cancel();
        }
        SceneService.getInstance().list.addCommand(new WalkCommand(Math.floor(this.x / TileMap.TILE_SIZE), Math.floor(this.y / TileMap.TILE_SIZE)));
        SceneService.getInstance().list.addCommand(new FightCommand(this.ad));
        SceneService.getInstance().list.execute();
    };
    Monster.prototype.onChange = function () {
        if (this.linkTask != null) {
            var task = TaskService.getInstance().taskList[this.linkTask];
            if (!task) {
                console.error('missing task:', this.linkTask);
            }
            if (task.status == TaskStatus.DURING) {
                SceneService.getInstance().notify(TaskService.getInstance().taskList[this.linkTask]);
            }
        }
    };
    return Monster;
}(engine.DisplayObjectContainer));
var Task = (function () {
    function Task(id, name, condition, type) {
        this._current = 0;
        this._id = id;
        this._name = name;
        this._condition = condition;
        this.type = type;
    }
    Task.prototype.checkStatus = function () {
        if (this._status == TaskStatus.DURING &&
            this._current >= this.total) {
            this._status = TaskStatus.CAN_SUBMIT;
        }
        TaskService.getInstance().notify(this);
    };
    Object.defineProperty(Task.prototype, "condition", {
        get: function () {
            return this._condition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (value) {
            this._status = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    Task.prototype.getcurrent = function () {
        return this._current;
    };
    Task.prototype.setcurrent = function (current) {
        this._current = current;
        this.checkStatus();
    };
    Task.prototype.onAccept = function () {
        this._condition.onAccept(this);
    };
    return Task;
}());
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["UNACCEPTABLE"] = 0] = "UNACCEPTABLE";
    TaskStatus[TaskStatus["ACCEPTABLE"] = 1] = "ACCEPTABLE";
    TaskStatus[TaskStatus["DURING"] = 2] = "DURING";
    TaskStatus[TaskStatus["CAN_SUBMIT"] = 3] = "CAN_SUBMIT";
    TaskStatus[TaskStatus["SUBMITED"] = 4] = "SUBMITED";
})(TaskStatus || (TaskStatus = {}));
var TaskType;
(function (TaskType) {
    TaskType[TaskType["Talk"] = 0] = "Talk";
    TaskType[TaskType["Kill"] = 1] = "Kill";
})(TaskType || (TaskType = {}));
var KillMonsterTaskCondition = (function () {
    function KillMonsterTaskCondition() {
    }
    KillMonsterTaskCondition.prototype.onAccept = function (task) {
        task.setcurrent(task.getcurrent());
    };
    KillMonsterTaskCondition.prototype.onSubmit = function (task) {
    };
    KillMonsterTaskCondition.prototype.onChange = function (task) {
        var temp = task.getcurrent();
        temp++;
        task.setcurrent(temp);
    };
    return KillMonsterTaskCondition;
}());
var NPCTalkTaskCondition = (function () {
    function NPCTalkTaskCondition() {
    }
    NPCTalkTaskCondition.prototype.onAccept = function (task) {
        //task.current++;
        // var temp = 0;
        // temp = task.getcurrent();
        task.setcurrent(1);
    };
    NPCTalkTaskCondition.prototype.onSubmit = function (task) {
    };
    NPCTalkTaskCondition.prototype.onChange = function (task) {
    };
    return NPCTalkTaskCondition;
}());
var TaskService = (function () {
    function TaskService() {
        this.taskList = {};
        this.observerList = [];
        TaskService.count++;
        if (TaskService.count > 1) {
            throw "singleton!!!";
        }
    }
    TaskService.getInstance = function () {
        if (TaskService.instance == null) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    };
    TaskService.prototype.getTaskByCustomRule = function () {
        for (var id in this.taskList) {
            var task = this.taskList[id];
            if (task.status == TaskStatus.CAN_SUBMIT)
                return task;
        }
        for (var id in this.taskList) {
            var task = this.taskList[id];
            if (task.status == TaskStatus.ACCEPTABLE)
                return task;
        }
    };
    TaskService.prototype.getNextTask = function () {
        for (var id in this.taskList) {
            var task = this.taskList[id];
            if (task.status == TaskStatus.UNACCEPTABLE)
                return task;
        }
    };
    TaskService.prototype.accept = function (id) {
        if (!id) {
            return ErrorCode.MISSING_TASK;
        }
        var task = this.taskList[id];
        if (task.id == id) {
            task.status = TaskStatus.DURING;
            task.onAccept();
            console.log("任务状态" + task.status);
            this.notify(this.taskList[id]);
            return ErrorCode.SUCCESS;
        }
        else {
            return ErrorCode.MISSING_TASK;
        }
    };
    TaskService.prototype.finish = function (id) {
        if (!id) {
            return ErrorCode.MISSING_TASK;
        }
        var task = this.taskList[id];
        if (task.id == id) {
            console.log("finish");
            task.status = TaskStatus.SUBMITED;
            this.notify(this.taskList[id]);
            return ErrorCode.SUCCESS;
        }
        else {
            return ErrorCode.MISSING_TASK;
        }
    };
    TaskService.prototype.notify = function (task) {
        // console.log("111");
        for (var _i = 0, _a = this.observerList; _i < _a.length; _i++) {
            var observer = _a[_i];
            observer.onChange(task);
        }
    };
    TaskService.prototype.addTask = function (task) {
        this.taskList[task.id] = task;
    };
    TaskService.prototype.addObserver = function (observer) {
        for (var i = 0; i < this.observerList.length; i++) {
            if (observer == this.observerList[i])
                return ErrorCode.REPEAT_OBSERVER;
        }
        this.observerList.push(observer);
    };
    return TaskService;
}());
TaskService.count = 0;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["SUCCESS"] = 0] = "SUCCESS";
    ErrorCode[ErrorCode["MISSING_TASK"] = 1] = "MISSING_TASK";
    ErrorCode[ErrorCode["REPEAT_OBSERVER"] = 2] = "REPEAT_OBSERVER";
})(ErrorCode || (ErrorCode = {}));
var BlockType;
(function (BlockType) {
    BlockType[BlockType["notmove"] = 0] = "notmove";
    BlockType[BlockType["upmove"] = 1] = "upmove";
    BlockType[BlockType["downmove"] = 2] = "downmove";
    BlockType[BlockType["leftmove"] = 3] = "leftmove";
    BlockType[BlockType["rightmove"] = 4] = "rightmove";
    BlockType[BlockType["uproll"] = 5] = "uproll";
    BlockType[BlockType["downroll"] = 6] = "downroll";
    BlockType[BlockType["leftroll"] = 7] = "leftroll";
    BlockType[BlockType["rightroll"] = 8] = "rightroll";
    BlockType[BlockType["upjump"] = 9] = "upjump";
    BlockType[BlockType["downjump"] = 10] = "downjump";
    BlockType[BlockType["leftjump"] = 11] = "leftjump";
    BlockType[BlockType["rightjump"] = 12] = "rightjump";
})(BlockType || (BlockType = {}));
var Battle = (function (_super) {
    __extends(Battle, _super);
    function Battle(hero, level, enemyad, x, y) {
        var _this = _super.call(this) || this;
        _this.heropos = new Pos(0, 5);
        _this.enemypos = new Pos(5, 0);
        _this.battleinfo = new engine.TextField();
        _this.heroSkills = [];
        _this.heroSkillsinfo = [];
        _this._block = [];
        _this._blockType = [];
        _this._herobody = new engine.Bitmap();
        _this._heroHP = new engine.TextField();
        _this._heroMP = new engine.TextField();
        _this._enemybody = new engine.Bitmap();
        _this._enemyHP = new engine.TextField();
        _this._enemyMP = new engine.TextField();
        //timer:engine.Timer;
        _this.timerbar = new engine.TextField();
        _this.chance = 0; //该回合行动次数
        var BattleMask = new engine.Shape();
        BattleMask.graphics.beginFill("#000000", 1);
        BattleMask.graphics.drawRect(0, 0, 640, 1136);
        BattleMask.graphics.endFill();
        BattleMask.graphics.width = 640;
        BattleMask.graphics.height = 1136;
        _this.addChild(BattleMask);
        _this.hero = hero;
        _this.enemy = setEnemy(level, enemyad);
        _this._enemybody.src = _this.enemy.bodyad;
        _this.battleinfo.text = "战斗信息";
        _this.battleinfo.size = "20";
        _this.addChild(_this.battleinfo);
        _this.battleinfo.x = 100;
        _this.battleinfo.y = 740;
        switch (hero.name) {
            case "三角":
                _this._herobody.src = "sanjiao_png";
                _this._herobodyad = "sanjiao_png";
                break;
            case "方块":
                _this._herobody.src = "fangkuai_png";
                _this._herobodyad = "fangkuai_png";
                break;
            case "正圆":
                _this._herobody.src = "zhengyuan_png";
                _this._herobodyad = "zhengyuan_png";
                break;
        }
        _this._numCols = x;
        _this._numRows = y;
        for (var i = 0; i < _this._numCols; i++) {
            _this._block[i] = new Array();
            _this._blockType[i] = new Array();
            for (var j = 0; j < _this._numRows; j++) {
                var block = new engine.Bitmap();
                block['i'] = i;
                block['j'] = j;
                _this._block[i][j] = block;
                _this._block[i][j].width = TileMap.TILE_BATTLE_SIZE;
                _this._block[i][j].height = TileMap.TILE_BATTLE_SIZE;
                _this._block[i][j].src = "block2_png";
                _this._block[i][j].x = i * TileMap.TILE_BATTLE_SIZE + 80;
                _this._block[i][j].y = j * TileMap.TILE_BATTLE_SIZE + 240;
                _this.addChild(_this._block[i][j]);
                _this._block[i][j].touchEnabled = true;
                _this._blockType[i][j] = BlockType.notmove;
                _this._block[i][j].addEventListener(engine.TouchEvent.TOUCH_TAP, function (e) {
                    // console.log(e.target);
                    // console.log(e.target.i, e.target.j);
                    var target = e.target;
                    _this.heroTouchMove(target['i'], target['j']);
                });
            }
        }
        for (i = 0; i < 5; i++) {
            _this.heroSkills[i] = new engine.Bitmap();
        }
        for (i = 0; i < 5; i++) {
            _this.heroSkillsinfo[i] = new engine.TextField();
        }
        _this.upDateBattelMap();
        _this.showSkills();
        _this.showALLState();
        //console.log(this.hero);
        _this.updateALLState();
        _this.heroTurn();
        return _this;
    }
    Battle.prototype.heroTurn = function () {
        var _this = this;
        this.chance = 2;
        this.heroSkills[0].touchEnabled = true;
        this.heroSkills[1].touchEnabled = true;
        this.heroSkills[2].touchEnabled = true;
        this.heroSkills[3].touchEnabled = true;
        this.heroSkills[4].touchEnabled = true;
        //engine.setInterval(()=>{this.randommove(this.heropos)},this,2000);
        //engine.setInterval(() => { this.enemyturn() }, this, 3000);
        this.heroSkills[0].addEventListener(engine.TouchEvent.TOUCH_TAP, function () { _this.heroAttack(_this.hero.skills[0]); });
        this.heroSkills[1].addEventListener(engine.TouchEvent.TOUCH_TAP, function () { _this.heroAttack(_this.hero.skills[1]); });
        this.heroSkills[2].addEventListener(engine.TouchEvent.TOUCH_TAP, function () { _this.heroSpecial(_this.hero.skills[2]); });
        this.heroSkills[3].addEventListener(engine.TouchEvent.TOUCH_TAP, function () { _this.heroBuff(_this.hero.skills[3]); });
        this.heroSkills[4].addEventListener(engine.TouchEvent.TOUCH_TAP, this.heroMove);
        this.heroTurnEnd();
    };
    Battle.prototype.heroTurnEnd = function () {
        var _this = this;
        var turn = setInterval(function () {
            if (_this.chance = 0) {
                _this.heroSkills[0].touchEnabled = false;
                _this.heroSkills[1].touchEnabled = false;
                _this.heroSkills[2].touchEnabled = false;
                _this.heroSkills[3].touchEnabled = false;
                _this.heroSkills[4].touchEnabled = false;
            }
            if (_this.judgeEnemyDeath() == true || _this.judgeHeroDeath() == true) {
                console.log("结束战斗");
                clearInterval(turn);
            }
            else {
                _this.enemyTurn();
            }
        }, this, 1000);
    };
    Battle.prototype.upDateBattelMap = function () {
        for (var i = 0; i < this._numCols; i++) {
            for (var j = 0; j < this._numRows; j++) {
                var block = this._block[i][j];
                var type = this._blockType[i][j];
                var config_1 = (_a = {},
                    _a[BlockType.notmove] = "block_0_png",
                    _a[BlockType.upmove] = "block_1_png",
                    _a[BlockType.notmove] = "block_3_png",
                    _a[BlockType.notmove] = "block2_png",
                    _a[BlockType.notmove] = "block2_png",
                    _a[BlockType.notmove] = "block2_png",
                    _a[BlockType.notmove] = "block2_png",
                    _a[BlockType.notmove] = "block2_png",
                    _a);
                //约定优于配置
                var srcName = 'block_' + type + '_png';
                // let srcName = config[type];
                // block.src = srcName);
                switch (type) {
                    case BlockType.notmove:
                        block.src = "block2_png";
                        break;
                    case BlockType.upmove:
                        block.src = "up_png";
                        break;
                    case BlockType.downmove:
                        block.src = "down_png";
                        break;
                    case BlockType.leftmove:
                        block.src = "left_png";
                        break;
                    case BlockType.rightmove:
                        block.src = "right_png";
                        break;
                    case BlockType.uproll:
                        block.src = "up_png";
                        break;
                    case BlockType.downroll:
                        block.src = "down_png";
                        break;
                    case BlockType.leftroll:
                        block.src = "left_png";
                        break;
                    case BlockType.rightroll:
                        block.src = "right_png";
                        break;
                    case BlockType.upjump:
                        block.src = "up_png";
                        break;
                    case BlockType.downjump:
                        block.src = "down_png";
                        break;
                    case BlockType.leftjump:
                        block.src = "left_png";
                        break;
                    case BlockType.rightjump:
                        block.src = "right_png";
                        break;
                }
            }
        }
        for (var i = 0; i < this._numCols; i++) {
            for (var j = 0; j < this._numRows; j++) {
                if (i == this.enemypos.x && j == this.enemypos.y) {
                    this._block[i][j].src = this.enemy.bodyad;
                }
                if (i == this.heropos.x && j == this.heropos.y) {
                    this._block[i][j].src = this._herobodyad;
                }
            }
        }
        var _a;
    };
    Battle.prototype.showSkills = function () {
        for (var i = 0; i < 5; i++) {
            this.heroSkills[i].src = this.hero.skills[i].image;
            this.heroSkills[i].x = this.hero.skills[i].x - 40;
            this.heroSkills[i].y = this.hero.skills[i].y;
            this.addChild(this.heroSkills[i]);
            this.heroSkillsinfo[i].text = this.hero.skills[i].name + "\n" + this.hero.skills[i].inf + "\nMP消耗：" + this.hero.skills[i].MPneed;
            this.heroSkillsinfo[i].size = "18";
            this.heroSkillsinfo[i].x = this.hero.skills[i].x - 28;
            this.heroSkillsinfo[i].y = this.hero.skills[i].y + 20;
            this.addChild(this.heroSkillsinfo[i]);
        }
    };
    Battle.prototype.showALLState = function () {
        this._herobody.x = 20;
        this._herobody.y = 800;
        this._herobody.width = 150;
        this._herobody.height = 150;
        this._heroHP.text = "HP:";
        this._heroMP.text = "MP:";
        this.addChild(this.timerbar);
        this.timerbar.x = 200;
        this.timerbar.y = 900;
        this.timerbar.text = "AB:";
        for (var i = 0; i < 25; i++) {
            this._heroHP.text += "|";
            this._heroMP.text += "-";
            this.timerbar.text += "-";
        }
        this._heroHP.x = 200;
        this._heroHP.y = 800;
        this._heroMP.x = 200;
        this._heroMP.y = 840;
        this.addChild(this._herobody);
        this.addChild(this._heroHP);
        this.addChild(this._heroMP);
        this._enemybody.x = 20;
        this._enemybody.y = 80;
        this._enemybody.width = 150;
        this._enemybody.height = 150;
        this._enemyHP.text = "HP:";
        this._enemyMP.text = "MP:";
        for (var i = 0; i < 25; i++) {
            this._enemyHP.text += "|";
            this._enemyMP.text += "-";
        }
        this._enemyHP.x = 200;
        this._enemyHP.y = 80;
        this._enemyMP.x = 200;
        this._enemyMP.y = 120;
        this.addChild(this._enemybody);
        this.addChild(this._enemyHP);
        this.addChild(this._enemyMP);
    };
    Battle.prototype.updateALLState = function () {
        var hptemp, mptemp, abtemp;
        hptemp = Math.floor(this.hero.curHP.value / this.hero._maxHP.value * 25);
        mptemp = Math.floor(this.hero.curMP.value / this.hero._maxMP.value * 25);
        //this._heroHP.textAlign = "justify";
        //this._heroMP.textAlign = "justify";
        // this._heroMP.textAlign = engine.HorizontalAlign.CENTER;
        this._heroHP.text = "HP:" + this.hero.curHP.value + "/" + this.hero._maxHP.value + " ";
        this._heroMP.text = "MP:" + this.hero.curMP.value + "/" + this.hero._maxMP.value + " ";
        ;
        for (var i = 0; i < 25; i++) {
            if (i < hptemp) {
                this._heroHP.text += "|";
            }
            else {
                this._heroHP.text += ".";
            }
        }
        for (var j = 0; j < 25; j++) {
            if (j < mptemp) {
                this._heroMP.text += "-";
            }
            else {
                this._heroMP.text += ".";
            }
        }
        hptemp = Math.floor(this.enemy.curHP.value / this.enemy._maxHP.value * 25);
        mptemp = Math.floor(this.enemy.curMP.value / this.enemy._maxMP.value * 25);
        this._enemyHP.text = "HP:" + this.enemy.curHP.value + "/" + this.enemy._maxHP.value + " ";
        this._enemyMP.text = "MP:" + this.enemy.curMP.value + "/" + this.enemy._maxMP.value + " ";
        for (i = 0; i < 25; i++) {
            if (i < hptemp) {
                this._enemyHP.text += "|";
            }
            else {
                this._enemyHP.text += ".";
            }
        }
        for (j = 0; j < 25; j++) {
            if (j < mptemp) {
                this._enemyMP.text += "-";
            }
            else {
                this._enemyMP.text += ".";
            }
        }
    };
    Battle.prototype.heroTouchMove = function (i, j) {
        switch (this._blockType[i][j]) {
            case BlockType.notmove:
                console.log("not move", i, j);
                break;
            case BlockType.upmove:
                this.heropos.y--;
                if (this.hero.name == "三角") {
                    this.hero.curMP.value += 10;
                    if (this.hero.curMP.value > 100) {
                        this.hero.curMP.value = 100;
                    }
                    this.updateALLState();
                }
                break;
            case BlockType.downmove:
                this.heropos.y++;
                if (this.hero.name == "三角") {
                    this.hero.curMP.value += 10;
                    if (this.hero.curMP.value > 100) {
                        this.hero.curMP.value = 100;
                    }
                    this.updateALLState();
                }
                break;
            case BlockType.rightmove:
                this.heropos.x++;
                if (this.hero.name == "三角") {
                    this.hero.curMP.value += 10;
                    if (this.hero.curMP.value > 100) {
                        this.hero.curMP.value = 100;
                    }
                    this.updateALLState();
                }
                break;
            case BlockType.leftmove:
                this.heropos.x--;
                if (this.hero.name == "三角") {
                    this.hero.curMP.value += 10;
                    if (this.hero.curMP.value > 100) {
                        this.hero.curMP.value = 100;
                    }
                    this.updateALLState();
                }
                break;
            case BlockType.uproll:
                this.heropos.y = 0;
                this.hero.curMP.value -= this.hero.skills[2].MPneed;
                if (this.hero.curMP.value > 100) {
                    this.hero.curMP.value = 100;
                }
                this.updateALLState();
                break;
            case BlockType.downroll:
                this.heropos.y = this._numRows - 1;
                this.hero.curMP.value -= this.hero.skills[2].MPneed;
                if (this.hero.curMP.value > 100) {
                    this.hero.curMP.value = 100;
                }
                this.updateALLState();
                break;
            case BlockType.rightroll:
                this.heropos.x = this._numCols - 1;
                this.hero.curMP.value -= this.hero.skills[2].MPneed;
                if (this.hero.curMP.value > 100) {
                    this.hero.curMP.value = 100;
                }
                this.updateALLState();
                break;
            case BlockType.leftroll:
                this.heropos.x = 0;
                this.hero.curMP.value -= this.hero.skills[2].MPneed;
                if (this.hero.curMP.value > 100) {
                    this.hero.curMP.value = 100;
                }
                this.updateALLState();
                break;
            case BlockType.upjump:
                if (this.heropos.y >= 2) {
                    this.heropos.y -= 2;
                }
                else {
                    this.heropos.y--;
                }
                if (this.hero.curMP.value >= this.hero.skills[2].MPneed) {
                    this.hero.curMP.value -= this.hero.skills[2].MPneed;
                    if (this.hero.curMP.value > 100) {
                        this.hero.curMP.value = 100;
                    }
                    if (this.enemypos.x == this.heropos.x && this.enemypos.y == this.heropos.y) {
                        var temp = 0;
                        temp = this.hero.skills[2].ratio * this.hero._ATK.value / 100 - Math.floor(Math.random() * 5);
                        this.enemy.curHP.value -= temp;
                        this.battleinfo.text = this.hero.name + this.hero.skills[2].name + "对" + this.enemy.name + "造成" + temp + "点伤害";
                        this.chance--;
                    }
                }
                else {
                    this.battleinfo.text = "MP不足或者技能释放范围不够";
                }
                this.updateALLState();
                break;
            case BlockType.downjump:
                if (this.heropos.y <= this._numRows - 1)
                    this.heropos.y += 2;
                else {
                    this.heropos.y++;
                }
                if (this.hero.curMP.value >= this.hero.skills[2].MPneed) {
                    this.hero.curMP.value -= this.hero.skills[2].MPneed;
                    if (this.hero.curMP.value > 100) {
                        this.hero.curMP.value = 100;
                    }
                    if (this.enemypos.x == this.heropos.x && this.enemypos.y == this.heropos.y) {
                        var temp = 0;
                        temp = this.hero.skills[2].ratio * this.hero._ATK.value / 100 - Math.floor(Math.random() * 5);
                        this.enemy.curHP.value -= temp;
                        this.battleinfo.text = this.hero.name + this.hero.skills[2].name + "对" + this.enemy.name + "造成" + temp + "点伤害";
                        this.chance--;
                    }
                }
                else {
                    this.battleinfo.text = "MP不足或者技能释放范围不够";
                }
                this.updateALLState();
                break;
            case BlockType.rightjump:
                if (this.heropos.x <= this._numCols - 1) {
                    this.heropos.x += 2;
                }
                else {
                    this.heropos.x++;
                }
                if (this.hero.curMP.value >= this.hero.skills[2].MPneed) {
                    this.hero.curMP.value -= this.hero.skills[2].MPneed;
                    if (this.hero.curMP.value > 100) {
                        this.hero.curMP.value = 100;
                    }
                    if (this.enemypos.x == this.heropos.x && this.enemypos.y == this.heropos.y) {
                        var temp = 0;
                        temp = this.hero.skills[2].ratio * this.hero._ATK.value / 100 - Math.floor(Math.random() * 5);
                        this.enemy.curHP.value -= temp;
                        this.battleinfo.text = this.hero.name + this.hero.skills[2].name + "对" + this.enemy.name + "造成" + temp + "点伤害";
                        this.chance--;
                    }
                }
                else {
                    this.battleinfo.text = "MP不足或者技能释放范围不够";
                }
                break;
            case BlockType.leftjump:
                if (this.heropos.x >= 2) {
                    this.heropos.x -= 2;
                }
                else {
                    this.heropos.x--;
                }
                if (this.hero.curMP.value >= this.hero.skills[2].MPneed) {
                    this.hero.curMP.value -= this.hero.skills[2].MPneed;
                    if (this.hero.curMP.value > 100) {
                        this.hero.curMP.value = 100;
                    }
                    if (this.enemypos.x == this.heropos.x && this.enemypos.y == this.heropos.y) {
                        var temp = 0;
                        temp = this.hero.skills[2].ratio * this.hero._ATK.value / 100 - Math.floor(Math.random() * 5);
                        this.enemy.curHP.value -= temp;
                        this.battleinfo.text = this.hero.name + this.hero.skills[2].name + "对" + this.enemy.name + "造成" + temp + "点伤害";
                        this.chance--;
                    }
                }
                else {
                    this.battleinfo.text = "MP不足或者技能释放范围不够";
                }
                this.updateALLState();
                break;
        }
        for (var a = 0; a < this._numCols; a++) {
            for (var b = 0; b < this._numRows; b++) {
                this._blockType[a][b] = BlockType.notmove;
            }
        }
        this.upDateBattelMap();
        //this._block[i][j].touchEnabled = false;
    };
    Battle.prototype.heroMove = function () {
        if (this.heropos.x + 1 < this._numCols) {
            this._blockType[this.heropos.x + 1][this.heropos.y] = BlockType.rightmove;
        }
        if (this.heropos.x - 1 >= 0) {
            this._blockType[this.heropos.x - 1][this.heropos.y] = BlockType.leftmove;
        }
        if (this.heropos.y + 1 < this._numRows) {
            this._blockType[this.heropos.x][this.heropos.y + 1] = BlockType.downmove;
        }
        if (this.heropos.y - 1 >= 0) {
            this._blockType[this.heropos.x][this.heropos.y - 1] = BlockType.upmove;
        }
        this.upDateBattelMap();
    };
    Battle.prototype.heroRoll = function () {
        if (this.heropos.x + 1 < this._numCols) {
            this._blockType[this.heropos.x + 1][this.heropos.y] = BlockType.rightroll;
        }
        if (this.heropos.x - 1 >= 0) {
            this._blockType[this.heropos.x - 1][this.heropos.y] = BlockType.leftroll;
        }
        if (this.heropos.y + 1 < this._numRows) {
            this._blockType[this.heropos.x][this.heropos.y + 1] = BlockType.downroll;
        }
        if (this.heropos.y - 1 >= 0) {
            this._blockType[this.heropos.x][this.heropos.y - 1] = BlockType.uproll;
        }
        this.upDateBattelMap();
    };
    Battle.prototype.heroJump = function () {
        if (this.heropos.x + 1 < this._numCols) {
            this._blockType[this.heropos.x + 1][this.heropos.y] = BlockType.rightjump;
        }
        if (this.heropos.x - 1 >= 0) {
            this._blockType[this.heropos.x - 1][this.heropos.y] = BlockType.leftjump;
        }
        if (this.heropos.y + 1 < this._numRows) {
            this._blockType[this.heropos.x][this.heropos.y + 1] = BlockType.downjump;
        }
        if (this.heropos.y - 1 >= 0) {
            this._blockType[this.heropos.x][this.heropos.y - 1] = BlockType.upjump;
        }
        this.upDateBattelMap();
    };
    Battle.prototype.judgeDistance = function (skill) {
        if (Math.abs(this.heropos.x - this.enemypos.x) +
            Math.abs(this.heropos.y - this.enemypos.y)
            <= skill.distance) {
            return true;
        }
        else {
            return false;
        }
    };
    Battle.prototype.judgeHeroDeath = function () {
        if (this.hero.curHP.value <= 0)
            return true;
        else
            return false;
    };
    Battle.prototype.judgeEnemyDeath = function () {
        if (this.enemy.curHP.value <= 0)
            return true;
        else
            return false;
    };
    Battle.prototype.randomMove = function (pos) {
        switch (Math.floor(Math.random() * 100) % 4) {
            case 0:
                if (pos.x + 1 < this._numCols) {
                    pos.x++;
                }
                else {
                    pos.x--;
                }
                break;
            case 1:
                if (pos.y + 1 < this._numCols) {
                    pos.y++;
                }
                else {
                    pos.y--;
                }
                break;
            case 2:
                if (pos.x - 1 >= 0) {
                    pos.x--;
                }
                else {
                    pos.x++;
                }
                break;
            case 3:
                if (pos.y - 1 >= 0) {
                    pos.y--;
                }
                else {
                    pos.y++;
                }
                break;
        }
        this.upDateBattelMap();
    };
    Battle.prototype.heroAttack = function (skill) {
        var temp = 0;
        if (this.judgeDistance(skill) == true && this.hero.curMP.value >= skill.MPneed) {
            temp = Math.floor(skill.ratio * this.hero._ATK.value / 100) - Math.floor(Math.random() * 5);
            this.hero.curMP.value -= skill.MPneed;
            this.enemy.curHP.value -= temp;
            this.battleinfo.text = this.hero.name + skill.name + "对" + this.enemy.name + "造成" + temp + "点伤害";
            this.chance--;
        }
        else {
            this.battleinfo.text = "MP不足或者技能释放范围不够";
        }
        this.updateALLState();
    };
    Battle.prototype.heroBuff = function (skill) {
        if (this.hero.curMP.value >= skill.MPneed) {
            this.chance--;
            this.hero.curMP.value -= skill.MPneed;
            if (this.hero.curMP.value > this.hero._maxMP.value) {
                this.hero.curMP.value = this.hero._maxMP.value;
            }
            switch (skill.type) {
                case SkillType.speedbuff:
                    this.chance += 2;
                    break;
                case SkillType.atkbuff:
                    this.hero._ATK.value = skill.ratio / 100 * this.hero._ATK.value;
                    break;
                case SkillType.HPbuff:
                    this.hero.curHP.value = skill.ratio / 100 * this.hero.curHP.value;
            }
        }
        else {
            this.battleinfo.text = "MP不足";
        }
    };
    Battle.prototype.heroSpecial = function (skill) {
        switch (skill.type) {
            case SkillType.roll:
                this.heroRoll();
                break;
            case SkillType.jump:
                this.heroJump();
                break;
        }
    };
    Battle.prototype.enemyAttack = function () {
        var skill = this.enemy.skills[0];
        var temp = 0;
        if (this.judgeDistance(skill) == true) {
            temp = skill.ratio * this.enemy._ATK.value / 100 - Math.floor(Math.random() * 7);
            this.hero.curHP.value -= temp;
            this.enemy.curMP.value -= skill.MPneed;
            this.battleinfo.text = this.enemy.name + skill.name + "对" + this.hero.name + "造成" + temp + "点伤害";
        }
        this.updateALLState();
    };
    Battle.prototype.enemyTurn = function () {
        var _this = this;
        this.randomMove(this.enemypos);
        setTimeout(function () {
            _this.enemyAttack();
        }, this, 1500);
    };
    Battle.prototype.heroTimer = function () {
        // this.hero.SPD.value;
        // this.timer = new engine.Timer(100, 0);
        // this.timer.addEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
        // this.timer.start();
        // this.stage.addEventListener(engine.TouchEvent.TOUCH_TAP, () => {
        //     if(this.timer.running){
        //         this.timer.stop();
        //     }else{
        //         this.timer.start();
        //     }
        // }, this); 
    };
    Battle.prototype.timerFunc = function (event) {
        this.timetemp++;
    };
    return Battle;
}(engine.DisplayObjectContainer));
var Pos = (function () {
    function Pos(x, y) {
        this.x = x;
        this.y = y;
    }
    return Pos;
}());
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(name, ad, str, con, dex, mag, spd, quality) {
        var _this = _super.call(this, name, str, con, dex, mag, spd, quality) || this;
        _this.bodyad = ad;
        return _this;
    }
    return Enemy;
}(Hero));
function setEnemy(level, ad) {
    var enemy = new Enemy("不规则几何体", ad, 46 + level * 12 + Math.floor(Math.random() * 6), 80 + level * 2 + Math.floor(Math.random() * 8), 0, 2, 2, 0);
    enemy.skills = [
        { x: 30, y: 900, name: "<不规则攻击>", image: "", inf: "杂鱼也能打败纯形英雄", ratio: 100, MPneed: 0, distance: 3, type: 0, num: 4 },
        { x: 160, y: 900, name: "<不规则移动>", image: "", inf: "上下左右一格的范围", ratio: 0, MPneed: 0, distance: 1, type: 4, num: 4 },
    ];
    return enemy;
}
//  herorightmove() {
//         // if (this.heropos.x + 1 < this._numCols) {
//         //     this._block[this.heropos.x + 1][this.heropos.y].touchEnabled = false;
//         // }
//         // if (this.heropos.x - 1 >= 0) {
//         //     this._block[this.heropos.x - 1][this.heropos.y].touchEnabled = false;
//         // }
//         // if (this.heropos.y + 1 < this._numRows) {
//         //     this._block[this.heropos.x][this.heropos.y + 1].touchEnabled = false;
//         // }
//         // if (this.heropos.y - 1 >= 0) {
//         //     this._block[this.heropos.x][this.heropos.y - 1].touchEnabled = false;
//         // }
//         for (var i = 0; i < this._numCols; i++) {
//             for (var j = 0; j < this._numRows; j++) {
//                 this._block[i][j].touchEnabled = false;
//             }
//         }
//         this.heropos.x++;
//         this.upDateBattelMap();
//         if (this.hero.name == "三角") {
//             this.hero.curMP.value += 10;
//             if (this.hero.curMP.value > 100) {
//                 this.hero.curMP.value = 100;
//             }
//             this.updateALLState();
//         }
//     }
//     heroleftmove() {
//         for (var i = 0; i < this._numCols; i++) {
//             for (var j = 0; j < this._numRows; j++) {
//                 this._block[i][j].touchEnabled = false;
//             }
//         }
//         this.heropos.x--
//         this.upDateBattelMap();
//         if (this.hero.name == "三角") {
//             this.hero.curMP.value += 10;
//             if (this.hero.curMP.value > 100) {
//                 this.hero.curMP.value = 100;
//             }
//             this.updateALLState();
//         }
//     }
//     heroupmove() {
//         for (var i = 0; i < this._numCols; i++) {
//             for (var j = 0; j < this._numRows; j++) {
//                 this._block[i][j].touchEnabled = false;
//             }
//         }
//         this.heropos.y--;
//         this.upDateBattelMap();
//         if (this.hero.name == "三角") {
//             this.hero.curMP.value += 10;
//             if (this.hero.curMP.value > 100) {
//                 this.hero.curMP.value = 100;
//             }
//             this.updateALLState();
//         }
//     }
//     herodownmove() {
//         for (var i = 0; i < this._numCols; i++) {
//             for (var j = 0; j < this._numRows; j++) {
//                 this._block[i][j].touchEnabled = false;
//             }
//         }
//         this.heropos.y++;
//         this.upDateBattelMap();
//         if (this.hero.name == "三角") {
//             this.hero.curMP.value += 10;
//             if (this.hero.curMP.value > 100) {
//                 this.hero.curMP.value = 100;
//             }
//             this.updateALLState();
//         }
//     } 
// var canvas = document.getElementById("app") as HTMLCanvasElement;
// var stage =  engine.run(canvas);
// var container = new engine.DisplayObjectContainer();
// stage.addEventListener("mousedown", () => {
//     console.log("stage");
// });
// container.addEventListener("mousedown", () => {
//     console.log("container");
// }, true);
// let tf = new engine.TextField();
// tf.text = "可以拖动的";
// //tf.x = 20;
// //tf.y = 40;
// tf.touchEnabled = true;
// tf.addEventListener("mousedown", (e: MouseEvent) => {
//     console.log("123");
// });
// let Button_1 = new engine.Bitmap();
// Button_1.src = "image.JPG";
// //Button.x = 50;
// //Button.y = 50;
// Button_1.scaleX = 0.3;
// Button_1.scaleY = 0.3;
// Button_1.touchEnabled = true;
// // Button.addEventListener("mousedown", () => { alert("mousedown") });
// // Button.addEventListener("mouseup", () => { alert("mouseup") });
// var distanceX;
// var distanceY;
// Button_1.addEventListener("mousedown", (e: MouseEvent) => {
//     if (TouchEventService.getInstance().isMove == false) {
//         TouchEventService.getInstance().isMove = true;
//     }
//     TouchEventService.getInstance().currentX = e.x;
//     TouchEventService.getInstance().currentY = e.y;
//     distanceX = TouchEventService.getInstance().currentX - Button_1.x;
//     distanceY = TouchEventService.getInstance().currentY - Button_1.y;
// });
// Button_1.addEventListener("mousemove", (e: MouseEvent) => {
//     if (TouchEventService.getInstance().isMove == true) {
//         Button_1.x = TouchEventService.getInstance().currentX - distanceX;
//         Button_1.y = TouchEventService.getInstance().currentY - distanceY;
//     }
//     TouchEventService.getInstance().currentX = e.x;
//     TouchEventService.getInstance().currentY = e.y;
// });
// Button_1.addEventListener("mouseup", (e: MouseEvent) => {
//     if (TouchEventService.getInstance().isMove == true) {
//         TouchEventService.getInstance().isMove = false;
//     }
// });
// // stage.addChild(Button);
// // stage.addChild(tf);
// stage.addChild(container);
// //container.addChild(tf);
// container.addChild(Button_1);
// container.addChild(tf);
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
