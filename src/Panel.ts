class Button extends engine.DisplayObjectContainer {
    body: engine.Bitmap;
    constructor(ad: string) {
        super();
        this.body = new engine.Bitmap();
        this.body.src = ad;
        this.addChild(this.body);
        this.touchEnabled = true;
    }
}

class Panel extends engine.DisplayObjectContainer {

    constructor() {
        super();
    }
}

class PropertyPanel extends engine.DisplayObjectContainer {

    public static flag: number = 0;
    body: engine.Shape;
    weaponbody: engine.Shape;
    closeButton: Button;

    weaponButton: Button;

    weaponflag: boolean = false;

    tfname: engine.TextField = new engine.TextField();
    tfHP: engine.TextField = new engine.TextField();
    tfSTR: engine.TextField = new engine.TextField();
    tfFP: engine.TextField = new engine.TextField();
    tfATK: engine.TextField = new engine.TextField();
    tfCON: engine.TextField = new engine.TextField();
    tfDEX: engine.TextField = new engine.TextField();
    tfMAG: engine.TextField = new engine.TextField();
    tfSPD: engine.TextField = new engine.TextField();
    tfquality: engine.TextField = new engine.TextField();
    tfHIT: engine.TextField = new engine.TextField();
    tfCRIT: engine.TextField = new engine.TextField();
    tfEV: engine.TextField = new engine.TextField();

    tfweaponname: engine.TextField = new engine.TextField();
    tfweaponSTR: engine.TextField = new engine.TextField();
    tfweaponCON: engine.TextField = new engine.TextField();
    tfweaponDEX: engine.TextField = new engine.TextField();
    tfweaponMAG: engine.TextField = new engine.TextField();
    tfweaponSPD: engine.TextField = new engine.TextField();
    tfweaponATK: engine.TextField = new engine.TextField();

    hero: Hero;

    constructor(hero: Hero) {

        super();
        this.body = new engine.Shape();
        this.body.touchEnabled = true;
        this.body.graphics.beginFill("#000000", 0.6);
        this.body.graphics.drawRect(0, 0, 640, 400);
        this.body.graphics.endFill();
        this.closeButton = new Button("close_png");
        this.weaponButton = new Button("block2_png");
        this.closeButton.body.alpha = 0.95;
        this.closeButton.body.width = 60;
        this.closeButton.body.height = 60;
        this.closeButton.body.x = 570;
        this.closeButton.body.y = 340;
        this.weaponButton.body.width = 60;
        this.weaponButton.body.height = 60;
        this.weaponButton.body.x = 80;
        this.weaponButton.body.y = 250;
        this.closeButton.touchEnabled = true;
        this.closeButton.addEventListener(engine.TouchEvent.TOUCH_TAP, this.disshowDpanel);

        this.weaponButton.touchEnabled = true;
        this.weaponButton.addEventListener(engine.TouchEvent.TOUCH_TAP, this.updateweaponpanel);

        this.addChild(this.body);
        this.addChild(this.closeButton);
        this.addChild(this.weaponButton);
        this.hero = hero;

        this.tfname.x = 230;
        this.tfname.y = 25;
        this.tfFP.x = 230;
        this.tfFP.y = 50;
        this.tfATK.x = 230;
        this.tfATK.y = 75;
        this.tfHP.x = 230;
        this.tfHP.y = 100;
        this.tfSTR.x = 230;
        this.tfSTR.y = 125;
        this.tfCON.x = 230;
        this.tfCON.y = 150;
        this.tfMAG.x = 230;
        this.tfMAG.y = 175;
        this.tfDEX.x = 230;
        this.tfDEX.y = 200;
        this.tfSPD.x = 230;
        this.tfSPD.y = 225;
        this.tfHIT.x = 230;
        this.tfHIT.y = 250;
        this.tfEV.x = 230;
        this.tfEV.y = 275;
        this.tfCRIT.x = 230;
        this.tfCRIT.y = 300;

        this.Update();
        this.showDpanel();

    }

    Update() {

        this.hero.heroInformationUpdate();
        if (this.hero.equipments.length != 0) {
            this.weaponButton.body.src= this.hero.equipments[0].ad;
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

    }

 updateweaponpanel() {
        if (this.weaponflag == false && this.hero.equipments.length != 0) {
     
            this.showWeaponpanel();
        }
        else {
            if (this.weaponflag == true ) {
                this.disshowWeaponpanel();
            }
        }
    }

    showWeaponpanel() {

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

    }


    disshowWeaponpanel() {
        
        this.weaponflag = false;
        this.removeChild(this.tfweaponname);
        this.removeChild(this.tfweaponATK);
        this.removeChild(this.tfweaponCON);
        this.removeChild(this.tfweaponDEX);
        this.removeChild(this.tfweaponMAG);
        this.removeChild(this.tfweaponSPD);
        this.removeChild(this.tfweaponSTR);
        this.removeChild(this.weaponbody);

    }

    showDpanel() {
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

    }

    disshowDpanel() {
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

    }

}