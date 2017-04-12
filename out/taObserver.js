var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
