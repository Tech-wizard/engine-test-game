var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Button = (function (_super) {
    __extends(Button, _super);
    function Button(ad) {
        var _this = _super.call(this) || this;
        _this.body = new engine.Bitmap();
        _this.body.src = ad;
        _this.addChild(_this.body);
        _this.touchEnabled = true;
        return _this;
    }
    return Button;
}(engine.DisplayObjectContainer));
var Panel = (function (_super) {
    __extends(Panel, _super);
    function Panel() {
        return _super.call(this) || this;
    }
    return Panel;
}(engine.DisplayObjectContainer));
var PropertyPanel = (function (_super) {
    __extends(PropertyPanel, _super);
    function PropertyPanel(hero) {
        var _this = _super.call(this) || this;
        _this.weaponflag = false;
        _this.tfname = new engine.TextField();
        _this.tfHP = new engine.TextField();
        _this.tfSTR = new engine.TextField();
        _this.tfFP = new engine.TextField();
        _this.tfATK = new engine.TextField();
        _this.tfCON = new engine.TextField();
        _this.tfDEX = new engine.TextField();
        _this.tfMAG = new engine.TextField();
        _this.tfSPD = new engine.TextField();
        _this.tfquality = new engine.TextField();
        _this.tfHIT = new engine.TextField();
        _this.tfCRIT = new engine.TextField();
        _this.tfEV = new engine.TextField();
        _this.tfweaponname = new engine.TextField();
        _this.tfweaponSTR = new engine.TextField();
        _this.tfweaponCON = new engine.TextField();
        _this.tfweaponDEX = new engine.TextField();
        _this.tfweaponMAG = new engine.TextField();
        _this.tfweaponSPD = new engine.TextField();
        _this.tfweaponATK = new engine.TextField();
        _this.body = new engine.Shape();
        _this.body.touchEnabled = true;
        _this.body.graphics.beginFill("#000000", 0.6);
        _this.body.graphics.drawRect(0, 0, 640, 400);
        _this.body.graphics.endFill();
        _this.closeButton = new Button("close_png");
        _this.weaponButton = new Button("block2_png");
        _this.closeButton.body.alpha = 0.95;
        _this.closeButton.body.width = 60;
        _this.closeButton.body.height = 60;
        _this.closeButton.body.x = 570;
        _this.closeButton.body.y = 340;
        _this.weaponButton.body.width = 60;
        _this.weaponButton.body.height = 60;
        _this.weaponButton.body.x = 80;
        _this.weaponButton.body.y = 250;
        _this.closeButton.touchEnabled = true;
        _this.closeButton.addEventListener(engine.TouchEvent.TOUCH_TAP, _this.disshowDpanel);
        _this.weaponButton.touchEnabled = true;
        _this.weaponButton.addEventListener(engine.TouchEvent.TOUCH_TAP, _this.updateweaponpanel);
        _this.addChild(_this.body);
        _this.addChild(_this.closeButton);
        _this.addChild(_this.weaponButton);
        _this.hero = hero;
        _this.tfname.x = 230;
        _this.tfname.y = 25;
        _this.tfFP.x = 230;
        _this.tfFP.y = 50;
        _this.tfATK.x = 230;
        _this.tfATK.y = 75;
        _this.tfHP.x = 230;
        _this.tfHP.y = 100;
        _this.tfSTR.x = 230;
        _this.tfSTR.y = 125;
        _this.tfCON.x = 230;
        _this.tfCON.y = 150;
        _this.tfMAG.x = 230;
        _this.tfMAG.y = 175;
        _this.tfDEX.x = 230;
        _this.tfDEX.y = 200;
        _this.tfSPD.x = 230;
        _this.tfSPD.y = 225;
        _this.tfHIT.x = 230;
        _this.tfHIT.y = 250;
        _this.tfEV.x = 230;
        _this.tfEV.y = 275;
        _this.tfCRIT.x = 230;
        _this.tfCRIT.y = 300;
        _this.Update();
        _this.showDpanel();
        return _this;
    }
    PropertyPanel.prototype.Update = function () {
        this.hero.heroInformationUpdate();
        if (this.hero.equipments.length != 0) {
            this.weaponButton.body.src = this.hero.equipments[0].ad;
        }
        this.tfname.text = this.hero.name;
        this.tfHP.text = "HP： " + this.hero.curHP.value + "/" + this.hero._maxHP.value;
        this.tfATK.text = this.hero._ATK.getDescription();
        this.tfCON.text = this.hero.CON.getDescription();
        this.tfCRIT.text = this.hero._CRIT.getDescription();
        this.tfDEX.text = this.hero.DEX.getDescription();
        this.tfEV.text = this.hero._EV.getDescription();
        this.tfFP.text = "战斗力： " + this.hero.fightPower;
        this.tfHIT.text = this.hero._HIT.getDescription();
        this.tfMAG.text = this.hero.MAG.getDescription();
        this.tfquality.text = this.hero.quality.getDescription();
        this.tfSPD.text = this.hero.SPD.getDescription();
        this.tfSTR.text = this.hero.STR.getDescription();
    };
    PropertyPanel.prototype.updateweaponpanel = function () {
        if (this.weaponflag == false && this.hero.equipments.length != 0) {
            this.showWeaponpanel();
        }
        else {
            if (this.weaponflag == true) {
                this.disshowWeaponpanel();
            }
        }
    };
    PropertyPanel.prototype.showWeaponpanel = function () {
        this.weaponflag = true;
        this.weaponbody = new engine.Shape();
        this.weaponbody.touchEnabled = true;
        this.weaponbody.graphics.beginFill("#000000", 0.5);
        this.weaponbody.graphics.drawRect(0, 0, 300, 240);
        this.weaponbody.graphics.endFill();
        this.addChild(this.weaponbody);
        this.addChild(this.tfweaponname);
        this.addChild(this.tfweaponATK);
        this.addChild(this.tfweaponCON);
        this.addChild(this.tfweaponDEX);
        this.addChild(this.tfweaponMAG);
        this.addChild(this.tfweaponSPD);
        this.addChild(this.tfweaponSTR);
        this.tfweaponname.text = this.hero.equipments[0].name;
        this.tfweaponname.x = 20;
        this.tfweaponname.y = 30;
        this.tfweaponATK.text = "附加伤害：" + this.hero.equipments[0]._attack;
        this.tfweaponATK.x = 20;
        this.tfweaponATK.y = 55;
        this.tfweaponSTR.text = "附加形状：" + this.hero.equipments[0].STR;
        this.tfweaponSTR.x = 20;
        this.tfweaponSTR.y = 80;
        this.tfweaponCON.text = "附加面积：" + this.hero.equipments[0].CON;
        this.tfweaponCON.x = 20;
        this.tfweaponCON.y = 105;
        this.tfweaponMAG.text = "附加抽象：" + this.hero.equipments[0].MAG;
        this.tfweaponMAG.x = 20;
        this.tfweaponMAG.y = 130;
        this.tfweaponDEX.text = "附加稳定：" + this.hero.equipments[0].DEX;
        this.tfweaponDEX.x = 20;
        this.tfweaponDEX.y = 155;
        this.tfweaponSPD.text = "附加速度：" + this.hero.equipments[0].SPD;
        this.tfweaponSPD.x = 20;
        this.tfweaponSPD.y = 180;
    };
    PropertyPanel.prototype.disshowWeaponpanel = function () {
        this.weaponflag = false;
        this.removeChild(this.tfweaponname);
        this.removeChild(this.tfweaponATK);
        this.removeChild(this.tfweaponCON);
        this.removeChild(this.tfweaponDEX);
        this.removeChild(this.tfweaponMAG);
        this.removeChild(this.tfweaponSPD);
        this.removeChild(this.tfweaponSTR);
        this.removeChild(this.weaponbody);
    };
    PropertyPanel.prototype.showDpanel = function () {
        PropertyPanel.flag = 1;
        this.addChild(this.tfname);
        this.addChild(this.tfATK);
        this.addChild(this.tfCON);
        this.addChild(this.tfCRIT);
        this.addChild(this.tfDEX);
        this.addChild(this.tfEV);
        this.addChild(this.tfFP);
        this.addChild(this.tfHIT);
        this.addChild(this.tfHP);
        this.addChild(this.tfMAG);
        this.addChild(this.tfquality);
        this.addChild(this.tfSPD);
        this.addChild(this.tfSTR);
    };
    PropertyPanel.prototype.disshowDpanel = function () {
        PropertyPanel.flag = 0;
        this.removeChild(this.tfname);
        this.removeChild(this.body);
        this.removeChild(this.closeButton);
        this.removeChild(this.weaponButton);
        this.removeChild(this.tfATK);
        this.removeChild(this.tfCON);
        this.removeChild(this.tfCRIT);
        this.removeChild(this.tfDEX);
        this.removeChild(this.tfEV);
        this.removeChild(this.tfFP);
        this.removeChild(this.tfHIT);
        this.removeChild(this.tfHP);
        this.removeChild(this.tfMAG);
        this.removeChild(this.tfquality);
        this.removeChild(this.tfSPD);
        this.removeChild(this.tfSTR);
        //this.disshowWeaponpanel();
    };
    return PropertyPanel;
}(engine.DisplayObjectContainer));
PropertyPanel.flag = 0;
