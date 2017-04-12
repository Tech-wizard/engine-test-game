
class User {

    name: string;

    cash = 0;

    gold = 0;

    exp = 0;

    totalExp = 0;

    level = 1;

    heros: Hero[] = [];

    _herosInTeam: Hero[] = [];

    // pet: pet;

    constructor(name: string) {

        this.name = name;

    }

    get herosInTeam() {
        return this.heros.filter(hero => hero.isInTeam)
    }

    //@Cache

    getFightPower() {

        var result = 0;
        this.herosInTeam.map(hero => result += hero.getFightPower());
        // result += this.pet.getFightPower();
        return result;
    }

    changeHeroTeam(heroToUp, heroToDown) {

    }
    weapons: Equipment;

    mountEquipment(equip: Equipment, hero: Hero) {
        //User.packages.remove(equip);       //单例
        hero.mount(equip);
    }

    packages: Package;
}

class Package {

}

enum qualityType {

    C,
    B,
    A,
    S,
    SS
}

enum equipmentType {

    weapon,
    cloth,
    accessorie

}

enum occupationType {


}


class Hero {
    skills: SkillData[] = [];

    name: string;

    isInTeam: boolean = false;

    equipments: Equipment[] = [];

    level = 1;

    STRUP: number;

    CONUP: number;

    curHP: Property;   //当前血量

    curMP: Property;

    _maxMP: Property;

    _maxHP: Property;   //最大血量

    STR: Property;  //力量

    CON: Property;  //体力

    DEX: Property;  //技巧

    MAG: Property;  //魔力

    SPD: Property;  //速度

    quality: Property; //成长品质

    _ATK: Property;  //伤害

    _HIT: Property;  //命中

    _CRIT: Property;  //暴击

    _EV: Property; //闪避

    constructor(name: string, str: number, con: number, dex: number, mag: number, spd: number, quality: number) {
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

    mount(equip: Equipment) {

    }


    equip(equipment: Equipment) {

        this.equipments.push(equipment);
        this.heroInformationUpdate();

    }


    get maxHp() {

        return this.CON.value * 10;

    }

    get maxMp() {
        return this.MAG.value * 10;
    }

    get HIT() {

        return this.DEX.value * 7 + this.SPD.value * 2;
    }

    get CRIT() {

        return this.DEX.value * 11;

    }

    get EV() {
        return this.DEX.value * 5 + this.SPD.value * 7;
    }


    get ATK() {

        var result = 0;
        this.equipments.forEach(e => result += e._attack)
        result += this.STR.value;
        return result;

    }

    get fightPower() {

        return this.getFightPower();

    }

    getFightPower() {

        return this._ATK.value * 5 + this.SPD.value * 4 + this.STR.value * 10 + this.MAG.value * 8 + this.CON.value * 6 + this.DEX.value * 11;
    }


    levelup() {
        this.level++;
        this.STR.value += this.STRUP;
        this.CON.value += this.CONUP;
        this.heroInformationUpdate();
    }


    heroInformationUpdate() {

        this.equipments.forEach(e => this.STR.value += e.STR);
        this.equipments.forEach(e => this.CON.value += e.CON);
        this.equipments.forEach(e => this.DEX.value += e.DEX);
        this.equipments.forEach(e => this.MAG.value += e.MAG);
        this.equipments.forEach(e => this.SPD.value += e.SPD);
        this._ATK.value = this.ATK;
        this._CRIT.value = this.CRIT;
        this._EV.value = this.EV;
        this._HIT.value = this.HIT;
        this._maxHP.value = this.maxHp;
        this.curHP.value = this._maxHP.value;
        this._maxMP.value = this.maxMp;
        this.curMP.value = this._maxMP.value / 2;
    }

}

class Equipment {

    //jewels: jewel[] = [];
    ad:string;  //装备图标地址

    STR = 0;  //力量

    CON = 0;  //体力

    DEX = 0;  //技巧

    MAG = 0;  //魔力

    SPD = 0;  //速度

    runes: rune[] = [];

    equipmentType: number;

    name: string;

    _attack: number;

    constructor(name: string, ad:string,type: number, atk: number, runes: rune[]) {
        this.ad = ad;
        this.name = name;
        this.equipmentType = type;
        this._attack = atk;
        this.runes = runes;
        this.equipmentUpdate();
    }

    equipmentUpdate() {

        this.runes.forEach(e => this.STR += e.STR);
        this.runes.forEach(e => this.CON += e.CON);
        this.runes.forEach(e => this.DEX += e.DEX);
        this.runes.forEach(e => this.SPD += e.SPD);
        this.runes.forEach(e => this.MAG += e.MAG);

    }


}

// class jewel {


// }

class rune {

