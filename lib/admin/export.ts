/**
 * Dependency-free tabular exporters: CSV, Excel (SpreadsheetML 2003 .xls,
 * opens natively in Excel/Numbers/Sheets), and a minimal landscape PDF.
 */

export function toCsv(headers: string[], rows: string[][]): string {
  const esc = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s)
  return [headers, ...rows].map((r) => r.map((c) => esc(c ?? '')).join(',')).join('\r\n')
}

export function toXls(sheetName: string, headers: string[], rows: string[][]): string {
  const escXml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const cell = (v: string) => `<Cell><Data ss:Type="String">${escXml(v ?? '')}</Data></Cell>`
  const row = (cells: string[]) => `<Row>${cells.map(cell).join('')}</Row>`
  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles><Style ss:ID="h"><Font ss:Bold="1"/></Style></Styles>
  <Worksheet ss:Name="${escXml(sheetName)}">
    <Table>
      <Row>${headers.map((h) => `<Cell ss:StyleID="h"><Data ss:Type="String">${escXml(h)}</Data></Cell>`).join('')}</Row>
      ${rows.map(row).join('\n      ')}
    </Table>
  </Worksheet>
</Workbook>`
}

/** Very small PDF writer: landscape A4 table of text rows. */
export function toPdf(title: string, headers: string[], rows: string[][]): Buffer {
  const W = 842, H = 595 // A4 landscape (pt)
  const margin = 36
  const fontSize = 7
  const headerSize = 8
  const lineH = 11
  const usableW = W - margin * 2
  const colW = usableW / headers.length
  const maxChars = Math.max(4, Math.floor(colW / (fontSize * 0.52)))

  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
  const clip = (s: string) => {
    const t = (s ?? '').replace(/\s+/g, ' ').trim()
    return t.length > maxChars ? t.slice(0, maxChars - 1) + '…' : t
  }

  // paginate
  const rowsPerPage = Math.floor((H - margin * 2 - 40) / lineH) - 1
  const pages: string[][][] = []
  for (let i = 0; i < rows.length; i += rowsPerPage) pages.push(rows.slice(i, i + rowsPerPage))
  if (pages.length === 0) pages.push([])

  const pageStreams = pages.map((pageRows, pi) => {
    let y = H - margin
    let s = `BT /F1 12 Tf ${margin} ${y} Td (${esc(title)}${pages.length > 1 ? ` - page ${pi + 1}/${pages.length}` : ''}) Tj ET\n`
    y -= 24
    s += `BT /F2 ${headerSize} Tf ${margin} ${y} Td`
    headers.forEach((h, i) => {
      s += ` ${i === 0 ? 0 : colW} 0 Td (${esc(clip(h))}) Tj`
    })
    s += ' ET\n'
    y -= 4
    s += `${margin} ${y} m ${W - margin} ${y} l S\n`
    y -= lineH
    for (const r of pageRows) {
      s += `BT /F1 ${fontSize} Tf ${margin} ${y} Td`
      headers.forEach((_, i) => {
        s += ` ${i === 0 ? 0 : colW} 0 Td (${esc(clip(r[i] ?? ''))}) Tj`
      })
      s += ' ET\n'
      y -= lineH
    }
    return s
  })

  // assemble PDF objects
  const objects: string[] = []
  const nPages = pageStreams.length
  // 1: catalog, 2: pages, 3..(2+n): page objs, then content streams, then fonts
  const pageObjIds = pageStreams.map((_, i) => 3 + i)
  const contentIds = pageStreams.map((_, i) => 3 + nPages + i)
  const fontId = 3 + nPages * 2
  const fontBoldId = fontId + 1

  objects[1] = `1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj`
  objects[2] = `2 0 obj << /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${nPages} >> endobj`
  pageStreams.forEach((stream, i) => {
    objects[pageObjIds[i]] = `${pageObjIds[i]} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${fontId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentIds[i]} 0 R >> endobj`
    objects[contentIds[i]] = `${contentIds[i]} 0 obj << /Length ${Buffer.byteLength(stream)} >> stream\n${stream}endstream endobj`
  })
  objects[fontId] = `${fontId} 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj`
  objects[fontBoldId] = `${fontBoldId} 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj`

  let out = '%PDF-1.4\n'
  const offsets: number[] = []
  for (let i = 1; i <= fontBoldId; i++) {
    offsets[i] = Buffer.byteLength(out)
    out += objects[i] + '\n'
  }
  const xrefPos = Buffer.byteLength(out)
  out += `xref\n0 ${fontBoldId + 1}\n0000000000 65535 f \n`
  for (let i = 1; i <= fontBoldId; i++) {
    out += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }
  out += `trailer << /Size ${fontBoldId + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`
  return Buffer.from(out, 'latin1')
}
