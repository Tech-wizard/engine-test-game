declare namespace engine {
    interface RenderContext {
        drawImage(): any;
        filltext(): any;
        setTransform(): any;
        globalAphla: number;
    }
    interface Drawable {
        update(): any;
    }
    interface Event {
        addEventListener(type: string, listener: Function, useCapture?: boolean): any;
        dispatchEvent(e: MouseEvent): any;
    }
    abstract class DisplayObject {
        type: string;
        x: number;
        y: number;
        alpha: number;
        globalAlpha: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        parent: DisplayObjectContainer;
        children: DisplayObject[];
        globalMatrix: engine.Matrix;
        localMatrix: engine.Matrix;
        touchEnabled: boolean;
        touchListenerList: TouchListener[];
        constructor(type: string);
        abstract hitTest(x: number, y: number): any;
        addEventListener(type: string, listener: Function, useCapture?: boolean): void;
        removeEventListener(type: string, listener: Function, useCapture?: boolean): void;
        dispatchEvent(E: any): void;
        update(): void;
        setMatrix(): void;
    }
    class Bitmap extends DisplayObject implements Drawable {
        image: HTMLImageElement;
        width: number;
        height: number;
        _src: string;
        isLoaded: boolean;
        constructor();
        src: string;
        hitTest(x: number, y: number): this;
    }
    class TextField extends DisplayObject implements Drawable {
        text: string;
        font: string;
        size: string;
        fillColor: string;
        width: any;
        height: any;
        _measureTextWidth: number;
        constructor();
        hitTest(x: number, y: number): this;
    }
    class DisplayObjectContainer extends DisplayObject implements Drawable {
        children: DisplayObject[];
        constructor();
        update(): void;
        addChild(child: DisplayObject): void;
        removeChild(child: DisplayObject): void;
        removeAll(): void;
        hitTest(x: number, y: number): any;
    }
    class Shape extends DisplayObjectContainer {
        graphics: Graphics;
        constructor();
    }
    class Graphics extends DisplayObject {
        fillColor: string;
        strokeColor: string;
        lineWidth: number;
        lineColor: string;
        width: any;
        height: any;
        transX: any;
        transY: any;
        constructor();
        hitTest(x: number, y: number): this;
        beginFill(color: string, alpha: any): void;
        endFill(): void;
        drawRect(x1: any, y1: any, x2: any, y2: any): void;
    }
    class MoveClip extends Bitmap {
        private advancedTime;
        private static FRAME_TIME;
        private static TOTAL_FRAME;
        private currentFraneIndex;
        private data;
        constructor(data: engine.MovieClipData);
        ticker: (deltaTime: any) => void;
        stop(): void;
        pause(): void;
        resume(): void;
        play(): void;
        setMoveClipData(data: engine.MovieClipData): void;
    }
    type MovieClipData = {
        name: string;
        frames: MovieClipFrameData[];
    };
    type MovieClipFrameData = {
        "image": string;
    };
}
declare namespace engine {
    class Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
        isPointInReactangle(point: Point): boolean;
    }
    class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }
    function pointAppendMatrix(point: Point, m: Matrix): Point;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m: Matrix): Matrix;
    function matrixAppendMatrix(m1: Matrix, m2: Matrix): Matrix;
    class Matrix {
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        toString(): string;
        updateFromDisplayObject(x: number, y: number, scaleX: number, scaleY: number, rotation: number): void;
    }
}
declare class TouchEventService {
    private static instance;
    private static count;
    _touchStatus: boolean;
    eventList: MouseEvent[];
    displayObjectList: engine.DisplayObject[];
    currentX: number;
    currentY: number;
    endX: number;
    endY: number;
    isMove: boolean;
    constructor();
    static getInstance(): TouchEventService;
    getDispalyObjectListFromMAOPAO(child: engine.DisplayObject): void;
    getDispalyObjectListFromBUHUO(parent: engine.DisplayObject): void;
}
declare namespace engine {
    class TouchListener {
        type: string;
        func: Function;
        capture: boolean;
        constructor(type: string, func: Function, useCapture?: boolean);
    }
    class TouchEvent {
        static TOUCH_MOVE: "touchMove";
        static TOUCH_BEGIN: "touchBegin";
        static TOUCH_END: "mouseup";
        static TOUCH_CANCEL: "touchCancel";
        static TOUCH_TAP: "mousedown";
    }
}
declare namespace engine.res {
    interface Processor {
        load(url: string, callback: Function): void;
    }
    class ImageProcessor implements Processor {
        load(url: string, callback: Function): void;
    }
    class TextProcessor implements Processor {
        load(url: string, callback: Function): void;
    }
    function mapTypeSelector(typeSelector: (url: string) => string): void;
    function load(url: string, callback: (data: any) => void): void;
    function get(url: string): any;
    function map(type: string, processor: Processor): void;
}
declare namespace engine.res {
    function loadConfig(): void;
    function loadRes(name: any): void;
    function getRes(name: string): any;
    class ImageResource {
        private url;
        constructor(name: string);
        load(): void;
        bitmapData: HTMLImageElement;
        width: number;
        height: number;
    }
}
declare namespace engine {
    type Ticker_Listener_Type = (deltaTime: number) => void;
    class Ticker {
        static instance: Ticker;
        static getInstance(): Ticker;
        listeners: Ticker_Listener_Type[];
        register(listener: Ticker_Listener_Type): void;
        unregister(listener: Ticker_Listener_Type): void;
        notify(deltaTime: number): void;
    }
}
declare namespace engine {
    let run: (canvas: HTMLCanvasElement) => DisplayObjectContainer;
}
declare namespace Factory {
}
