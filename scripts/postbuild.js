import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const outputDir = path.join(rootDir, '.vercel', 'output');
const functionsDir = path.join(outputDir, 'functions', '__server.func');

// 1. Ensure .vercel/output exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 2. Write .vercel/output/config.json for Vercel Build Output API v3
const vercelConfig = {
  version: 3,
  routes: [
    {
      src: '^/assets/(.*)$',
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
      continue: true,
    },
    {
      handle: 'filesystem',
    },
    {
      src: '^/login$',
      status: 307,
      headers: { Location: '/auth' },
    },
    {
      src: '^/entrar$',
      status: 307,
      headers: { Location: '/auth' },
    },
    {
      src: '^/cadastro$',
      status: 307,
      headers: { Location: '/auth' },
    },
    {
      src: '^/dashboard$',
      status: 307,
      headers: { Location: '/' },
    },
    {
      src: '^/home$',
      status: 307,
      headers: { Location: '/' },
    },
    {
      src: '/(.*)',
      dest: '/__server',
    },
  ],
};

fs.writeFileSync(
  path.join(outputDir, 'config.json'),
  JSON.stringify(vercelConfig, null, 2),
  'utf-8'
);
console.log('Successfully generated .vercel/output/config.json');

// 3. Ensure .vc-config.json exists inside functions/__server.func
if (fs.existsSync(functionsDir)) {
  const vcConfig = {
    runtime: 'nodejs24.x',
    handler: 'index.mjs',
    launcherType: 'Nodejs',
    shouldAddHelpers: true,
  };

  fs.writeFileSync(
    path.join(functionsDir, '.vc-config.json'),
    JSON.stringify(vcConfig, null, 2),
    'utf-8'
  );
  console.log('Successfully generated .vercel/output/functions/__server.func/.vc-config.json');
} else {
  console.warn('functions/__server.func directory does not exist yet.');
}
