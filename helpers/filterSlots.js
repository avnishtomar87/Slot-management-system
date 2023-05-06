
const filterSlots = (slots, day, time) => {
    const filteredSlots = slots.filter((item) => item.day !== day && item.time !== time);
    return filteredSlots
}

module.exports = { filterSlots }