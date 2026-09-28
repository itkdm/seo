import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(await readFile(path.join(root, 'scripts/social-images.json'), 'utf8'))
const width = 1200
const height = 630

function readFrontmatter(source) {
  const block = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)
  if (!block) throw new Error('Missing frontmatter')
  const field = (key) => block[1].match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1]?.trim() ?? ''
  return { title: field('title'), description: field('description') }
}

function wrap(text, limit, measure) {
  const lines = []
  let line = ''
  let used = 0
  for (const token of text.split(/(\s+)/).filter(Boolean)) {
    const tokenWidth = [...token].reduce((sum, char) => sum + measure(char), 0)
    if (line && used + tokenWidth > limit) {
      lines.push(line.trimEnd())
      line = ''
      used = 0
    }
    if (!line && /^\s+$/.test(token)) continue
    for (const char of token) {
      const charWidth = measure(char)
      if (line && used + charWidth > limit) {
        lines.push(line.trimEnd())
        line = ''
        used = 0
      }
      line += char
      used += charWidth
    }
  }
  if (line.trim()) lines.push(line.trimEnd())
  return lines
}

function wrapTitle(text, limit, measure) {
  const chunks = text.match(/[^｜：，,。；;]+[｜：，,。；;]?/g) ?? [text]
  const lines = []
  let line = ''
  let used = 0
  for (const chunk of chunks) {
    const tokens = chunk.match(/[A-Za-z0-9]+(?:[’'&-][A-Za-z0-9]+)*|\s+|[^\x00-\x7f]|[^\s]/g) ?? [chunk]
    for (const token of tokens) {
      if (/^\s+$/.test(token)) {
        if (line && !line.endsWith(' ')) { line += ' '; used += measure(' ') }
        continue
      }
      const tokenWidth = [...token].reduce((sum, char) => sum + measure(char), 0)
      if (line.trim() && used + tokenWidth > limit) {
        lines.push(line.trim())
        line = ''
        used = 0
      }
      if (tokenWidth <= limit) {
        line += token
        used += tokenWidth
        continue
      }
      for (const char of token) {
        const charWidth = measure(char)
        if (line && used + charWidth > limit) {
          lines.push(line.trim())
          line = ''
          used = 0
        }
        line += char
        used += charWidth
      }
    }
  }
  if (line.trim()) lines.push(line.trim())
  return lines
}

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
}

function textBlock(lines, x, y, fontSize, lineHeight, weight, color) {
  return `<text x="${x}" y="${y}" font-family="Microsoft YaHei, Noto Sans CJK SC, Noto Sans SC, Arial, sans-serif" font-size="${fontSize}" font-weight="${weight}" fill="${color}">${lines.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`).join('')}</text>`
}

for (const page of manifest.pages) {
  const { title, description } = readFrontmatter(await readFile(path.join(root, page.source), 'utf8'))
  const titleLines = wrapTitle(title, 620, (char) => /[\u0000-\u00ff]/.test(char) ? 20 : 44)
  const descriptionLines = wrap(description, 535, (char) => /[\u0000-\u00ff]/.test(char) ? 12 : 22)
  const titleY = 220
  const titleLineHeight = 54
  const descriptionY = titleY + titleLines.length * titleLineHeight + 28
  const palette = manifest.palette
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><linearGradient id="wash" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${palette.wash}" stop-opacity=".98"/><stop offset=".53" stop-color="${palette.wash}" stop-opacity=".94"/><stop offset=".7" stop-color="${palette.wash}" stop-opacity=".25"/><stop offset=".78" stop-color="${palette.wash}" stop-opacity="0"/></linearGradient></defs><rect width="${width}" height="${height}" fill="url(#wash)"/><text x="78" y="91" font-family="Microsoft YaHei, Noto Sans CJK SC, Noto Sans SC, Arial, sans-serif" font-size="25" font-weight="700" fill="${palette.brand}">${escapeXml(manifest.brand[page.locale])}</text><rect x="78" y="119" width="82" height="7" rx="3.5" fill="${palette.accent}"/>${textBlock(titleLines, 78, titleY, 44, titleLineHeight, 750, palette.title)}${textBlock(descriptionLines, 80, descriptionY, 23, 36, 400, palette.description)}</svg>`
  const output = path.join(root, 'docs/public', page.output.replace(/^\//, ''))
  await mkdir(path.dirname(output), { recursive: true })
  await sharp(path.join(root, page.background)).resize(width, height, { fit: 'cover', position: 'attention' }).composite([{ input: Buffer.from(svg) }]).jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: '4:2:0' }).toFile(output)
  console.log(`${page.output} — ${titleLines.length} title lines, ${descriptionLines.length} description lines`)
}
