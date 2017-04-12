interface Observer {
    onChange(task: Task): void;
}

class Item extends engine.DisplayObjectContainer implements Observer {


    public _body: engine.Bitmap;
    public ad: string;
    itemName: string;
    item: Equipment;
    atk: number;
    name: string;


    constructor(name: string, ad: string, atk: number, x: number, y: number) {

        super();
        this._body = new engine.Bitmap();
        this._body.src = ad;
        this._body.width = TileMap.TILE_SIZE;
        this._body.height = TileMap.TILE_SIZE;
        this.name = name;
        this.ad = ad;
        this.atk = atk;
        this.x = x;
        this.y = y;
        this.addChild(this._body);
        this.touchEnabled = true;
        this.addEventListener(engine.TouchEvent.TOUCH_TAP, (e:MouseEvent) => {
            this.onItemClick();
        });

    }
    onChange() {

    }

    onItemClick() {

        if (SceneService.getInstance().list, length != 0) {
            SceneService.getInstance().list.cancel();
        }
        SceneService.getInstance().list.addCommand(new WalkCommand(Math.floor(this.x / TileMap.TILE_SIZE), Math.floor(this.y / TileMap.TILE_SIZE)));
        SceneService.getInstance().list.addCommand(new EquipCommand(this.name, this.ad, this.atk));
        SceneService.getInstance().list.execute();

    }
}

class NPC extends engine.DisplayObjectContainer implements Observer {
    public _emoji: engine.Bitmap;
    public _body: engine.Bitmap;
    public _id: string;
    public dialoguePanel: DialoguePanel;
    public fighted: boolean = false;
    //public NPCTalk:string;
    // public task:Task;
    constructor(id: string, ad: string, x: number, y: number, dia: DialoguePanel) {
        super();
        this.dialoguePanel = dia;
        this._body = new engine.Bitmap();
        this._emoji = new engine.Bitmap();
        this._body.src = ad;
        this._emoji.src = "notice_png";
        this._id = id;
        this.x = x;
        this.y = y;
        this._body.width = this._body.width / 2;
        this._body.height = this._body.height / 2;
        this._emoji.width = 70;
        this._emoji.height = 70;
        this._emoji.y = -60;
        this._emoji.x = -5;
        this._emoji.alpha = 0;
        this.addChild(this._body);
        this.addChild(this._emoji);
        this.touchEnabled = true;
        this.addEventListener(engine.TouchEvent.TOUCH_BEGIN, this.onNPCClick);

    }


    onChange(task: Task) {
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
    }

    onNPCClick(e:MouseEvent) {
         TaskService.getInstance().accept();
        if (SceneService.getInstance().list, length != 0) {
            SceneService.getInstance().list.cancel();
        }
        SceneService.getInstance().list.addCommand(new WalkCommand(Math.floor(this.x / TileMap.TILE_SIZE), Math.floor(this.y / TileMap.TILE_SIZE)));
        SceneService.getInstance().list.addCommand(new TalkCommand(this._id));
        SceneService.getInstance().list.execute();



    }
}

class TaskPanel extends engine.DisplayObjectContainer implements Observer {

    body: engine.Shape;
    textField: engine.TextField;
    textField2: engine.TextField;
    textField3: engine.TextField;
    //task:Task
    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.body = new engine.Shape();
        this.body.graphics.beginFill("#000000", 0.4);
        this.body.graphics.drawRect(0, 0, 600, 100);
        this.body.graphics.endFill();

        this.textField = new engine.TextField();
        this.textField.text = "   任务进程    ";
        this.textField.x = 0;
        this.textField.x = 0;

        this.textField2 = new engine.TextField();
        this.textField2.text = "  任务状态    ";
        this.textField2.x = 0;
        this.textField2.y = 30;

