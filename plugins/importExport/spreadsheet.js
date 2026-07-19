import * as XLSX from 'xlsx'

export function parseSpreadsheet(buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer', raw: true })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    if (!sheet) return []

    return XLSX.utils.sheet_to_json(sheet, { defval: '' })
}

export function buildSpreadsheet(rows, headers, format) {
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers })

    if (format === 'csv') {
        return Buffer.from(XLSX.utils.sheet_to_csv(worksheet), 'utf8')
    }

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

export function detectFormat(filename, queryFormat) {
    const q = String(queryFormat ?? '').toLowerCase()
    if (q === 'csv' || q === 'xlsx') return q

    return filename?.toLowerCase().endsWith('.csv') ? 'csv' : 'csv'
}
