export function transformId(doc) {
    if (!doc) return doc
    const { _id, ...rest } = doc
    
    return { id: _id.toString(), ...rest }
}

export function transformArray(docs) {
    return docs.map(transformId)
}