        this.textField3 = new engine.TextField();
        this.textField2.text = "      ";
        this.textField3.x = 0;
        this.textField3.y = 55;
        this.addChild(this.body);
        this.addChild(this.textField);
        this.addChild(this.textField2);
        this.addChild(this.textField3);

    }

    onChange(task: Task): void {
        console.log(task);
        this.textField.text = task.desc;
        var tf: string;
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
      
        if (task.type==TaskType.Kill){
        this.textField3.text = task.name + " :" + task.getcurrent() + "/" + task.total;
        }
    }

}


class DialoguePanel extends engine.DisplayObjectContainer {

    button: Button;
    textField: engine.TextField;
    body: engine.Shape;
    currentTask: Task;
    linkNPC: NPC;
    nextTask: Task;


    constructor(talk: string) {

        super();

        this.body = new engine.Shape();
        this.body.graphics.beginFill("#000000", 0.7);
        this.body.graphics.drawRect(0, 0, 600, 172);
        this.body.graphics.endFill();
        this.body.y = 450;
        this.textField = new engine.TextField();
        this.textField.text = talk;
        this.button = new Button("close_png");
        this.textField.x = 80;
        this.textField.y = 500;
        this.button.body.width = 40;
        this.button.body.height = 40;
        this.button.x = 500;
        this.button.y = 550;
        this.button.touchEnabled = true;
        this.body.touchEnabled = true;
        this.button.addEventListener(engine.TouchEvent.TOUCH_TAP, this.onButtonClick);
      


    }

    showDpanel() {

        this.addChild(this.body);
        this.addChild(this.button);
        this.addChild(this.textField);

    }

    updateViewByTask(task: Task) {

        this.currentTask = task;
        if (this.currentTask.id == "001" && this.linkNPC._id == "NPC_2") {
            this.textField.text = "变得不规则挺好的，哈哈哈，来跳舞吧！";
        }

        if (this.currentTask.status == TaskStatus.CAN_SUBMIT && this.currentTask.status == 4) {
            this.textField.text = this.currentTask.NPCTaskTalk;
        }
    }

    disshowDpanel() {

        this.removeChild(this.body);
        this.removeChild(this.button);
        this.removeChild(this.textField);

    }

    onButtonClick(e:MouseEvent) {

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

                if (TaskService.getInstance().getNextTask() != null)
                { TaskService.getInstance().getNextTask().status = TaskStatus.ACCEPTABLE; }

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
        else{
             this.textField.text= "我投降";
        }

    }
}


class Monster extends engine.DisplayObjectContainer implements Observer {

    public count = 0;
    public linkTask: string;
    public body: engine.Bitmap;
    public ad: string;

    constructor(ad: string, linkTask: string) {
        super();
        this.ad = ad;
        this.body = new engine.Bitmap();
        this.body.src = ad;
        this.body.width= TileMap.TILE_SIZE;
        this.body.height = TileMap.TILE_SIZE;
        this.linkTask = linkTask;
        this.touchEnabled = true;
        this.addEventListener(engine.TouchEvent.TOUCH_BEGIN, this.onButtonClick);
        this.addChild(this.body);

        engine.Ticker.getInstance().register(() => {

            if (this.count < 5) {
                this.body.scaleY *= 1.01;
            }
            else if (this.count < 10 || this.count >= 5) {
                this.body.scaleY /= 1.01;
            }
            this.count += 0.5;
            if (this.count >= 10) {
                this.count = 0;
            }

        });
    }

    onButtonClick(e:MouseEvent) {

        if (SceneService.getInstance().list, length != 0) {
            SceneService.getInstance().list.cancel();
        }

        SceneService.getInstance().list.addCommand(new WalkCommand(Math.floor(this.x / TileMap.TILE_SIZE), Math.floor(this.y / TileMap.TILE_SIZE)));
        SceneService.getInstance().list.addCommand(new FightCommand(this.ad));
        SceneService.getInstance().list.execute();

    }

    onChange() {

        if (this.linkTask != null) {
            let task = TaskService.getInstance().taskList[this.linkTask];

            if (!task){
                console.error('missing task:',this.linkTask);
            }
            if (task.status == TaskStatus.DURING) {
                SceneService.getInstance().notify(TaskService.getInstance().taskList[this.linkTask]);
            }

        }
    }
}