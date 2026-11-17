import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

// After a production build, writes dist/sw.js: the offline helper from sw.template.js with
// the list of every file the app needs (so the whole app opens with no connection) and a
// version that changes whenever any of them does.
function offlineSupport() {
  let outDir = 'dist'

  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name)
      return entry.isDirectory() ? walk(full) : [full]
    })

  return {
    name: 'offline-support',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const files = walk(outDir).map((file) => path.relative(outDir, file).split(path.sep).join('/'))
      const keep = files.filter(
        (file) =>
          file !== 'sw.js' &&
          !file.endsWith('.map') &&
          file !== 'icons/icon-1024.png' && // only for the store listings
          !/-(cyrillic|cyrillic-ext|hebrew|vietnamese)-/.test(file) // alphabets the app never shows
      )

      const hash = createHash('sha256')
      keep.sort().forEach((file) => {
        hash.update(file)
        hash.update(fs.readFileSync(path.join(outDir, file)))
      })

      const precache = ['/index.html', ...keep.filter((file) => file !== 'index.html').map((file) => `/${file}`)]
      const template = fs.readFileSync(path.resolve('sw.template.js'), 'utf8')
      fs.writeFileSync(
        path.join(outDir, 'sw.js'),
        template
          .replaceAll('__VERSION__', hash.digest('hex').slice(0, 12))
          .replaceAll('__PRECACHE__', JSON.stringify(precache, null, 2))
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), offlineSupport()],
})
