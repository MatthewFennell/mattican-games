import MockDate from 'mockdate';
import * as helpers from './helpers';

const videosPositiveKarma = [
    {
        upvotes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        downvotes: [1, 2, 3, 4, 5]
    },
    {
        upvotes: [1, 2, 3, 4, 5],
        downvotes: []
    }
];

const videosNegativeKarma = [
    {
        upvotes: [1, 2],
        downvotes: [1, 2, 3, 4, 5]
    },
    {
        upvotes: [1, 2, 3, 4, 5],
        downvotes: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
];

const videosToFilterNameEmail = [
    {
        downvotes: [],
        title: 'Title',
        videoId: 'LYMGGgbOz1k',
        displayName: 'TestUser',
        dateCreated: { _seconds: 1580509615, _nanoseconds: 331000000 },
        email: 'test@gmail.com',
        userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
        upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
        id: 'TvbIMaRdF50Cex5VSWyG'
    },
    {
        downvotes: [],
        title: 'Test abc',
        videoId: 'LYMGGgbOz1k',
        displayName: 'TestUser',
        dateCreated: { _seconds: 1580509615, _nanoseconds: 331000000 },
        email: 'user@gmail.com',
        userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
        upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
        id: 'TvbIMaRdF50Cex5VSWyG'
    },
    {
        downvotes: [],
        title: 'aafsafsafsafs',
        videoId: 'LYMGGgbOz1k',
        displayName: 'TestUser',
        dateCreated: { _seconds: 1580509615, _nanoseconds: 331000000 },
        email: 'asfasfasfasfafs@gmail.com',
        userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
        upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
        id: 'TvbIMaRdF50Cex5VSWyG'
    }
];

const videosByPopularity = [
    {
        downvotes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        title: 'Title',
        videoId: 'LYMGGgbOz1k',
        displayName: 'TestUser',
        dateCreated: { _seconds: 1580509615, _nanoseconds: 331000000 },
        email: 'test@gmail.com',
        userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
        upvotes: [1, 2, 3, 4, 5],
        id: 'TvbIMaRdF50Cex5VSWyG'
    },
    {
        downvotes: [1, 2, 3, 4, 5, 6],
        title: 'Test abc',
        videoId: 'LYMGGgbOz1k',
        displayName: 'TestUser',
        dateCreated: { _seconds: 1580509615, _nanoseconds: 331000000 },
        email: 'user@gmail.com',
        userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
        upvotes: [1, 2, 3, 4, 5, 6, 7, 8],
        id: 'TvbIMaRdF50Cex5VSWyG'
    },
    {
        downvotes: [1, 2, 3, 4, 5, 6],
        title: 'aafsafsafsafs',
        videoId: 'LYMGGgbOz1k',
        displayName: 'TestUser',
        dateCreated: { _seconds: 1580509615, _nanoseconds: 331000000 },
        email: 'asfasfasfasfafs@gmail.com',
        userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
        upvotes: [1, 2, 3],
        id: 'TvbIMaRdF50Cex5VSWyG'
    }
];


// Mock Date will be September 10 2005
const videosToFilterByDate = [
    {
        downvotes: [],
        title: 'Title',
        videoId: 'LYMGGgbOz1k',
        displayName: 'TestUser',
        dateCreated: {
            _seconds: 1126213259,
            _nanoseconds: 0 // 8th Sep 2005 10:00:59 PM
        },
        email: 'test@gmail.com',
        userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
        upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
        id: 'TvbIMaRdF50Cex5VSWyG'
    },
    {
        downvotes: [],
        title: 'Title',
        videoId: 'LYMGGgbOz1k',
        displayName: 'TestUser',
        dateCreated: {
            _seconds: 1126299659,
            _nanoseconds: 0 // 9th Sep 2005 10:00:59 PM
        },
        email: 'test@gmail.com',
        userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
        upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
        id: 'TvbIMaRdF50Cex5VSWyG'
    },
    {
        downvotes: [],
        title: 'Title',
        videoId: 'LYMGGgbOz1k',
        displayName: 'TestUser',
        dateCreated: {
            _seconds: 1125694859,
            _nanoseconds: 0 // 2nd Sep 2005 10:00:59 PM
        },
        email: 'test@gmail.com',
        userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
        upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
        id: 'TvbIMaRdF50Cex5VSWyG'
    },
    {
        downvotes: [],
        title: 'Title',
        videoId: 'LYMGGgbOz1k',
        displayName: 'TestUser',
        dateCreated: {
            _seconds: 1125781259,
            _nanoseconds: 0 // 3rd Sep 2005 10:00:59 PM
        },
        email: 'test@gmail.com',
        userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
        upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
        id: 'TvbIMaRdF50Cex5VSWyG'
    },
    {
        downvotes: [],
        title: 'Title',
        videoId: 'LYMGGgbOz1k',
        displayName: 'TestUser',
        dateCreated: {
            _seconds: 1123707659,
            _nanoseconds: 0 // 10th Aug 2005 10:00:59 PM
        },
        email: 'test@gmail.com',
        userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
        upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
        id: 'TvbIMaRdF50Cex5VSWyG'
    },
    {
        downvotes: [],
        title: 'Title',
        videoId: 'LYMGGgbOz1k',
        displayName: 'TestUser',
        dateCreated: {
            _seconds: 1123534859,
            _nanoseconds: 0 // 8th Aug 2005 10:00:59 PM
        },
        email: 'test@gmail.com',
        userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
        upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
        id: 'TvbIMaRdF50Cex5VSWyG'
    },
    {
        downvotes: [],
        title: 'Title',
        videoId: 'LYMGGgbOz1k',
        displayName: 'TestUser',
        dateCreated: {
            _seconds: 1094850059,
            _nanoseconds: 0 // 10th Sep 2004 10:00:59 PM
        },
        email: 'test@gmail.com',
        userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
        upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
        id: 'TvbIMaRdF50Cex5VSWyG'
    },
    {
        downvotes: [],
        title: 'Title',
        videoId: 'LYMGGgbOz1k',
        displayName: 'TestUser',
        dateCreated: {
            _seconds: 873925259,
            _nanoseconds: 0 // 10th Sep 1997 10:00:59 PM
        },
        email: 'test@gmail.com',
        userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
        upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
        id: 'TvbIMaRdF50Cex5VSWyG'
    }
];

describe('Karma calculations', () => {
    it('Generates the correct amount of karma when positive', () => {
        expect(helpers.generateKarma(videosPositiveKarma)).toEqual('+10');
    });

    it('Generates the correct amount of karma when negative', () => {
        expect(helpers.generateKarma(videosNegativeKarma)).toEqual('-7');
    });
});

describe('Filtering videod', () => {
    afterAll(() => {
        MockDate.reset();
    });

    it('Filtering only includes videos with that email / title', () => {
        expect(helpers.filterBySearch(videosToFilterNameEmail, 'test')).toEqual([
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: { _seconds: 1580509615, _nanoseconds: 331000000 },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Test abc',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: { _seconds: 1580509615, _nanoseconds: 331000000 },
                email: 'user@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            }
        ]);
    });

    it('Should filter to include only the past 24 hours', () => {
        MockDate.set('9/10/2005'); // 10th Sep
        expect(helpers.sortVideos('pastDay', 'newestFirst', videosToFilterByDate, '')).toEqual([
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1126299659,
                    _nanoseconds: 0 // 9th Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            }
        ]);
    });

    it('Should filter to include only the past week', () => {
        MockDate.set('9/10/2005'); // 10th Sep
        expect(helpers.sortVideos('pastWeek', 'newestFirst', videosToFilterByDate, '')).toEqual([
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1126299659,
                    _nanoseconds: 0 // 9th Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1126213259,
                    _nanoseconds: 0 // 8th Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1125781259,
                    _nanoseconds: 0 // 3rd Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            }
        ]);
    });

    it('Should filter to include only the past month', () => {
        MockDate.set('9/10/2005'); // 10th Sep
        expect(helpers.sortVideos('pastMonth', 'newestFirst', videosToFilterByDate, '')).toEqual([
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1126299659,
                    _nanoseconds: 0 // 9th Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1126213259,
                    _nanoseconds: 0 // 8th Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1125781259,
                    _nanoseconds: 0 // 3rd Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1125694859,
                    _nanoseconds: 0 // 2nd Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1123707659,
                    _nanoseconds: 0 // 10th Aug 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            }
        ]);
    });

    it('Should filter to include only the past year', () => {
        MockDate.set('9/10/2005'); // 10th Sep
        expect(helpers.sortVideos('pastYear', 'newestFirst', videosToFilterByDate, '')).toEqual([
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1126299659,
                    _nanoseconds: 0 // 9th Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1126213259,
                    _nanoseconds: 0 // 8th Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1125781259,
                    _nanoseconds: 0 // 3rd Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1125694859,
                    _nanoseconds: 0 // 2nd Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1123707659,
                    _nanoseconds: 0 // 10th Aug 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1123534859,
                    _nanoseconds: 0 // 8th Aug 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1094850059,
                    _nanoseconds: 0 // 10th Sep 2004 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            }
        ]);
    });

    it('Should filter to include all time', () => {
        MockDate.set('9/10/2005'); // 10th Sep
        expect(helpers.sortVideos('allTime', 'newestFirst', videosToFilterByDate, '')).toEqual([
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1126299659,
                    _nanoseconds: 0 // 9th Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1126213259,
                    _nanoseconds: 0 // 8th Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1125781259,
                    _nanoseconds: 0 // 3rd Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1125694859,
                    _nanoseconds: 0 // 2nd Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1123707659,
                    _nanoseconds: 0 // 10th Aug 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1123534859,
                    _nanoseconds: 0 // 8th Aug 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1094850059,
                    _nanoseconds: 0 // 10th Sep 2004 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 873925259,
                    _nanoseconds: 0 // 10th Sep 1997 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            }
        ]);
    });

    it('Should filter to include all time ordered by reverse date', () => {
        MockDate.set('9/10/2005'); // 10th Sep
        expect(helpers.sortVideos('allTime', 'oldestFirst', videosToFilterByDate, '')).toEqual([
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1126299659,
                    _nanoseconds: 0 // 9th Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1126213259,
                    _nanoseconds: 0 // 8th Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1125781259,
                    _nanoseconds: 0 // 3rd Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1125694859,
                    _nanoseconds: 0 // 2nd Sep 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1123707659,
                    _nanoseconds: 0 // 10th Aug 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1123534859,
                    _nanoseconds: 0 // 8th Aug 2005 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 1094850059,
                    _nanoseconds: 0 // 10th Sep 2004 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: {
                    _seconds: 873925259,
                    _nanoseconds: 0 // 10th Sep 1997 10:00:59 PM
                },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: ['7PVMOpCKtHhLu3XuyUv9oUHKO943'],
                id: 'TvbIMaRdF50Cex5VSWyG'
            }
        ].reverse());
    });

    it('Can sort by most popular', () => {
        expect(helpers.sortVideos('allTime', 'mostPopular', videosByPopularity, '')).toEqual([
            {
                downvotes: [1, 2, 3, 4, 5, 6],
                title: 'Test abc',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: { _seconds: 1580509615, _nanoseconds: 331000000 },
                email: 'user@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: [1, 2, 3, 4, 5, 6, 7, 8],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [1, 2, 3, 4, 5, 6],
                title: 'aafsafsafsafs',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: { _seconds: 1580509615, _nanoseconds: 331000000 },
                email: 'asfasfasfasfafs@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: [1, 2, 3],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: { _seconds: 1580509615, _nanoseconds: 331000000 },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: [1, 2, 3, 4, 5],
                id: 'TvbIMaRdF50Cex5VSWyG'
            }
        ]);
    });

    it('Can sort by least popular', () => {
        expect(helpers.sortVideos('allTime', 'leastPopular', videosByPopularity, '')).toEqual([
            {
                downvotes: [1, 2, 3, 4, 5, 6],
                title: 'Test abc',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: { _seconds: 1580509615, _nanoseconds: 331000000 },
                email: 'user@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: [1, 2, 3, 4, 5, 6, 7, 8],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [1, 2, 3, 4, 5, 6],
                title: 'aafsafsafsafs',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: { _seconds: 1580509615, _nanoseconds: 331000000 },
                email: 'asfasfasfasfafs@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: [1, 2, 3],
                id: 'TvbIMaRdF50Cex5VSWyG'
            },
            {
                downvotes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                title: 'Title',
                videoId: 'LYMGGgbOz1k',
                displayName: 'TestUser',
                dateCreated: { _seconds: 1580509615, _nanoseconds: 331000000 },
                email: 'test@gmail.com',
                userId: '7PVMOpCKtHhLu3XuyUv9oUHKO943',
                upvotes: [1, 2, 3, 4, 5],
                id: 'TvbIMaRdF50Cex5VSWyG'
            }
        ].reverse());
    });
});
