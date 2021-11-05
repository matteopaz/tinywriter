const esbuild = require('esbuild');
esbuild.build({
    entryPoints: ['./src/index.ts'],
    outdir: './dist',
    minify: true,
    bundle: true,
    target: 'es6',
    platform: 'neutral',
    format: 'esm',
    sourcemap: false,
    tsconfig: './tsconfig.json',
})