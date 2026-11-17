import { readFileSync, writeFileSync } from 'node:fs'
const source = JSON.parse(readFileSync(new URL('../demo/testicular-demo.json', import.meta.url), 'utf8'))
const output = `/* Generated from demo/testicular-demo.json. Synthetic records only. */\nwindow.TESTI_DEMO = ${JSON.stringify(source, null, 2)};\n`
writeFileSync(new URL('../prototypes/v0.2/demo-data.js', import.meta.url), output)
console.log(`✓ prototypes/v0.2/demo-data.js generated from one source (${source.profiles.length} synthetic profiles)`)
