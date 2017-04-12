enum BlockType {

    notmove,
    upmove,
    downmove,
    leftmove,
    rightmove,
    uproll,
    downroll,
    leftroll,
    rightroll,
    upjump,
    downjump,
    leftjump,
    rightjump

}

class Battle extends engine.DisplayObjectContainer {

    hero: Hero;
    heropos: Pos = new Pos(0, 5);
    enemy: Enemy;
    enemypos: Pos = new Pos(5, 0);
    battleinfo: engine.TextField = new engine.TextField();
    heroSkills: engine.Bitmap[] = [];
    heroSkillsinfo: engine.TextField[] = [];
    _block: engine.Bitmap[][] = [];
    _blockType: number[][] = [];
    _herobody: engine.Bitmap = new engine.Bitmap();
    _heroHP: engine.TextField = new engine.TextField();
    _heroMP: engine.TextField = new engine.TextField();

    _herobodyad: string;
    _enemybody: engine.Bitmap = new engine.Bitmap();
    _enemyHP: engine.TextField = new engine.TextField();
    _enemyMP: engine.TextField = new engine.TextField();
    _enemybodyad: string;
    _numCols: number;
    _numRows: number;
    //timer:engine.Timer;
    timerbar:engine.TextField = new engine.TextField();
    timetemp:number;
    
    chance: number = 0;  //该回合行动次数

    constructor(hero: Hero, level: number, enemyad: string, x: number, y: number) {

        super();

        var BattleMask = new engine.Shape();
        BattleMask.graphics.beginFill("#000000", 1);
        BattleMask.graphics.drawRect(0, 0, 640, 1136);
        BattleMask.graphics.endFill();
        BattleMask.graphics.width = 640;
        BattleMask.graphics.height = 1136;
        this.addChild(BattleMask);

        this.hero = hero;
        this.enemy = setEnemy(level, enemyad);
        this._enemybody.src = this.enemy.bodyad;
        this.battleinfo.text = "战斗信息";
        this.battleinfo.size = "20";
        this.addChild(this.battleinfo);
        this.battleinfo.x = 100;
        this.battleinfo.y = 740;
        
        switch (hero.name) {
            case "三角":
                this._herobody.src = "sanjiao_png";
                this._herobodyad = "sanjiao_png";
                break;

            case "方块":
                this._herobody.src = "fangkuai_png";
                this._herobodyad = "fangkuai_png";
                break;

            case "正圆":
                this._herobody.src = "zhengyuan_png";
                this._herobodyad = "zhengyuan_png";
                break;
        }



        this._numCols = x;
        this._numRows = y;
        for (var i = 0; i < this._numCols; i++) {
            this._block[i] = new Array();
            this._blockType[i] = new Array();
            for (var j = 0; j < this._numRows; j++) {
                let block = new engine.Bitmap();
                block['i'] = i;
                block['j'] = j;
                this._block[i][j] = block;
                this._block[i][j].width = TileMap.TILE_BATTLE_SIZE;
                this._block[i][j].height = TileMap.TILE_BATTLE_SIZE;
                this._block[i][j].src = "block2_png";
                this._block[i][j].x = i * TileMap.TILE_BATTLE_SIZE + 80;
                this._block[i][j].y = j * TileMap.TILE_BATTLE_SIZE + 240;
                this.addChild(this._block[i][j]);
                this._block[i][j].touchEnabled = true;
                this._blockType[i][j] = BlockType.notmove;
                this._block[i][j].addEventListener(engine.TouchEvent.TOUCH_TAP, (e: MouseEvent) => {
                    // console.log(e.target);
                    // console.log(e.target.i, e.target.j);
                    let target = e.target as any as engine.Bitmap;
                    this.heroTouchMove(target['i'], target['j']);
                });
            }
        }

        for (i = 0; i < 5; i++) {
            this.heroSkills[i] = new engine.Bitmap();

        }

        for (i = 0; i < 5; i++) {
            this.heroSkillsinfo[i] = new engine.TextField();
        }
        this.upDateBattelMap();
        this.showSkills();
        this.showALLState();
        //console.log(this.hero);
        this.updateALLState();
        this.heroTurn();
    }


    heroTurn() {

        this.chance = 2;
        this.heroSkills[0].touchEnabled = true;
        this.heroSkills[1].touchEnabled = true;
        this.heroSkills[2].touchEnabled = true;
        this.heroSkills[3].touchEnabled = true;
        this.heroSkills[4].touchEnabled = true;

        //engine.setInterval(()=>{this.randommove(this.heropos)},this,2000);
        //engine.setInterval(() => { this.enemyturn() }, this, 3000);

        this.heroSkills[0].addEventListener(engine.TouchEvent.TOUCH_TAP, () => { this.heroAttack(this.hero.skills[0]) });
        this.heroSkills[1].addEventListener(engine.TouchEvent.TOUCH_TAP, () => { this.heroAttack(this.hero.skills[1]) });
        this.heroSkills[2].addEventListener(engine.TouchEvent.TOUCH_TAP, () => { this.heroSpecial(this.hero.skills[2]) });
        this.heroSkills[3].addEventListener(engine.TouchEvent.TOUCH_TAP, () => { this.heroBuff(this.hero.skills[3]) });
        this.heroSkills[4].addEventListener(engine.TouchEvent.TOUCH_TAP, this.heroMove);
        this.heroTurnEnd();
    }

