/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/prefer-default-export
export const dateFilters = {
    pastDay: {
        label: 'Past 24 hours',
        id: 'pastDay',
        filterFunction: d => {
            const date = new Date(d.dateCreated._seconds * 1000);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return date < yesterday;
        }
    },
    pastWeek: {
        label: 'Past week',
        id: 'pastWeek',
        filterFunction: d => {
            const date = new Date(d.dateCreated._seconds * 1000);
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            return date < lastWeek;
        }
    },
    pastMonth: {
        label: 'Past month',
        id: 'pastMonth',
        filterFunction: d => {
            const date = new Date(d.dateCreated._seconds * 1000);
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return date < lastMonth;
        }
    },
    pastYear: {
        label: 'Past year',
        id: 'pastYear',
        filterFunction: d => {
            const date = new Date(d.dateCreated._seconds * 1000);
            const lastYear = new Date();
            lastYear.setFullYear(lastYear.getFullYear() - 1);
            return date < lastYear;
        }
    },
    allTime: {
        label: 'All Time',
        id: 'allTime',
        filterFunction: () => true
    }
};

const filterBySearch = (videos, searchFilter) => videos
    .filter(x => x.email.includes(searchFilter)
    || x.title.toLowerCase().includes(searchFilter.toLowerCase()));

export const filterByDate = (filter, videos, searchFilter) => {
    const { filterFunction } = Object.values(dateFilters).find(x => x.id === filter);
    return filterBySearch(videos.filter(x => filterFunction(x)), searchFilter);
};
