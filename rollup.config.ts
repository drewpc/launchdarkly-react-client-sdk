import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { codecovRollupPlugin } from "@codecov/rollup-plugin";

const plugins = [
  resolve(),
  esbuild({ target: 'es6' }),
  json(),
  terser(),
      // Put the Codecov rollup plugin after all other plugins
    codecovRollupPlugin({
      apiUrl: "https://codecov.pd-staging.com",
      telemetry: false,
      debug: true,
      uploadOverrides: {
        slug: "drewpc/launcdarkly-react-client-sdk"
      },
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: "launchdarkly-react-client-sdk",
      uploadToken: process.env.CODECOV_TOKEN,
    }),
];

const external = /node_modules/;

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/cjs/index.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins,
    external,
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/esm/index.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins,
    external,
  },
  {
    input: 'src/index.ts',
    plugins: [dts(), json()],
    output: {
      file: 'lib/index.d.ts',
      format: 'es',
    },
  },
];
