

/**
 * formates 1000 -> 1k 1000000 -> 1M etc
 */

export function formattNumber(num){
    const formatter = Intl.NumberFormat('en', { notation: 'compact' })
    return formatter.format(num)
}