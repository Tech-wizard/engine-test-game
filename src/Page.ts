// interface State {

//     onEnter();

//     onExit();
// }

// abstract class AbstractPage  extends engine.DisplayObjectContainer implements State {  //egret.Sprite


//     onEnter() {

//     }

//     onExit() {

//     }
// }


// class PageContainer extends engine.DisplayObjectContainer {

//     private _pageList: AbstractPage[] = [];

//     private _currentIndex = 0;

//     private _touchBeginLocationY = 0;

//     private _touchDistance = 0;

//     private static HEIGHT = 1136;

//     constructor() {
//         super();
//         this.addListener();
//         this.touchEnabled = true;

//         this._pageList = [new FirstPage(), new SecondPage(), new ThirdPage()];
//         this.updatePagePosition();
//         this.updatePageDepth();
//         this._pageList[0].onEnter();

//     }

//     private addListener() {
//         this.addEventListener(engine.TouchEvent.TOUCH_BEGIN, (e: MouseEvent) => {
//             this._touchBeginLocationY = e.offsetY;
//             this.addEventListener(engine.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler);
//         });

//         this.addEventListener(engine.TouchEvent.TOUCH_END, (e) => {
//             this.removeEventListener(engine.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler);
//             this.onTouchEndHandler(e);
//         });
//     }

//     private onTouchEndHandler(e: engine.TouchEvent) {

//         var currentPage = this._pageList[this._currentIndex];
//         var nextPage = this._pageList[this._currentIndex + 1];
//         var prevPage = this._pageList[this._currentIndex - 1];

//         if (this._touchDistance <= -PageContainer.HEIGHT / 2 && nextPage) {
//             engine.Tween.get(currentPage).to({ y: -PageContainer.HEIGHT }, 300).call(() => {
//                 this.updatePagePosition();
//                 this.changePage("next");
//                 this.updatePageDepth();
//             }, this).addEventListener("change", () => {
//                 this.updatePagePosition();
//             }, this)
//         }
//         else if (this._touchDistance >= PageContainer.HEIGHT / 2 && prevPage) {
//             engine.Tween.get(currentPage).to({ y: PageContainer.HEIGHT }, 300).call(() => {
//                 this.updatePagePosition();
//                 this.changePage("prev");
//                 this.updatePageDepth();
//             }, this).addEventListener("change", () => {
//                 this.updatePagePosition();
//             }, this)
//         }
//         else {
//             engine.Tween.get(currentPage).to({ y: 0 }, 300).call(() => {
//                 this.updatePagePosition();
//             }, this).addEventListener("change", () => {
//                 this.updatePagePosition();
//             }, this)
//         }
//     }

//     private onTouchMoveHandler(e: MouseEvent) {
//         var currentPage = this._pageList[this._currentIndex];
//         this._touchDistance = e.offsetY - this._touchBeginLocationY;
//         currentPage.y = this._touchDistance;
//         this.updatePagePosition();
//     }

//     private updatePageDepth() {
//         var currentPage = this._pageList[this._currentIndex];
//         var prevPage = this._pageList[this._currentIndex - 1];
//         var nextPage = this._pageList[this._currentIndex + 1];
//         this.removeAll();
//         if (prevPage) {
//             this.addChild(prevPage);
//         }
//         this.addChild(currentPage);
//         if (nextPage) {
//             this.addChild(nextPage);
//         }
//     }

//     private updatePagePosition() {
//         var currentPage = this._pageList[this._currentIndex];
//         var prevPage = this._pageList[this._currentIndex - 1];
//         if (prevPage) {
//             prevPage.y = currentPage.y - PageContainer.HEIGHT;
//         }
//         var nextPage = this._pageList[this._currentIndex + 1];
//         if (nextPage) {
//             nextPage.y = currentPage.y + PageContainer.HEIGHT;
//         }
//     }

//     changePage(mode: "next" | "prev") {
//         var currentPage = this._pageList[this._currentIndex];
//         var prevPage = this._pageList[this._currentIndex - 1];
//         var nextPage = this._pageList[this._currentIndex + 1];
//         if (mode == "next") {
//             currentPage.onExit();
//             this._currentIndex++;
//             nextPage.onEnter();
//         }
//         else if (mode == "prev") {
//             currentPage.onExit();
//             this._currentIndex--;
//             prevPage.onEnter();
//         }
//     }
// }


// class FirstPage extends AbstractPage {

//     private textField: engine.TextField;

//     constructor() {
//         super();
//         var BlackMask = new engine.Shape();
//         BlackMask.graphics.beginFill(0x000000, 1);
//         BlackMask.graphics.drawRect(0, 0, 640, 1136);
//         BlackMask.graphics.endFill();
//         this.addChild(BlackMask);
//     }


