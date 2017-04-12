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
                    GameScene.getCurrentScene().player._body.x = current.x * TileMap.TILE_SIZE;
                    GameScene.getCurrentScene().player._body.y = current.y * TileMap.TILE_SIZE;
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