    heroTurnEnd() {
        var turn = setInterval(() => {

            if (this.chance = 0) {
                this.heroSkills[0].touchEnabled = false;
                this.heroSkills[1].touchEnabled = false;
                this.heroSkills[2].touchEnabled = false;
                this.heroSkills[3].touchEnabled = false;
                this.heroSkills[4].touchEnabled = false;
            }
            if (this.judgeEnemyDeath() == true || this.judgeHeroDeath() == true) {
                console.log("结束战斗");
                clearInterval(turn);
            }
            else {
                this.enemyTurn();
            }
        }, this, 1000);


    }

    upDateBattelMap() {

        for (var i = 0; i < this._numCols; i++) {
            for (var j = 0; j < this._numRows; j++) {

                let block = this._block[i][j];
                let type = this._blockType[i][j];

                let config = {
                    [BlockType.notmove]:"block_0_png",
                    [BlockType.upmove]:"block_1_png",
                    [BlockType.notmove]:"block_3_png",
                    [BlockType.notmove]:"block2_png",
                    [BlockType.notmove]:"block2_png",
                    [BlockType.notmove]:"block2_png",
                    [BlockType.notmove]:"block2_png",
                    [BlockType.notmove]:"block2_png",
                }

                //约定优于配置

                let srcName = 'block_' + type + '_png';
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

    }

    showSkills() {
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

    }

    showALLState() {
        this._herobody.x = 20;
        this._herobody.y = 800;
        this._herobody.width = 150;
        this._herobody.height = 150;
        this._heroHP.text = "HP:";
        this._heroMP.text = "MP:";
        this.addChild(this.timerbar);
        this.timerbar.x = 200;
        this.timerbar.y = 900;
        this.timerbar.text = "AB:"
        for (var i = 0; i < 25; i++) {
            this._heroHP.text += "|";
            this._heroMP.text += "-";
            this.timerbar.text +="-";
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
    }


    updateALLState() {
        var hptemp: number, mptemp: number,abtemp:number;
        hptemp = Math.floor(this.hero.curHP.value / this.hero._maxHP.value * 25);
        mptemp = Math.floor(this.hero.curMP.value / this.hero._maxMP.value * 25);
        //this._heroHP.textAlign = "justify";
        //this._heroMP.textAlign = "justify";
        // this._heroMP.textAlign = engine.HorizontalAlign.CENTER;
        this._heroHP.text = "HP:" + this.hero.curHP.value + "/" + this.hero._maxHP.value + " ";
        this._heroMP.text = "MP:" + this.hero.curMP.value + "/" + this.hero._maxMP.value + " ";;
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

    }



    heroTouchMove(i: number, j: number) {

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
    }



    heroMove() {

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
    }


    heroRoll() {

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

    }

    heroJump() {

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

    }



    judgeDistance(skill: SkillData): boolean {
        if (Math.abs(this.heropos.x - this.enemypos.x) +
            Math.abs(this.heropos.y - this.enemypos.y)
            <= skill.distance) {
            return true;
        }
        else {
            return false;
        }
    }


    judgeHeroDeath(): boolean {
        if (this.hero.curHP.value <= 0)
            return true;
        else
            return false;
    }

    judgeEnemyDeath(): boolean {
        if (this.enemy.curHP.value <= 0)
            return true;
        else
            return false;
    }


    randomMove(pos: Pos) {
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
    }


    heroAttack(skill: SkillData) {

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
    }


    heroBuff(skill: SkillData) {

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
    }

    heroSpecial(skill: SkillData) {
        switch (skill.type) {
            case SkillType.roll:
                this.heroRoll();
                break;
            case SkillType.jump:
                this.heroJump();
                break;
        }
    }

    enemyAttack() {
        var skill = this.enemy.skills[0];
        var temp = 0;
        if (this.judgeDistance(skill) == true) {
            temp = skill.ratio * this.enemy._ATK.value / 100 - Math.floor(Math.random() * 7);
            this.hero.curHP.value -= temp;
            this.enemy.curMP.value -= skill.MPneed;
            this.battleinfo.text = this.enemy.name + skill.name + "对" + this.hero.name + "造成" + temp + "点伤害";
        }
        this.updateALLState();
    }

    enemyTurn() {

        this.randomMove(this.enemypos);
        setTimeout(() => {
            this.enemyAttack();
        }, this, 1500);
    }

    heroTimer() {
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
     
    }

    private timerFunc(event: engine.Event) {

       this.timetemp++;

    }
}



class Pos {

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}



class Enemy extends Hero {

    bodyad: string;

    constructor(name: string, ad: string, str: number, con: number, dex: number, mag: number, spd: number, quality: number) {

        super(name, str, con, dex, mag, spd, quality);
        this.bodyad = ad;

    }
}



function setEnemy(level: number, ad: string): Enemy {

    var enemy = new Enemy("不规则几何体", ad, 46 + level * 12 + Math.floor(Math.random() * 6), 80 + level * 2 + Math.floor(Math.random() * 8), 0, 2, 2, 0);
    enemy.skills = [
        { x: 30, y: 900, name: "<不规则攻击>", image: "", inf: "杂鱼也能打败纯形英雄", ratio: 100, MPneed: 0, distance: 3, type: 0, num: 4 },
        { x: 160, y: 900, name: "<不规则移动>", image: "", inf: "上下左右一格的范围", ratio: 0, MPneed: 0, distance: 1, type: 4, num: 4 },
    ]

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