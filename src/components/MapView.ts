import * as PIXI from "pixi.js";
import { EventDispatcher } from "@/EventDispatcher";
const viewWidth = 800;
const viewHeight = 600;
export interface PinBase {
  id: string;
  x: number;
  y: number;
}

export class MapView<TPin extends PinBase> {
  private app: PIXI.Application;
  private mapSprite: PIXI.Sprite | null = null;
  private pins: Map<string, PIXI.DisplayObject> = new Map();
  private mapScales: number[] | null = null;
  public get view() {
    return this.app.view;
  }

  public pinClick = new EventDispatcher<TPin>();

  constructor() {
    this.app = new PIXI.Application({
      width: viewWidth,
      height: viewHeight,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
    });

    this.app.view.addEventListener("wheel", (e) => {
      if (!this.mapSprite || !this.mapScales) return;
      const originScaleIndex = this.mapScales.indexOf(this.mapSprite.scale.x);
      if (e.deltaY > 0 && originScaleIndex < this.mapScales.length - 1) {
        this.mapSprite.scale.set(this.mapScales[originScaleIndex + 1]);
      } else if (e.deltaY < 0 && originScaleIndex > 0) {
        this.mapSprite.scale.set(this.mapScales[originScaleIndex - 1]);
      }
    });
  }

  loadMap(
    mapImage:
      | string
      | HTMLImageElement
      | HTMLCanvasElement
      | HTMLVideoElement
      | PIXI.BaseTexture
  ) {
    const texture = PIXI.Texture.from(mapImage);
    const mapSprite = new PIXI.Sprite(texture);

    const defaultScale = viewWidth / texture.width;
    this.mapScales = [defaultScale, defaultScale * 1.5, defaultScale * 2];
    mapSprite.scale.set(defaultScale);
    mapSprite.interactive = true;
    mapSprite.buttonMode = true;

    let draggingData: PIXI.InteractionData | null = null;
    let cursorStartPosition: { x: number; y: number } | null = null;
    let mapStartPosition: { x: number; y: number } | null = null;

    function dragStart(event: PIXI.InteractionEvent) {
      draggingData = event.data;
      const mousePosition = draggingData.getLocalPosition(mapSprite.parent);
      if (!cursorStartPosition) {
        cursorStartPosition = {
          x: mousePosition.x,
          y: mousePosition.y,
        };
      }
      if (!mapStartPosition) {
        mapStartPosition = {
          x: mapSprite.x,
          y: mapSprite.y,
        };
      }
    }

    function dragEnd() {
      draggingData = null;
      cursorStartPosition = null;
      mapStartPosition = null;
    }

    function dragMove() {
      if (!draggingData || !mapStartPosition) return;
      const mousePosition = draggingData.getLocalPosition(mapSprite.parent);
      mapSprite.x =
        mapStartPosition.x + mousePosition.x - cursorStartPosition!.x;
      mapSprite.y =
        mapStartPosition.y + mousePosition.y - cursorStartPosition!.y;
    }

    mapSprite
      .on("pointerdown", dragStart)
      .on("pointerup", dragEnd)
      .on("pointerupoutside", dragEnd)
      .on("pointermove", dragMove)
      .on("scroll", (e: any) => {
        console.log(e);
      });

    if (this.mapSprite) this.app.stage.removeChild(this.mapSprite);
    this.mapSprite = mapSprite;
    this.app.stage.addChild(this.mapSprite);
  }

  setPin(input: TPin) {
    this.removePin(input.id);
    const pin = new PIXI.Graphics();
    pin.lineStyle(0);
    pin.beginFill(0xde3249, 1);
    pin.drawCircle(input.x * viewWidth, input.y * viewHeight, 10);
    pin.endFill();
    pin.interactive = true;
    pin.buttonMode = true;
    pin.on("pointerdown", () => {
      this.pinClick.trigger(input);
    });
    this.mapSprite?.addChild(pin);
    this.pins.set(input.id, pin);
  }
  removePin(id: string) {
    const oldPin = this.pins.get(id);
    if (oldPin) {
      this.mapSprite?.removeChild(oldPin);
    }
  }
}
