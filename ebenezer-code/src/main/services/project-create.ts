import fs from 'node:fs/promises'
import path from 'node:path'
import type { CreateProjectRequest } from '../../shared/types'
import { createDirectory, writeTextFile } from './filesystem'

export async function createProject(req: CreateProjectRequest): Promise<string> {
  const safeName = req.name.trim().replace(/[<>:"/\\|?*]/g, '-')
  if (!safeName) throw new Error('Project name is required')
  const root = path.join(req.parentDir, safeName)
  await createDirectory(root)

  if (req.template === 'blank') {
    await writeTextFile(path.join(root, 'README.md'), `# ${safeName}\n\nCreated with Ebenezer Code.\n`)
  } else if (req.template === 'html') {
    await writeTextFile(
      path.join(root, 'index.html'),
      `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeName}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main>
    <h1>${safeName}</h1>
    <p>Built with Ebenezer Code.</p>
  </main>
  <script src="script.js"></script>
</body>
</html>
`
    )
    await writeTextFile(
      path.join(root, 'styles.css'),
      `body{font-family:system-ui,sans-serif;margin:2rem;line-height:1.5;color:#111}
h1{margin-bottom:.5rem}
`
    )
    await writeTextFile(path.join(root, 'script.js'), `console.log('${safeName} ready');\n`)
  } else if (req.template === 'nodejs') {
    await writeTextFile(
      path.join(root, 'package.json'),
      JSON.stringify(
        {
          name: safeName.toLowerCase().replace(/\s+/g, '-'),
          version: '1.0.0',
          private: true,
          main: 'index.js',
          scripts: { start: 'node index.js' }
        },
        null,
        2
      ) + '\n'
    )
    await writeTextFile(
      path.join(root, 'index.js'),
      `console.log('Hello from ${safeName}');\n`
    )
    await writeTextFile(path.join(root, 'README.md'), `# ${safeName}\n\n\`\`\`bash\nnpm start\n\`\`\`\n`)
  }

  await fs.mkdir(path.join(root, '.ebenezer'), { recursive: true })
  await writeTextFile(
    path.join(root, '.ebenezer', 'rules.md'),
    `# Project rules for Ebenezer Code AI\n\n- Prefer clear, simple code.\n- Do not invent files that are not needed.\n`
  )

  return root
}
