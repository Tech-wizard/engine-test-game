var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var engine;
(function (engine) {
    var DisplayObject = (function () {
        //捕获冒泡机制   通知整个父
        function DisplayObject(type) {
            this.type = "DisplayObject";
            this.x = 0;
            this.y = 0;
            this.alpha = 1;
            this.globalAlpha = 1;
            this.scaleX = 1;
            this.scaleY = 1;
            this.rotation = 0;
            this.children = [];
            this.touchListenerList = [];
            this.type = type;
            this.globalMatrix = new engine.Matrix();
            this.localMatrix = new engine.Matrix();
        }
        //abstract render(context2D: CanvasRenderingContext2D);   //模板方法模式
        DisplayObject.prototype.addEventListener = function (type, listener, useCapture) {
            if (useCapture == null) {
                useCapture = false;
            }
            var touchlistener = new engine.TouchListener(type, listener, useCapture);
            this.touchListenerList.push(touchlistener);
        };
        DisplayObject.prototype.removeEventListener = function (type, listener, useCapture) {
            if (useCapture == null) {
                useCapture = false;
            }
            var touchlistener = new engine.TouchListener(type, listener, useCapture);
            var index = this.touchListenerList.indexOf(touchlistener);
            if (index > -1) {
                this.touchListenerList.splice(index, 1);
            }
        };
        DisplayObject.prototype.dispatchEvent = function (E) {
            if (this.touchListenerList != null) {
                for (var j = 0; j < this.touchListenerList.length; j++) {
                    if (this.touchListenerList[j].type == E.type && this.touchListenerList[j].capture == true) {
                        console.log(this);
                        this.touchListenerList[j].func(E.e);
                    }
                }
                for (var j = 0; j < this.touchListenerList.length; j++) {
                    if (this.touchListenerList[j].type == E.type && this.touchListenerList[j].capture == false) {
                        console.log(this);
                        this.touchListenerList[j].func(E.e);
                    }
                }
            }
        };
        DisplayObject.prototype.update = function () {
            this.localMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
            if (this.parent) {
                this.globalMatrix = engine.matrixAppendMatrix(this.localMatrix, this.parent.globalMatrix);
            }
            else {
                this.globalMatrix = this.localMatrix;
            }
            if (this.parent) {
                this.globalAlpha = this.parent.globalAlpha * this.alpha;
            }
            else {
                this.globalAlpha = this.alpha;
            }
        };
        DisplayObject.prototype.setMatrix = function () {
            this.localMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
            if (this.parent) {
                this.globalMatrix = engine.matrixAppendMatrix(this.localMatrix, this.parent.globalMatrix);
            }
            else {
                this.globalMatrix = new engine.Matrix(1, 0, 0, 1, 0, 0);
            }
        };
        return DisplayObject;
    }());
    engine.DisplayObject = DisplayObject;
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap() {
            var _this = _super.call(this, "Bitmap") || this;
            //texture: string;
            _this._src = "";
            _this.isLoaded = false;
            _this.image = document.createElement('img');
            return _this;
            // this.image.src = ad;
            //this.isLoade = false;
        }
        Object.defineProperty(Bitmap.prototype, "src", {
            set: function (value) {
                this._src = value;
                this.isLoaded = false;
                this.width = this.image.width;
                this.height = this.image.height;
            },
            enumerable: true,
            configurable: true
        });
        Bitmap.prototype.hitTest = function (x, y) {
            var rect = new engine.Rectangle();
            rect.width = this.image.width;
            rect.height = this.image.height;
            var result = rect.isPointInReactangle(new engine.Point(x, y));
            //console.log("bitmap", rect.height, rect.width, x, y);
            if (result) {
                return this;
            }
            else {
                return null;
            }
        };
        return Bitmap;
    }(DisplayObject));
    engine.Bitmap = Bitmap;
    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            var _this = _super.call(this, "TextField") || this;
            _this.text = "";
            _this.font = "Arial";
            _this.size = "36";
            _this.fillColor = "#FFFFFF";
            _this._measureTextWidth = 0;
            return _this;
        }
        TextField.prototype.hitTest = function (x, y) {
            var rect = new engine.Rectangle();
            rect.height = parseInt(this.size);
            rect.width = this._measureTextWidth;
            var point = new engine.Point(x, y);
            //return rect.isPointInReactangle(point) ? this : null;
            //console.log("tf", rect.height, rect.width, x, y);
            if (rect.isPointInReactangle(point)) {
                return this;
            }
            else {
                return null;
            }
        };
        return TextField;
    }(DisplayObject));
    engine.TextField = TextField;
    var DisplayObjectContainer = (function (_super) {
        __extends(DisplayObjectContainer, _super);
        function DisplayObjectContainer() {
            var _this = _super.call(this, "DisplayObjectContainer") || this;
            _this.children = [];
            return _this;
        }
        DisplayObjectContainer.prototype.update = function () {
            _super.prototype.update.call(this);
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var drawable = _a[_i];
                drawable.update();
            }
        };
        DisplayObjectContainer.prototype.addChild = function (child) {
            if (this.children.indexOf(child) == -1) {
                this.children.push(child);
                child.parent = this;
            }
        };
        DisplayObjectContainer.prototype.removeChild = function (child) {
            var index = this.children.indexOf(child);
            if (index > -1) {
                this.children.splice(index, 1);
            }
        };
        DisplayObjectContainer.prototype.removeAll = function () {
            this.children = [];
        };
        DisplayObjectContainer.prototype.hitTest = function (x, y) {
            for (var i = this.children.length - 1; i >= 0; i--) {
                var child = this.children[i];
                //child.localMatrix * point;
                var point = new engine.Point(x, y);
                //console.log(x, y);
                var invertChildLocalMatrix = engine.invertMatrix(child.localMatrix);
                var pointBaseOnChild = engine.pointAppendMatrix(point, invertChildLocalMatrix);
                var HitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);
                //console.log(HitTestResult);
                if (HitTestResult) {
                    return HitTestResult;
                }
            }
        };
        return DisplayObjectContainer;
    }(DisplayObject));
    engine.DisplayObjectContainer = DisplayObjectContainer;
    // class Graphics {
    // }
    var Shape = (function (_super) {
        __extends(Shape, _super);
        function Shape() {
            var _this = _super.call(this) || this;
            _this.type = "Shape";
            _this.graphics = new Graphics();
            _this.addChild(_this.graphics);
            return _this;
        }
        return Shape;
    }(DisplayObjectContainer));
    engine.Shape = Shape;
    var Graphics = (function (_super) {
        __extends(Graphics, _super);
        function Graphics() {
            var _this = _super.call(this, "Graphics") || this;
            _this.fillColor = "#000000";
            _this.strokeColor = "#000000";
            _this.lineWidth = 1;
            _this.lineColor = "#000000";
            return _this;
        }
        Graphics.prototype.hitTest = function (x, y) {
            var rect = new engine.Rectangle();
            rect.width = this.width;
            rect.height = this.height;
            var result = rect.isPointInReactangle(new engine.Point(x, y));
            //console.log("bitmap", rect.height, rect.width, x, y);
            if (result) {
                return this;
            }
            else {
                return null;
            }
        };
        Graphics.prototype.beginFill = function (color, alpha) {
            this.fillColor = color;
            this.alpha = alpha;
        };
        Graphics.prototype.endFill = function () {
            //context2D.fill();
        };
        Graphics.prototype.drawRect = function (x1, y1, x2, y2) {
            this.transX = x1;
            this.transY = y1;
            this.width = x2;
            this.height = y2;
        };
        return Graphics;
    }(DisplayObject));
    engine.Graphics = Graphics;
    var MoveClip = (function (_super) {
        __extends(MoveClip, _super);
        function MoveClip(data) {
            var _this = _super.call(this) || this;
            _this.advancedTime = 0;
            _this.currentFraneIndex = 0;
            _this.ticker = function (deltaTime) {
                _this.advancedTime += deltaTime;
                if (_this.advancedTime >= MoveClip.FRAME_TIME * MoveClip.TOTAL_FRAME) {
                    _this.advancedTime -= MoveClip.FRAME_TIME * MoveClip.TOTAL_FRAME;
                }
                _this.currentFraneIndex = Math.floor(_this.advancedTime / MoveClip.FRAME_TIME);
                var data = _this.data;
                var frameData = data.frames[_this.currentFraneIndex];
                var url = frameData.image;
            };
            _this.setMoveClipData(data);
            _this.play();
            return _this;
        }
        MoveClip.prototype.stop = function () {
            engine.Ticker.getInstance().unregister(this.ticker);
        };
        MoveClip.prototype.pause = function () {
        };
        MoveClip.prototype.resume = function () {
        };
        MoveClip.prototype.play = function () {
            engine.Ticker.getInstance().register(this.ticker);
        };
        MoveClip.prototype.setMoveClipData = function (data) {
            this.data = data;
            this.currentFraneIndex = 0;
            // this.image = image;
            //创建 / 更新 / 调用  ---分开
        };
        return MoveClip;
    }(Bitmap));
    MoveClip.FRAME_TIME = 20;
    MoveClip.TOTAL_FRAME = 10;
    engine.MoveClip = MoveClip;
    var moveClipData = {
        name: "hero",
        frame: [
            { "image": "1.jpg" },
            { "image": "2.jpg" }
        ]
    };
})(engine || (engine = {}));
var engine;
(function (engine) {
    var Rectangle = (function () {
        function Rectangle() {
            this.x = 0;
            this.y = 0;
            this.width = 1;
            this.height = 1;
        }
        Rectangle.prototype.isPointInReactangle = function (point) {
            var rect = this;
            if (point.x < rect.width + rect.x &&
                point.y < rect.height + rect.y &&
                point.x > rect.x &&
                point.y > rect.y) {
                return true;
            }
            else {
                return false;
            }
        };
        return Rectangle;
    }());
    engine.Rectangle = Rectangle;
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    engine.Point = Point;
    function pointAppendMatrix(point, m) {
        var x = m.a * point.x + m.c * point.y + m.tx;
        var y = m.b * point.x + m.d * point.y + m.ty;
        return new Point(x, y);
    }
    engine.pointAppendMatrix = pointAppendMatrix;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m) {
        var a = m.a;
        var b = m.b;
        var c = m.c;
        var d = m.d;
        var tx = m.tx;
        var ty = m.ty;
        var determinant = a * d - b * c;
        var result = new Matrix(1, 0, 0, 1, 0, 0);
        if (determinant == 0) {
            throw new Error("no invert");
        }
        determinant = 1 / determinant;
        var k = result.a = d * determinant;
        b = result.b = -b * determinant;
        c = result.c = -c * determinant;
        d = result.d = a * determinant;
        result.tx = -(k * tx + c * ty);
        result.ty = -(b * tx + d * ty);
        return result;
    }
    engine.invertMatrix = invertMatrix;
    function matrixAppendMatrix(m1, m2) {
        var result = new Matrix();
        result.a = m1.a * m2.a + m1.b * m2.c;
        result.b = m1.a * m2.b + m1.b * m2.d;
        result.c = m2.a * m1.c + m2.c * m1.d;
        result.d = m2.b * m1.c + m1.d * m2.d;
        result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
        result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
        return result;
    }
    engine.matrixAppendMatrix = matrixAppendMatrix;
    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD = Math.PI / 180;
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        Matrix.prototype.toString = function () {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        };
        Matrix.prototype.updateFromDisplayObject = function (x, y, scaleX, scaleY, rotation) {
            this.tx = x;
            this.ty = y;
            var skewX, skewY;
            skewX = skewY = rotation / 180 * Math.PI;
            var u = Math.cos(skewX);
            var v = Math.sin(skewX);
            this.a = Math.cos(skewY) * scaleX;
            this.b = Math.sin(skewY) * scaleX;
            this.c = -v * scaleY;
            this.d = u * scaleY;
        };
        return Matrix;
    }());
    engine.Matrix = Matrix;
})(engine || (engine = {}));
// window.onload = () =>{
//     var DEG = Math.PI / 180;
//     var c = document.getElementById("myCanvas") as HTMLCanvasElement
//     var context2D = c.getContext("2d");
//     context2D.fillStyle = "FF0000";
//     var m1 = new math.Matrix(2,Math.cos(30 * DEG),Math.sin);
//    // a c tx     x   ax + cy + tx
//    // b d ty  *  y = bx + dy + ty 
//    // 0 0 1      1        1
//    `
//    2 0 100
//    0 1 0
//    0 0 1 
//    `
// //    var a = new COntainer();
// //    a.x = 100;
// //    a.scaleX = 2;
// }
var TouchEventService = (function () {
    function TouchEventService() {
        this._touchStatus = false;
        this.eventList = [];
        this.displayObjectList = [];
        this.isMove = false;
        TouchEventService.count++;
        if (TouchEventService.count > 1) {
            throw "singleton!!!";
        }
    }
    TouchEventService.getInstance = function () {
        if (TouchEventService.instance == null) {
            TouchEventService.instance = new TouchEventService();
        }
        return TouchEventService.instance;
    };
    TouchEventService.prototype.getDispalyObjectListFromMAOPAO = function (child) {
        if (child) {
            this.displayObjectList.push(child);
            this.getDispalyObjectListFromMAOPAO(child.parent);
        }
    };
    TouchEventService.prototype.getDispalyObjectListFromBUHUO = function (parent) {
        if (parent) {
            this.displayObjectList.push(parent);
            if (parent.children) {
                for (var i = 0; i < parent.children.length; i++) {
                    this.getDispalyObjectListFromBUHUO(parent.children[i]);
                }
            }
        }
    };
    return TouchEventService;
}());
TouchEventService.count = 0;
// function preOrder(node){
//              if(node){
//                  arr.push(node);
//                  preOrder(node.firstElementChild);
//                  preOrder(node.lastElementChild);
//              }
//          }
var engine;
(function (engine) {
    var TouchListener = (function () {
        function TouchListener(type, func, useCapture) {
            this.capture = false;
            this.type = type;
            this.func = func;
            this.capture = useCapture || false;
        }
        return TouchListener;
    }());
    engine.TouchListener = TouchListener;
    var TouchEvent = (function () {
        function TouchEvent() {
        }
        return TouchEvent;
    }());
    engine.TouchEvent = TouchEvent;
})(engine || (engine = {}));
var engine;
(function (engine) {
    var res;
    (function (res) {
        var ImageProcessor = (function () {
            function ImageProcessor() {
            }
            ImageProcessor.prototype.load = function (url, callback) {
                var image = document.createElement("img");
                image.src = url;
                image.onload = function () {
                    callback();
                };
            };
            return ImageProcessor;
        }());
        res.ImageProcessor = ImageProcessor;
        var TextProcessor = (function () {
            function TextProcessor() {
            }
            TextProcessor.prototype.load = function (url, callback) {
                var xhr = new XMLHttpRequest();
                xhr.open("get", url);
                xhr.send();
                xhr.onload = function () {
                    callback(xhr.responseText);
                };
            };
            return TextProcessor;
        }());
        res.TextProcessor = TextProcessor;
        function mapTypeSelector(typeSelector) {
            getTypeByURL = typeSelector;
        }
        res.mapTypeSelector = mapTypeSelector;
        var cache = {};
        function load(url, callback) {
            var type = getTypeByURL(url);
            var processor = createProcessor(type);
            if (processor != null) {
                processor.load(url, function (data) {
                    cache[url] = data;
                    callback(data);
                });
            }
        }
        res.load = load;
        function get(url) {
            return cache[url];
        }
        res.get = get;
        var getTypeByURL = function (url) {
            if (url.indexOf(".jpg") >= 0) {
                return "image";
            }
            else if (url.indexOf(".mp3") >= 0) {
                return "sound";
            }
            else if (url.indexOf(".json") >= 0) {
                return "text";
            }
        };
        var hashMap = {
            "image": new ImageProcessor(),
            "text": new TextProcessor()
        };
        function createProcessor(type) {
            var processor = hashMap[type];
            return processor;
        }
        function map(type, processor) {
            hashMap[type] = processor;
        }
        res.map = map;
    })(res = engine.res || (engine.res = {}));
})(engine || (engine = {}));
var engine;
(function (engine) {
    var res;
    (function (res) {
        var __cache = {};
        function loadConfig() {
        }
        res.loadConfig = loadConfig;
        function loadRes(name) {
            var resource = getRes(name);
            resource.load();
        }
        res.loadRes = loadRes;
        function getRes(name) {
            if (__cache[name]) {
                return __cache[name];
            }
            else {
                __cache[name] = new ImageResource(name);
                return __cache[name];
            }
        }
        res.getRes = getRes;
        var ImageResource = (function () {
            function ImageResource(name) {
                this.bitmapData = document.createElement("img");
                this.bitmapData.src = "loading.png";
            }
            ImageResource.prototype.load = function () {
                var _this = this;
                var realResource = document.createElement("img");
                realResource.src = this.url;
                realResource.onload = function () {
                    _this.bitmapData = realResource;
                };
            };
            return ImageResource;
        }());
        res.ImageResource = ImageResource;
    })(res = engine.res || (engine.res = {}));
})(engine || (engine = {}));
var engine;
(function (engine) {
    var Ticker = (function () {
        function Ticker() {
            this.listeners = [];
            // setTimeout(){}
            // setInterval(){}
        }
        Ticker.getInstance = function () {
            if (!Ticker.instance) {
                Ticker.instance = new Ticker();
            }
            return Ticker.instance;
        };
        Ticker.prototype.register = function (listener) {
            this.listeners.push(listener);
        };
        Ticker.prototype.unregister = function (listener) {
            var index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
        Ticker.prototype.notify = function (deltaTime) {
            for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(deltaTime);
            }
        };
        return Ticker;
    }());
    engine.Ticker = Ticker;
})(engine || (engine = {}));
var engine;
(function (engine) {
    engine.run = function (canvas) {
        var stage = new engine.DisplayObjectContainer();
        var context2D = canvas.getContext("2d");
        //let context2D = Factory.create();
        var lastNow = Date.now();
        var renderer = new CanvasRenderer(stage, context2D);
        var frameHandler = function () {
            var now = Date.now();
            var deltaTime = now - lastNow;
            engine.Ticker.getInstance().notify(deltaTime);
            // context2D.setTransform(1,0,0,1,0,0)
            context2D.clearRect(0, 0, canvas.width, canvas.height);
            context2D.save();
            renderer.render();
            stage.update();
            context2D.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        };
        window.requestAnimationFrame(frameHandler);
        window.onmousedown = function (e) {
            var x = e.offsetX - 3;
            var y = e.offsetY - 3;
            var result = stage.hitTest(x, y);
            var target = result;
            var list = [];
            list.push(result);
            if (result && result.touchEnabled == true) {
                while (result.parent) {
                    list.push(result.parent);
                    result = result.parent;
                }
                for (var i = list.length - 1; i > 0; i--) {
                    var type = "mousedown";
                    var currentTarget = result.parent;
                    var E = { type: type, target: target, currentTarget: currentTarget, e: e };
                    list[i].dispatchEvent(E);
                }
                for (var i = 0; i < list.length; i++) {
                    var type = "mousedown";
                    var currentTarget = result.parent;
                    var E = { type: type, target: target, currentTarget: currentTarget, e: e };
                    list[i].dispatchEvent(E);
                }
            }
        };
        window.onmouseup = function (e) {
            var x = e.offsetX - 3;
            var y = e.offsetY - 3;
            var result = stage.hitTest(x, y);
            var target = result;
            var list = [];
            list.push(result);
            if (result && result.touchEnabled == true) {
                while (result.parent) {
                    list.push(result.parent);
                    result = result.parent;
                }
                for (var i = list.length - 1; i > 0; i--) {
                    var type = "mouseup";
                    var currentTarget = result.parent;
                    var E = { type: type, target: target, currentTarget: currentTarget, e: e };
                    list[i].dispatchEvent(E);
                }
                for (var i = 0; i < list.length; i++) {
                    var type = "mouseup";
                    var currentTarget = result.parent;
                    var E = { type: type, target: target, currentTarget: currentTarget, e: e };
                    list[i].dispatchEvent(E);
                }
            }
        };
        window.onmousemove = function (e) {
            var x = e.offsetX - 3;
            var y = e.offsetY - 3;
            // TouchEventService.getInstance().currentX = x;
            // TouchEventService.getInstance().currentY = y;
            var result = stage.hitTest(x, y);
            var target = result;
            var list = [];
            list.push(result);
            if (result && result.touchEnabled == true) {
                while (result.parent) {
                    list.push(result.parent);
                    result = result.parent;
                }
                for (var i = list.length - 1; i > 0; i--) {
                    var type = "mousemove";
                    var currentTarget = result.parent;
                    var E = { type: type, target: target, currentTarget: currentTarget, e: e };
                    list[i].dispatchEvent(E);
                }
                for (var i = 0; i < list.length; i++) {
                    var type = "mousemove";
                    var currentTarget = result.parent;
                    var E = { type: type, target: target, currentTarget: currentTarget, e: e };
                    list[i].dispatchEvent(E);
                }
            }
        };
        return stage;
    };
    var CanvasRenderer = (function () {
        function CanvasRenderer(stage, context2D) {
            this.stage = stage;
            this.context2D = context2D;
        }
        CanvasRenderer.prototype.render = function () {
            var stage = this.stage;
            var context2D = this.context2D;
            this.renderContainer(stage);
        };
        CanvasRenderer.prototype.renderContainer = function (container) {
            for (var _i = 0, _a = container.children; _i < _a.length; _i++) {
                var child = _a[_i];
                var context2D = this.context2D;
                context2D.globalAlpha = child.globalAlpha;
                var m = child.globalMatrix;
                context2D.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                if (child.type == "Bitmap") {
                    this.renderBitmap(child);
                }
                else if (child.type == "TextField") {
                    this.renderTextField(child);
                }
                else if (child.type == "Shape") {
                    this.renderShape(child);
                }
                else if (child.type == "DisplayObjectContainer") {
                    this.renderContainer(child);
                }
            }
        };
        CanvasRenderer.prototype.renderBitmap = function (bitmap) {
            var _this = this;
            this.context2D.globalAlpha = bitmap.alpha;
            if (bitmap.isLoaded) {
                this.context2D.drawImage(bitmap.image, 0, 0, bitmap.width, bitmap.height);
            }
            else {
                bitmap.image.src = bitmap._src;
                bitmap.image.onload = function () {
                    _this.context2D.drawImage(bitmap.image, 0, 0, bitmap.width, bitmap.height);
                    bitmap.isLoaded = true;
                };
            }
        };
        CanvasRenderer.prototype.renderTextField = function (textField) {
            this.context2D.font = textField.size + "px " + textField.font;
            this.context2D.globalAlpha = textField.alpha;
            this.context2D.fillStyle = textField.fillColor;
            this.context2D.fillText(textField.text, 0, parseInt(textField.size));
            textField._measureTextWidth = this.context2D.measureText(textField.text).width; //180
        };
        CanvasRenderer.prototype.renderShape = function (shape) {
            //context2D.fillStyle = "#FFAAAA";     
            this.context2D.fillStyle = 'rgba(0, 0, 0, ' + shape.graphics.alpha + ')';
            // 'rgba(192, 80, 77, 0.7)'; 
            this.context2D.fillRect(shape.graphics.transX, shape.graphics.transY, shape.graphics.width, shape.graphics.height);
            //context2D.fill();
        };
        return CanvasRenderer;
    }());
})(engine || (engine = {}));
// window.onload = () => {
//     var canvas = document.getElementById("app") as HTMLCanvasElement;
//     var context2D = canvas.getContext("2d");
//     var DEG = Math.PI / 180;
//     var m1 = new math.Matrix(2,Math.cos(30 * DEG),Math.sin);
//    // a c tx     x   ax + cy + tx
//    // b d ty  *  y = bx + dy + ty 
//    // 0 0 1      1        1
//    `
//    2 0 100
//    0 1 0
//    0 0 1 
//    `
// //    a.x = 100;
// //    a.scaleX = 2;
// let lastNow = Date.now();
// let frameHandler = () => {
//     console.log("111");
//     let now = Date.now();
//     let deltaTime = lastNow - now;
//     Ticker.getInstance().notify(deltaTime);
//     context2D.save();
//     context2D.setTransform(1, 0, 0, 1, 0, 0);
//     context2D.clearRect(0, 0, canvas.width, canvas.height);
//     //stage.updateMatrix();//3d引擎需要分开
//     stage.draw(context2D);
//     context2D.restore();
//     lastNow = now;
//     window.requestAnimationFrame(frameHandler);
// }
// window.requestAnimationFrame(frameHandler);
// let speed = 10;
// Ticker.getInstance().register((deltaTime) => {
// Button.transX = speed * deltaTime;
// // h = 1/2 * g * t * t;//Tween
// // s+=1;   //新手
// // v = g * deltaTime;
// // s= s0 + v *deltaTime; //入门
// // for(let i = 0;i<deltaTime/10;i++){  //切片
// //     doit(10);
// // }
// // function doit(deltaTime){
// //    v = g * deltaTime;
// // s= s0 + v *deltaTime;   
// // }
// });
// setInterval(() => {
//     context2D.save();
//     context2D.setTransform(1, 0, 0, 1, 0, 0);
//     context2D.clearRect(0, 0, canvas.width, canvas.height);
//     stage.draw(context2D);
//     context2D.restore();
// }, 60) 
