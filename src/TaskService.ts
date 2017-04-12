interface EventEmitter {

    addObserver(observer: Observer);
    notify(task: Task);
    
}

class TaskService implements EventEmitter {

    private static instance;
    private static count = 0;
    private taskList: {
        [index: string]: Task
    } = {};

    private observerList: Observer[] = [];

    constructor() {
        TaskService.count++;
        if (TaskService.count > 1) {
            throw "singleton!!!";
        }
    }
    public static getInstance() {
        if (TaskService.instance == null) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    }

    public getTaskByCustomRule(): Task {
          
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

    }

     public getNextTask(): Task {
          
        for (var id in this.taskList) {
            var task = this.taskList[id];
            if (task.status == TaskStatus.UNACCEPTABLE)
                return task;
        }

    }



    accept(id: string) {

        if (!id) {
            return ErrorCode.MISSING_TASK;
        }
        let task = this.taskList[id];
        if (task.id == id) {

            task.status = TaskStatus.DURING;
            task.onAccept();
            console.log("任务状态"+task.status);
            this.notify(this.taskList[id]);
           
            return ErrorCode.SUCCESS;
        }
        else {

            return ErrorCode.MISSING_TASK;
        }

    }


    finish(id: string) {
        if (!id) {
            return ErrorCode.MISSING_TASK;
        }
        let task = this.taskList[id];
        if (task.id == id) {
            console.log("finish");
            task.status = TaskStatus.SUBMITED;
            this.notify(this.taskList[id]);

            return ErrorCode.SUCCESS;
        }
        else {
            return ErrorCode.MISSING_TASK;
        }
    }

   public  notify(task: Task) {
        // console.log("111");
        for (var observer of this.observerList) {
            observer.onChange(task);
        }
    }

    public addTask(task: Task) {
        this.taskList[task.id] = task;
    }

    public addObserver(observer: Observer) {
        for (var i = 0; i < this.observerList.length; i++) {
            if (observer == this.observerList[i])
                return ErrorCode.REPEAT_OBSERVER;
        }
        this.observerList.push(observer);
    }
   
}

enum ErrorCode {

    SUCCESS,
    MISSING_TASK,
    REPEAT_OBSERVER

}


