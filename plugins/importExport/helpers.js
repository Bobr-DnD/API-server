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

export function stringifyMaybe(value) {
    return value ? JSON.stringify(value) : ''
}
