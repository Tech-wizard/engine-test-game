class Task implements TaskConditionContext {

    private _id: string;
    private _name: string;
    private _status: TaskStatus;
    private _current: number = 0;
    private _condition: TaskConditon;
    public type:number;
    public fromNpcId: string;
    public toNpcId: string;
    public desc: string;
    public total: number;
    public NPCTaskTalk:string;
    
    constructor(id: string, name: string, condition: TaskConditon,type:number) {
      
        this._id = id;
        this._name = name;
        this._condition = condition;
        this.type = type;
    }

    public checkStatus() {

        if (this._status == TaskStatus.DURING &&
            this._current >= this.total) {
            this._status = TaskStatus.CAN_SUBMIT;
        }

        TaskService.getInstance().notify(this);

    }
    public get condition(): TaskConditon {
        return this._condition;
    }


    public get status(): TaskStatus {

        return this._status;
    }

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public getcurrent(): number {
        return this._current;
    }

    public set status(value: TaskStatus) {
        this._status = value;

    }
    public set name(name: string) {
        this._name = name;
    }

    public set id(id: string) {
        this._id = id;
    }

    public setcurrent(current: number) {
        this._current = current;
        this.checkStatus();
    }

    public onAccept() {
        this._condition.onAccept(this);
    }

   

}

enum TaskStatus {

    UNACCEPTABLE,
    ACCEPTABLE,
    DURING,
    CAN_SUBMIT,
    SUBMITED

}

enum TaskType{
    Talk,
    Kill
}

interface TaskConditon {

    onAccept(task: TaskConditionContext);

    onSubmit(task: TaskConditionContext);

    onChange(task: TaskConditionContext);

}

interface TaskConditionContext {
    getcurrent(): number;
    setcurrent(current: number);
  
}





class KillMonsterTaskCondition implements TaskConditon, Observer {

    onAccept(task: TaskConditionContext) {

       
         task.setcurrent(task.getcurrent());
    }

    onSubmit(task: TaskConditionContext) {


    }

    onChange(task: TaskConditionContext) {

       var temp = task.getcurrent();
       temp++;
        task.setcurrent(temp);

    }

}

class NPCTalkTaskCondition implements TaskConditon {
    onAccept(task: TaskConditionContext) {
        //task.current++;
        // var temp = 0;
        // temp = task.getcurrent();
        task.setcurrent(1);

       


    }

    onSubmit(task: TaskConditionContext) {

  
    }

      onChange(task: TaskConditionContext) {

      }
}