const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
    }).format(new Date(date))
}

export {
    formatDate
}