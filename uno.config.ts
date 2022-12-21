import presetRemToPx from "@unocss/preset-rem-to-px";
import presetWeapp from "unocss-preset-weapp";
import { defineConfig, presetAttributify, presetIcons, presetUno } from "unocss";
import type { Preset, UserConfig } from "unocss";

// import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
// const iconDirectory = resolve(__dirname, 'icons')

export function createUnoCSSConfig(): UserConfig {
  return defineConfig({
    presets: [
      presetWeapp() as Preset,
      presetUno(),
      presetAttributify(),
      presetIcons({
        extraProperties: {
          display: "inline-block",
          "vertical-align": "middle",
          "font-size": "16px",
        },
        // collections: {
        //   custom: FileSystemIconLoader(iconDirectory),
        // },
      }),
      presetRemToPx({
        baseFontSize: 4,
      }) as Preset,
    ],
    // theme: {
    //   breakpoints: {
    //     sm: "576px",
    //     md: "768px",
    //     lg: "992px",
    //     xl: "1200px",
    //     "2xl": "1600px"
    //   }
    // }
  });
}

export default createUnoCSSConfig();
