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
