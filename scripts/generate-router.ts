import { readdirSync, statSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const routesPath = readdirSync(resolve(process.cwd(), './api'))
  .filter(f => f.endsWith('.ts') && !f.startsWith('_') && statSync(`${resolve(process.cwd(), './api')}/${f}`).isFile())

const routesImports = routesPath.map(m => `import ${m.replace('.ts', '')} from './${m}'`).join('\n')
const routesFunc = routesPath.map(m => `router.all('/${m.replace('.ts', '')}', ${m.replace('.ts', '')})`).join('\n')

const routesFile = `/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Router } from 'express'
${routesImports}

const router = Router()
${routesFunc}
export default router
`
writeFileSync(resolve(process.cwd(), './api', '_routes.ts'), routesFile)
