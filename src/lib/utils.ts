export const intlTimeFormater = new Intl.NumberFormat('fr-FR', { minimumIntegerDigits: 2 }).format;

export const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
})

export const normalizeString = (str: string) => str.toUpperCase()
.normalize('NFD')
.replace(/\p{Diacritic}/gu, '')