import * as XLSX from 'xlsx'

const ZIP_SIGNATURE = Buffer.from([0x50, 0x4b, 0x03, 0x04]) // xlsx files are zip archives (PK\x03\x04)
const UTF8_BOM_CHAR_CODE = 0xfeff

function isZip(buffer) {
    return buffer.length >= 4 && buffer.subarray(0, 4).equals(ZIP_SIGNATURE)
}

function stripBOM(str) {
    return str.charCodeAt(0) === UTF8_BOM_CHAR_CODE ? str.slice(1) : str
}

export function parseSpreadsheet(buffer) {
    // xlsx is a binary zip container and decodes correctly as a buffer; csv is plain text
    // and must be decoded as UTF-8 ourselves, otherwise SheetJS falls back to latin1 and
    // mangles non-ASCII text (e.g. Cyrillic) since a bare buffer carries no encoding info.
    const workbook = isZip(buffer)
        ? XLSX.read(buffer, { type: 'buffer' })
        : XLSX.read(stripBOM(buffer.toString('utf8')), { type: 'string', raw: true })

    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    if (!sheet) return []

    return XLSX.utils.sheet_to_json(sheet, { defval: '' })
}

export function buildSpreadsheet(rows, headers, format) {
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers })

    if (format === 'csv') {
        // BOM tells Excel to read the CSV as UTF-8 instead of the system codepage,
        // which otherwise garbles non-ASCII text like Cyrillic when opened directly.
        const bom = String.fromCharCode(UTF8_BOM_CHAR_CODE)
        return Buffer.from(bom + XLSX.utils.sheet_to_csv(worksheet), 'utf8')
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
