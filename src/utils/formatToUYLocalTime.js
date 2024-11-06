export const formatToUruguayLocalTime = (dateTimeString, formatType) => {
    const date = new Date(dateTimeString)
    if (isNaN(date)) throw new Error('Invalid date string provided.')

    const options = { timeZone: 'America/Montevideo' }

    switch (formatType) {
        case 'eventDate':
            return date.toLocaleDateString('en-CA', {
                ...options,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })
        case 'eventHour':
            return date.toLocaleTimeString('en-GB', {
                ...options,
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        default:
            throw new Error('Invalid formatType. Expecting "eventDate" or "eventHour".')
    }
}