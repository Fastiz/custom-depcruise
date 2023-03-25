export const changeOfBase = (value: number, baseAlphabet: string): string => {
  const result = changeOfBaseRec(value, baseAlphabet)
  return result === '' ? 'a' : result
}

const changeOfBaseRec = (value: number, baseAlphabet: string): string => {
  if (value === 0) {
    return ''
  }

  const quotient = Math.floor(value / baseAlphabet.length)
  const remainder = value - quotient * baseAlphabet.length

  const currentDigit = baseAlphabet[remainder]
  const otherDigits = changeOfBaseRec(quotient, baseAlphabet)

  return `${otherDigits}${currentDigit}`
}
