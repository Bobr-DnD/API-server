const PATH_PATTERN = /^\/([^/]+)$/

export function applyPatchOps(ops) {
    if (!Array.isArray(ops) || ops.length === 0) {
        return { error: 'Patch must include at least one operation' }
    }

    const result = {}

    for (const entry of ops) {
        const { op, path, value } = entry ?? {}

        if (op !== 'replace') {
            return { error: `Unsupported patch operation: ${op}` }
        }

        const match = PATH_PATTERN.exec(path ?? '')
        if (!match) {
            return { error: `Unsupported patch path: ${path}` }
        }

        result[match[1]] = value

    }

    return { data: result }
}
