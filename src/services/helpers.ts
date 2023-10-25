export const getDateString = (date: Date) => {
    if (!date) {
        return '';
    }

    const dateTime = new Date(date);
    return new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short' }).format(dateTime);
};