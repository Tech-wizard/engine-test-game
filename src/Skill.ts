class Skill extends engine.DisplayObjectContainer{

   data:SkillData;

    constructor(data:SkillData) {
          super();
         this.data = data;
          for (var i = 0; i < skillconfig.length; i++) {
            var data = skillconfig[i];
    // var tile = new Tile(data);
            
        }

        // this.name = name;
        // this.inf = inf;
        // this.ratio = ratio
        // this.MPneed = MPneed;
        // this.distance = distance;
        // this.type = type;
        // this.num = num;

    }

}

class SkillConstructor extends engine.DisplayObjectContainer {

    data: SkillData;
   
    constructor(data: SkillData) {
        super();
        this.data = data;
        var bitmap = new engine.Bitmap();
        bitmap.src = data.image;
        bitmap.width = 128;
        bitmap.height = 128;
        this.addChild(bitmap);
        this.x = data.x ;
        this.y = data.y ;

         var tfname = new engine.TextField();
         tfname.text = data.name;
         this.addChild(tfname);

        bitmap.touchEnabled = true;
        bitmap.addEventListener(engine.TouchEvent.TOUCH_TAP,(e:MouseEvent)=>{
        
        });

        bitmap.addEventListener(engine.TouchEvent.TOUCH_BEGIN,(e:MouseEvent)=>{

        })
    }

        showSkillsInformation(){

        }
}

enum SkillType {
    hurt,     //伤害
    speedbuff,  //加速
    atkbuff,    //加攻
    HPbuff,    //加血
    move,   //移动
    roll,   //滚动
    jump    //跳跃
}

interface SkillData{
    x:number;   //屏幕位置
    y:number;
    name: string;
    image:string; 
    inf: string; //技能介绍
    ratio: number; //加成系数
    MPneed: number //耗魔
    distance: number //释放距离
    //learned: boolean ; //是否习得
    type: number;  //技能种类
    num: number;  //技能在技能栏中的位置编号
}

var skillconfig :SkillData[] =[

    {x:30,y:900,name:"射击",image:"Skill_1_png",inf:"普通远程攻击",ratio:100,MPneed:5,distance:2,type:0,num:1},
    {x:160,y:900,name:"轰击",image:"Skill_2_png",inf:"聚集锋芒的重型远程攻击",ratio:350,MPneed:70,distance:3,type:0,num:1},
    {x:290,y:900,name:"划击",image:"Skill_3_png",inf:"不擅长的近战攻击",ratio:80,MPneed:0,distance:1,type:0,num:1},
    {x:420,y:900,name:"尖锐化",image:"Skill_4_png",inf:"三角高速旋转，本回合增加行动次数",ratio:100,MPneed:50,distance:0,type:1,num:1},
    {x:550,y:900,name:"三角移动",image:"Skill_5_png",inf:"移动一格并回复10MP",ratio:0,MPneed:-10,distance:1,type:4,num:1},

    {x:30,y:900,name:"棱刮",image:"",inf:"普通近战攻击",ratio:100,MPneed:0,distance:1,type:0,num:2},
    {x:160,y:900,name:"格式打击",image:"",inf:"猛扑对敌人造成重创",ratio:250,MPneed:50,distance:1,type:0,num:2},
    {x:290,y:900,name:"空格",image:"",inf:"向所指方向跳跃一格并撞击敌人",ratio:125,MPneed:30,distance:2,type:6,num:2},
    {x:420,y:900,name:"栅格化",image:"",inf:"方块变得更方了，本次战斗中永久提升攻击力",ratio:150,MPneed:5,distance:2,type:2,num:2},
    {x:550,y:900,name:"方块移动",image:"",inf:"上下左右一格的范围",ratio:0,MPneed:0,distance:1,type:4,num:2},

    {x:30,y:900,name:"碾压",image:"",inf:"普通攻击，命中后回复8MP",ratio:125,MPneed:-8,distance:1,type:0,num:3},
    {x:160,y:900,name:"飞盘",image:"",inf:"正圆自身的投影攻击远程攻击，命中后回复5MP",ratio:100,MPneed:-5,distance:2,type:0,num:3},
    {x:290,y:900,name:"翻滚",image:"",inf:"直线大幅度移动，回复2MP",ratio:0,MPneed:-2,distance:5,type:5,num:3},
    {x:420,y:900,name:"圆滑化",image:"",inf:"正圆变得更加圆润光滑，按当前比例增长HP",ratio:150,MPneed:100,distance:2,type:3,num:3},
    {x:550,y:900,name:"正圆移动",image:"",inf:"上下左右一格的范围",ratio:0,MPneed:0,distance:1,type:4,num:3},

     {x:30,y:900,name:"不规则攻击",image:"",inf:"杂鱼也能打败纯形英雄",ratio:100,MPneed:0,distance:3,type:0,num:4},
     {x:160,y:900,name:"不规则移动",image:"",inf:"上下左右一格的范围",ratio:0,MPneed:0,distance:1,type:4,num:4},
]

