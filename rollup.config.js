import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
    input: 'src/index.ts', // Entry point
    output: [
        {
            file: 'dist/index.js', // Output file
            format: 'es', // ES module format
            sourcemap: true, // Enable source maps
        },
    ],
    plugins: [
        peerDepsExternal(), // Externalize peer dependencies
        nodeResolve(), // Resolve dependencies from node_modules
        commonjs(), // Convert CommonJS to ES6
        typescript({ tsconfig: './tsconfig.json' }), // TypeScript plugin
    ],
    external: [
        'node-fetch', // Prevent bundling node-fetch
    ],
};
