export const intlTimeFormater = new Intl.NumberFormat('fr-FR', { minimumIntegerDigits: 2 }).format;

export const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
})