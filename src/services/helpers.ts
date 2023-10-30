export const utcToLocalString = (utcDate?: Date) => {
    if (!utcDate) {
        return '';
    }

    const dateTime = new Date(utcDate);
    dateTime.setMinutes(dateTime.getMinutes() - dateTime.getTimezoneOffset());

    return new Intl.DateTimeFormat("ru-RU", { dateStyle: 'short', timeStyle: 'short' }).format(dateTime);
};

export const getDateNow = () : Date =>
{
    return new Date();
}

export const getUTCDate = (date?: Date) : Date =>
{
    if (!date) {
        return new Date();
    }

    const utcDate = new Date(date);
    utcDate.setMinutes(utcDate.getMinutes() + utcDate.getTimezoneOffset());

    return utcDate;
}