//     onEnter() {
//         this.textField = new engine.TextField();
//         this.textField.text = "        随着探索的深入，人们发现量子效应只是物质之海表面的涟漪，是物质更深层规律扰动的影子。当这些规律渐渐明朗时，在量子力学中飘忽不定的实在图象再次稳定下来，确定值重新代替了概率，新的宇宙模型中，本认为已经消失了的因果链再次浮动并清晰起来。\n物理学在近年来连续地大突破，很象上世纪初的那阵儿，现在，只要给定边界条件，我们就可以拨开量子效应的迷雾，准确地预测单个或一群基本粒子的运动和演化。注意我说的一群，如果群里粒子的数量足够大它就构成了一个宏观物体，也就是说我们现在可以在原子级别上建立一个宏观物体的数学模型。这种模型被称为镜象模拟，因为它能已百分之百的准确再现模拟对象的宏观过程，因为宏观模拟对象建立了一个数字镜象。打个比方吧：如果用镜象模拟方式为一个鸡蛋建立数学模型，也就是将组成鸡蛋的每一个原子的状态都输入模拟的数据库，当这个模型在计算机中运行时，如果给出的边界条件合适，内存中的那个虚拟鸡蛋就会孵出小鸡来，而且内存中的虚拟小鸡，与现实中的那个鸡蛋孵出的小鸡一模一样，连每一根毛尖都不差一丝一毫！你往下想如果这个模拟目标比鸡蛋在大些呢？大到一棵树，一个人，很多人；大到一座城市，一个国家，甚至大到整个地球？我是一个狂想爱好者，热衷于在想象中大一切都推向终极，这就让我想到，如果镜象模拟的对象是整个宇宙会怎么样？！想想，整个宇宙！奶奶的，在一个计算机内存中运行的宇宙！从诞生到毁灭……”    ——刘慈欣《镜子》\n        我是一名疯狂科学家，我借助超弦计算机达到了模拟宇宙的程序，我称之为创世游戏，在原子级别模拟整个宇宙。超弦计算机具有终极容量，为这种模拟运算提供了硬件基础，对宇宙的镜象模拟必须从某个初始状态开始，也就是说，要在模拟开始时是某个时间断面上，将宇宙的全部原子状态一个一个地输入计算机，在原子级别上构建一个初始宇宙模型。正好存在着那样一个时间断面，宇宙是十分简单的，甚至比鸡蛋和细菌都简单，比现实中最简单的东西都简单，因为它那时的原子数是零，没有大小，没有结构。这就是大爆炸奇点。超弦理论已经建立了完善的奇点模型，我们只需要将这个模型用软件实现，输入计算机运算就可以了.\n        超弦计算机的主机其实只有一个烟盒大小，但原子电路需要在超低温下运行，所以主机浸在这个绝热容器里的液氮中。我将液晶显示器支起来，动了一下鼠标，处于休眠状态的超弦计算机立刻苏醒过来，液晶屏亮起来，象睁开了一只惺忪的睡眼，显示出一个很简单的界面，仅由一个下拉文本框和一个小小的标题组成，标题是：请选择创世启暴参数：";
//         this.addChild(this.textField);
//         this.textField.size = '24';
//         this.textField.y = 40;
//         this.textField.x = 20;
//         this.textField.width = 620;
//         //this.textField.textAlign = engine.HorizontalAlign.CENTER;
//     }

//     onExit() {
//         this.removeChild(this.textField);
//     }

// }

