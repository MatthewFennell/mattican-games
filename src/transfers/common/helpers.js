import fp from 'lodash/fp';

export const marks = [
    {
        value: 0,
        label: '0'
    },
    {
        value: 2,
        label: '2'
    },
    {
        value: 4,
        label: '4'
    },
    {
        value: 6,
        label: '6'
    },
    {
        value: 8,
        label: '8'
    },
    {
        value: 10,
        label: '10'
    },
    {
        value: 12,
        label: '12'
    },
    {
        value: 12,
        label: '12'
    },
    {
        value: 14,
        label: '14'
    }
];

export const generateMarks = (min, max, interval) => {
    const range = [];
    for (let x = min; x <= max; x += interval) {
        range.push({
            value: x,
            label: x.toString()
        });
    }
    return range;
};

export const sortListAscDesc = (list, direction, property) => {
    if (direction === 'Asc') {
        return fp.sortBy(property)(list);
    }
    if (direction === 'Desc') {
        return fp.sortBy(property)(list).reverse();
    }
    return list;
};

export const sortListAscDescDesktop = (list, isAscending, property) => {
    if (isAscending) {
        return fp.sortBy(property)(list);
    }
    return fp.sortBy(property)(list).reverse();
};
