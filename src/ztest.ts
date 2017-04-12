// enum SceneType {
//     menu,
//     pick,
//     about,
//     start,
//     continue,
//     bedend,
//     happyend
// }

// interface Shootable {
//     show();
// }

// abstract class Gun implements Shootable { // 抽象产品 - 枪
//     abstract show();
// }

// class AK47 extends Gun { //具体产品 - AK47
//     show() {
//         console.log('ak47 shoot.');
//     }
// }

// class M4A1 extends Gun { //具体产品 - M4A1
//     show() {
//         console.log('m4a1 shoot.');
//     }
// }

// class SenceFactory {

//     static createGun(type: SceneType): Gun {
//         switch (type) {
//             case SceneType.about:
//                 return new AK47();
//             case SceneType.bedend:
//                 return new M4A1();
//             case SceneType.continue:
//                 return new AK47();
//             case SceneType.continue:
//                 return new AK47();
//             case SceneType.happyend:
//                 return new AK47();
//             case SceneType.menu:
//                 return new AK47();
//             case SceneType.menu:
//                 return new AK47();
//             case SceneType.pick:
//                 return new AK47();
//             case SceneType.start:
//                 return new AK47();
//             default:
//                 throw Error('not sence yet');
//         }
//     }
// }

// SenceFactory.createGun(SceneType.AK).show();
// SenceFactory.createGun(SceneType.M4A1).show();


var canvas = document.getElementById("app") as HTMLCanvasElement;
var stage = engine.run(canvas);

var scene = new GameScene();
GameScene.replaceScene(scene);
GameScene.getCurrentScene().stage = stage;
var pickscene = new UIScene();
UIScene.replaceScene(pickscene);
UIScene.getCurrentScene().gameMenu();
//this.hero = SetTriangle(0);
//UIScene.getCurrentScene().gamestart();