// class SecondPage extends AbstractPage {
//     private textField: engine.TextField;
//     constructor() {
//         super();
//         var rect = new engine.Shape();
//         rect.graphics.beginFill(0x000000, 1);
//         rect.graphics.drawRect(0, 0, 640, 1136);
//         rect.graphics.endFill();
//         this.addChild(rect);
//         this.textField = new engine.TextField();
//         this.textField.text = "    我们点了一下文本框旁边的箭头，下啦出一行行数据组，每组有十几个数据项，各行看上去差别很大，“奇点的性质由十八个参数确定，参数组合原则上是无限的，但根据超弦理论的推断，能够产生创世爆炸的参数组是有限的，但由多少组还是个迷。这里显示的只是其中的一小部分，我们随便选一组吧。”\n选中一组参数后，屏幕立刻变成了乳白色，正中凸现了两个醒目的大按纽：\n     “引爆 取消 ”  点了引爆按纽，屏幕上只剩一片乳白，“这白色象征虚无，这里没有空间，时间也还没有开始，什么都没有。”\n        屏幕左下角出现了一个红色数字“0”\n这个数字是宇宙演化的时间，0的出现说明奇点已经生成，它没有大小，所以我们看不到。\n       红色数字开始飞快增长。\n       屏幕中央出现了一个兰色的小点，很快增大为一个球体，发出耀眼的蓝光。球体急剧膨胀，很快占满整个屏幕，软件将视野拉远，球体重新缩为遥远处的一点，但爆炸中的宇宙很快又充满了整个屏幕。这个过程反复重复着，频率很快，仿佛是一手宏伟乐曲的节拍。\n      宇宙现在正处于暴胀阶段，它的膨胀速度远远超过光速。\n    随着球体膨胀速度的降低，视野拉开的频率渐渐慢了下来，随着能量密度的降低，球体的颜色由蓝向黄渐变，后来宇宙的色彩在红色上固定了下来，并渐渐变暗，屏幕上视野不再拉远，变成黑色的球体在屏幕上很缓慢地膨胀着。\n      好，现在踞大爆炸已经一百亿年了，这个宇宙处于稳定的演化阶段，我们进去看看吧。\n       宇宙呈现一个无际的黑色平面，有无数银光闪闪的直线与黑的平面垂直相交。这个宇宙维数比我们的低，是个二点五维的宇宙。\n       看这个黑色没有厚度的二维平面就是这个宇宙的太空，直径约500亿光年；那些与平面垂直的亮线就是太空中的恒星，她们都有几亿光年长，但无限细，只有一维。分数维的宇宙很少见，我要把这组创世参数记下来。\n     等下，更有意思的事情发生了，探测器显示这个宇宙里可能存在二维形式的生命活动，我们顺着时空预览图像的信息，将时间轴再向后点了一点，几十亿年的跨度，波澜壮阔的几何世界在眼前展开，二维智慧生命的发展速度领我感到震惊。让我们来见识一下这二维宇宙里的纷争与演变吧。我点下了追踪键，视角不断下沉。";
//         this.addChild(this.textField);
//         this.textField.size = '24';
//         this.textField.y = 40;
//         this.textField.x = 20;
//         this.textField.width = 620;
//     }

//     onEnter() {

//     }

//     onExit() {

//     }

// }

// class ThirdPage extends AbstractPage {

//     private textField: engine.TextField;
//     private back: engine.TextField = new engine.TextField();
//     constructor() {
//         super();
//         var rect = new engine.Shape();
//         rect.graphics.beginFill(0x000000, 1);
//         rect.graphics.drawRect(0, 0, 640, 1136);
//         rect.graphics.endFill();
//         this.addChild(rect);
//         this.textField = new engine.TextField();
//         this.textField.text = " 这是一个战争年代，二维的争端与纷乱并不比人类的世界暴力血腥，因为二维生命的寿命和坚韧程度相比较于人类（假如不同维度的宇宙的时间可以比较的话）近乎于无穷，二维间的战斗，建立于互相改变二维生命的几何形状为手段，以改变对方的几何形态（意识形态？）为目的，似乎并不像人类涉及到生命的毁灭与残酷的破坏，可能二维生命的智能比我预想的要高不少（有自我意识，有社会分级），这也更加提起了我的兴趣。借由控制台程序，我选择了一些有特征的创造二维世界历史的个体的视角来进行观测。\n      由于对于二维生命没有发现和能识别的有声以及文字语言（？），作为mad scientist的我将用春秋笔法客观的记下我认为的发生了的一切。\n      战争的分歧来自于几何形态的不同，以对称多边形和椭圆为代表的纯形派与其他不规则的几何图形所代表的混沌派产生了愈演愈烈的冲突，两方之间亿万的大小不一的二维生物从出生到漫长的岁月死亡都一直不断的相互厮打着，碰撞着。由于战争不断，多数图形的形状越来越扭曲，混乱，这对于混沌派来讲再好不过了，随着战线的近乎无限的延长，混沌派的以指数增长转换着纯形派的战士。无数规则的形状不再规则，转而投向敌营。在面对敌人压倒性的优势下，纯形派并不退缩，在战时全力推动着二维世界的军事科技为第一目标，由极大大数量级的个纯形的错落缺坚固的排列与不以混沌方式的挤压而组成的“城墙”为最后一道防线，坚守着自己的阵地。亘古的时间长河流淌到近乎干涸的时候，改变局势的个体终于出现了。\n        不知是生来还是后天挤压而形成的纯正形状出现了，扭转形势的纯正几何攻击在战场上近乎于战神的存在，分别是等边三角形，正方形，圆，已三种不同的几何力量矫正了所有二维生物于纯形，二维宇宙迎来了新的时代，纯形的规律决定了最小量级下物质的形状。";
//         this.addChild(this.textField);
//         this.textField.size = '24';
//         this.textField.y = 40;
//         this.textField.x = 20;
//         this.textField.width = 620;
//     }


//     onEnter() {

//         this.back.text = "返回";
//         this.back.size = '30';
//         this.back.touchEnabled = true;
//         this.back.y = 900;
//         this.back.x = 300;
//         this.addChild(this.back);
//         this.back.addEventListener(engine.TouchEvent.TOUCH_TAP, () => {
//             GameScene.getCurrentScene().stage.removeAll();
//             UIScene.getCurrentScene().gameMenu();
//         })
//     }

//     onExit() {

//     }

// }