import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import inject from '@rollup/plugin-inject';
import alias from '@rollup/plugin-alias'
import { RollupOptions } from 'rollup';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('./package.json');

const config: RollupOptions = {
    input: 'src/index.ts',
    output: [
        {
            file: packageJson.main,
            format: 'commonjs',
            sourcemap: true,
        },
    ],
    plugins: [
        alias({
            entries: {
                'readable-stream': 'stream',
            }
        }),
        resolve({
            exportConditions: ['node'],
        }),
        commonjs({
            exclude: [
                'electron',
            ],
            ignoreDynamicRequires: true,
            ignore: (id) => {
                switch (id) {
                    case './bindings':
                    case 'electron':
                        return true;
                }
                return false;
            },
            ignoreTryCatch: (id) => {
                if (id === './bindings') return false;
                return true;
            },
        }),
        inject({
            WebSocket: 'ws',
        }),
        json(),
        copy({
            targets: [
                { src: 'src/contracts/*.d.ts', dest: 'dist/contracts/' }
            ]
        }),
        typescript({
            useTsconfigDeclarationDir: true,
            tsconfigOverride: {
                exclude: ['./examples/**', './tests/**'],
            },
        })
    ],
};

export default config;
