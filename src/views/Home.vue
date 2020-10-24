<template>
  <div class="home">
    <div ref="appendPoint"></div>
    <input type="number" v-model="x" step="10" />
    <input type="number" v-model="y" step="10" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  toRefs,
  watch,
  watchEffect
} from "vue";
import * as PIXI from "pixi.js";
import mapImage from "@/assets/world-map.jpg";

export default defineComponent({
  name: "Home",
  components: {},
  setup() {
    const state = reactive({
      x: 100,
      y: 100
    });

    const appendPoint = ref(null as HTMLElement | null);
    const viewWidth = 800;
    const viewHeight = 600;
    const app = new PIXI.Application({
      width: viewWidth,
      height: viewHeight,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1
    });
    const container = new PIXI.Container();
    app.stage.addChild(container);
    const texture = PIXI.Texture.from(mapImage);
    const mapSprite = new PIXI.Sprite(texture);

    mapSprite.width = viewWidth * 0.9;
    mapSprite.height = viewHeight * 0.9;
    mapSprite.anchor.set(0.5);
    mapSprite.x = viewWidth / 2;
    mapSprite.y = viewHeight / 2;
    container.addChild(mapSprite);

    const dot = new PIXI.Graphics();
    dot.lineStyle(0);
    dot.beginFill(0xde3249, 1);
    dot.drawCircle(state.x, state.y, 10);
    dot.endFill();
    dot.interactive = true;
    dot.buttonMode = true;
    
    
    dot.on("pointerdown",(e:PIXI.InteractionEvent)=>{
      console.log("pointerdown!")
    })

    app.stage.addChild(dot);

    watchEffect(() => {
      dot.x = state.x;
      dot.y = state.y;
    });

    onMounted(() => {
      appendPoint.value!.appendChild(app.view);
    });
    return {
      appendPoint,
      ...toRefs(state)
    };
  }
});
</script>
