<template>
  <div class="about">
    <div ref="containerRef"></div>
    <button @click="addPin">addPin</button>
    <button v-for="pin in pins" :key="pin.id" @click="removePin(pin.id)">
      remove {{ pin.id }}
    </button>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  watchEffect
} from "vue";
import mapImage from "@/assets/world-map.jpg";
import { MapView, PinBase } from "@/components/MapView.ts";

export default defineComponent({
  setup() {
    const containerRef = ref(null as HTMLElement | null);
    const map = new MapView();
    map.loadMap(mapImage);

    onMounted(() => {
      containerRef.value!.appendChild(map.view);
    });

    const state = reactive({
      pins: [] as PinBase[]
    });

    function addPin() {
      const pin: PinBase = {
        id: new Date().toISOString(),
        x: Math.random(),
        y: Math.random()
      };
      state.pins.push(pin);
      map.setPin(pin);
    }

    function removePin(id: string) {
      state.pins = state.pins.filter(pin => pin.id !== id);
      map.removePin(id);
    }

    map.pinClick.on(pin => {
      console.log(pin);
    });

    return {
      containerRef,
      ...toRefs(state),
      addPin,
      removePin
    };
  }
});
</script>