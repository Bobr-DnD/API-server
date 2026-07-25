export function requiredString(value, field, errors) {
    const str = String(value ?? '').trim()
    if (!str) errors.push(`${field} is required`)
    return str
}

export function optionalString(value) {
    const str = String(value ?? '').trim()
    return str || null
}

export function optionalNumber(value, field, errors, fallback = 0) {
    if (value === '' || value === null || value === undefined) return fallback

    const num = Number(value)
    if (Number.isNaN(num)) {
        errors.push(`${field} must be a number`)
        return fallback
    }

    return num
}

export function parseJSON(value, field, errors, fallback) {
    const str = String(value ?? '').trim()
    if (!str) return fallback

    try {
        return JSON.parse(str)
    } catch {
        errors.push(`${field} must be valid JSON`)
        return fallback
    }
}

export function parseNameList(value) {
    const str = String(value ?? '').trim()
    if (!str) return []

    return str.split(',').map(s => s.trim()).filter(Boolean)
}

export function resolveNames(names, byName, field, errors) {
    const ids = []

    for (const name of names) {
        const id = byName.get(name)
        if (!id) {
            errors.push(`Unknown ${field}: "${name}"`)
            continue
        }
        ids.push(id)
    }

    return ids
}

export function idsToNames(ids, byId) {
    return (ids ?? []).map(id => byId.get(id.toString())).filter(Boolean)
}

export function toNameList(ids, byId) {
    return idsToNames(ids, byId).join(', ')
}

const ID_SUFFIX_PATTERN = /\(([a-f0-9]{24})\)\s*$/i

export function parseNameIdEntry(value) {
    const str = String(value ?? '').trim()
    const match = str.match(ID_SUFFIX_PATTERN)
    if (!match) return { name: str, id: null }

    return { name: str.slice(0, match.index).trim(), id: match[1] }
}

export function parseNameIdList(value) {
    const str = String(value ?? '').trim()
    if (!str) return []

    return str.split(',').map(s => s.trim()).filter(Boolean).map(parseNameIdEntry)
}

export function toNameIdArray(ids, byId) {
    return (ids ?? []).map(id => {
        const idStr = id.toString()
        const name = byId.get(idStr)
        return name ? `${name} (${idStr})` : idStr
    })
}

export function toNameIdList(ids, byId) {
    return toNameIdArray(ids, byId).join(', ')
}

export function resolveNameIdEntries(entries, byId, byName, field, errors) {
    const ids = []

    for (const { name, id } of entries) {
        if (id) {
            if (!byId.has(id)) {
                errors.push(`Unknown ${field} id: "${id}"`)
                continue
            }
            ids.push(id)
            continue
        }

        const resolvedId = byName.get(name)
        if (!resolvedId) {
            errors.push(`Unknown ${field}: "${name}"`)
            continue
        }
        ids.push(resolvedId)
    }

    return ids
}

export function stringifyMaybe(value) {
    return value ? JSON.stringify(value) : ''
}