    STR = 0;  //力量

    CON = 0;  //体力

    DEX = 0;  //技巧

    MAG = 0;  //魔力

    SPD = 0;  //速度

    quality: number;

    constructor(quality: number) {

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



}


function SetTriangle(lv:number): Hero {
    var sanjiao = new Hero("三角", 47+7*lv, 77+7*lv, 10, 10, 2, 7);
    sanjiao.CONUP = 7;
    sanjiao.STRUP = 7;
    sanjiao.skills = [
        { x: 40, y: 1000, name: "<射击>", image: "Skill_1_png", inf: "普通的\n远程攻击", ratio: 100, MPneed: 5, distance: 2, type: 0, num: 1 },
        { x: 170-2, y: 1000, name: "<轰击>", image: "Skill_1_png", inf: "聚集锋芒的\n重型远程攻击", ratio: 350, MPneed: 70, distance: 3, type: 0, num: 1 },
        { x: 300-4, y: 1000, name: "<划击>", image: "Skill_1_png", inf: "不擅长的\n近战攻击", ratio: 80, MPneed: 0, distance: 1, type: 0, num: 1 },
        { x: 430-6, y: 1000, name: "<尖锐化>", image: "Skill_1_png", inf: "三角高速旋转\n本次战斗中\n永久提升速度", ratio: 100, MPneed: 100, distance: 0, type: SkillType.speedbuff, num: 1 },
        { x: 560-8, y: 1000, name: "<三角移动>", image: "Skill_1_png", inf: "移动一格\n并回复10MP", ratio: 0, MPneed: -10, distance: 1, type: 4, num: 1 },

    ];
    return sanjiao;
}

function SetSquare(lv:number): Hero {
    var fangkuai = new Hero("方块", 50+10*lv, 100+10*lv, 8, 10, 2, 10);
    fangkuai.CONUP = 10;
    fangkuai.STRUP = 10;
    fangkuai.skills = [
        { x: 40, y: 1000, name: "<棱刮>", image: "Skill_1_png", inf: "普通的\n近战攻击", ratio: 100, MPneed: 0, distance: 1, type: 0, num: 2 },
        { x: 170, y: 1000, name: "<格式打击>", image: "Skill_1_png", inf: "猛扑的\n对敌人造成重创", ratio: 250, MPneed: 50, distance: 1, type: 0, num: 2 },
        { x: 290+6, y: 1000, name: "<空格>", image: "Skill_1_png", inf: "向所指方向\n跳跃一格\n并撞击敌人", ratio: 125, MPneed: 30, distance: 2, type: SkillType.jump, num: 2 },
        { x: 420+4, y: 1000, name: "<栅格化>", image: "Skill_1_png", inf: "方块更方了\n本次战斗中\n永久提升攻击力", ratio: 150, MPneed: 100, distance: 2, type: SkillType.speedbuff, num: 2 },
        { x: 550+2, y: 1000, name: "<方块移动>", image: "Skill_1_png", inf: "上下左右\n一格的范围", ratio: 0, MPneed: 0, distance: 1, type: 4, num: 2 }
    ]
    return fangkuai;
}

function SetCircle(lv:number): Hero {
    var zhengyuan = new Hero("正圆", 42+8*lv, 120+12*lv, 6, 10, 2, 10);
    zhengyuan.CONUP = 12;
    zhengyuan.STRUP = 8;
    zhengyuan.skills = [
        { x: 40, y: 1000, name: "<碾压>", image: "Skill_1_png", inf: "普通的攻击\n命中后回复8MP", ratio: 100, MPneed: -8, distance: 1, type: 0, num: 3 },
        { x: 170, y: 1000, name: "<飞盘>", image: "Skill_1_png", inf: "正圆自身的\n投影远程攻击\n命中后回复5MP", ratio: 80, MPneed: -5, distance: 2, type: 0, num: 3 },
        { x: 290+6, y: 1000, name: "<翻滚>", image: "Skill_1_png", inf: "直线大幅度移动\n回复2MP", ratio: 0, MPneed: -2, distance: 5, type: SkillType.roll, num: 3 },
        { x: 420+4, y: 1000, name: "<圆滑化>", image: "Skill_1_png", inf: "正圆变得\n更加圆润光滑\n按当前比例增长HP", ratio: 150, MPneed: 100, distance: 2, type: SkillType.HPbuff, num: 3 },
        { x: 550+2, y: 1000, name: "<正圆移动>", image: "Skill_1_png", inf: "上下左右\n一格的范围", ratio: 0, MPneed: 0, distance: 1, type: 4, num: 3 },
    ];
    return zhengyuan;
}
