export function sortByTwoFields(array, primaryField, secondaryField){
    array.sort((a, b) => {
        const keyA = `${a[primaryField]}-${a[secondaryField]}`
        const keyB = `${b[primaryField]}-${b[secondaryField]}`
        return keyA.localeCompare(keyB, 'uk')
    })

    return array
}

export function sortByMainField(array, primaryField){
    array.sort((a, b) => a[primaryField].localeCompare(b[primaryField], 'uk'));

    return array
}

export function sortArraysByOneField(arrays, field){
    arrays.forEach(array => {
        array.sort((a,b) => a[field].localeCompare(b[field], 'uk'))
    });

    return arrays
}

// CHECK: not sure returns are important here