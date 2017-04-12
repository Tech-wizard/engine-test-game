
class Property {

    constructor(name: string, value: number) {

        this.name = name;
        this.value = value;
        //this.isRate = isRate;
    }

    name: string;

    value: number;

    isRate:boolean;

    getDescription() {

        return this.name + ": + " + this.value;

    }

}


class Properties {

    all: Property[] = [new Property( "攻击" , 100 )];

    atk: Property;

    getAtkDescription() {
        return this.atk.getDescription();
    }

    def: Property;

    getDefDescription() {
        return this.def.getDescription();

    }

    getProperty(propertyName: PropertyName) {

        return this.all[propertyName];
    }

}


enum PropertyName {

    STR = 0,

    CON = 1,

    DEX = 2, 

    MAG = 3,

    SPD = 4

}

class PropertiesDisplayUtils {

    static createAllPropertiesDecription(properties: Properties) {
        var container = new engine.DisplayObjectContainer();
        for (var p of properties.all) {
            var tf = new engine.TextField();
            tf.text = PropertiesDisplayUtils.getDescription(p);
            container.addChild(tf);
        }
        return container;
    }

    static getDescription(property: Property, color?) {
        if (property.isRate) {
            var textColor = property.value >= 500 ? "red" : "green";
            return property.name + ": +<red>" + (property.value / 10).toFixed(2);
        }
        else {
            return property.name + ": + " + property.value;
        }
    }

}