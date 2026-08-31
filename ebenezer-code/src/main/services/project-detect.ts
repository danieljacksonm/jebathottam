import fs from 'node:fs/promises'
import path from 'node:path'

export async function detectTechnology(projectPath: string): Promise<string> {
  try {
    const pkgPath = path.join(projectPath, 'package.json')
    const raw = await fs.readFile(pkgPath, 'utf8')
    const pkg = JSON.parse(raw) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }
    if (deps.next) return 'Next.js'
    if (deps.react) return 'React'
    if (deps.vue) return 'Vue'
    if (deps.electron) return 'Electron'
    return 'Node.js'
  } catch {
    /* continue */
  }

  const markers: [string, string][] = [
    ['composer.json', 'PHP / Composer'],
    ['artisan', 'Laravel'],
    ['requirements.txt', 'Python'],
    ['pyproject.toml', 'Python'],
    ['pom.xml', 'Java'],
    ['build.gradle', 'Java / Gradle'],
    ['pubspec.yaml', 'Flutter'],
    ['Cargo.toml', 'Rust'],
    ['go.mod', 'Go'],
    ['index.html', 'HTML/CSS/JS']
  ]

  for (const [file, label] of markers) {
    try {
      await fs.access(path.join(projectPath, file))
      return label
    } catch {
      /* next */
    }
  }

  return 'Folder'
}
