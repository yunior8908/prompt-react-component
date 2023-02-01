import { readFileSync } from "node:fs";
import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

import alias from "@rollup/plugin-alias";

const packages = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url))
);

export const file = (type) => `dist/index.${type}.js`;

const overrides = {
  compilerOptions: {
    noUnusedParameters: true,
    noUnusedLocals: true,
    strictNullChecks: true,
    moduleResolution: "node",
    declaration: true,
    allowSyntheticDefaultImports: true,
  },
  useTsconfigDeclarationDir: true,
};

export default {
  input: "src/index.ts",
  output: [
    {
      file: packages.main,
      format: "cjs",
      sourcemap: true,
      globals: {
        react: "React",
        // "react-dom": "ReactDOM",
        // "styled-components": "styled",
      },
    },
    {
      file: packages.module,
      format: "esm",
      sourcemap: true,
      globals: {
        react: "React",
        // "react-dom": "ReactDOM",
        // "styled-components": "styled",
      },
    },
  ],
  external: ["react"],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: overrides,
    }),
    alias({
      entries: [{ find: "react", replacement: "./node_modules/react" }],
    }),
    terser(),
  ],
};
