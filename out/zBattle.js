var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
