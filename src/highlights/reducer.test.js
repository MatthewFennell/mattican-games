import reducer, { initialState } from './reducer';
import * as actions from './actions';
import * as adminActions from '../admin/actions';
import * as profileActions from '../profile/actions';


describe('Leagues reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('fetch highlights request', () => {
        const action = actions.fetchHighlightsRequest();
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            loadingVideos: true
        });
    });

    it('fetch highlights success', () => {
        const videos = ['a', 'b', 'c'];
        const action = actions.fetchHighlightsSuccess(videos);
        expect(reducer({
            ...initialState,
            loadingVideos: true
        }, action)).toEqual({
            ...initialState,
            videos,
            loadedVideos: true
        });
    });

    it('upvote highlight success', () => {
        const oldVideos = [{
            id: 'highlightId',
            upvotes: ['userOne']
        },
        {
            id: 'not touched',
            upvotes: []
        }];
        const newVideo = {
            id: 'highlightId',
            upvotes: ['userOne', 'userTwo']
        };
        const action = actions.upvoteHighlightSuccess(newVideo);
        expect(reducer({
            ...initialState,
            videos: oldVideos
        }, action)).toEqual({
            ...initialState,
            videos: [newVideo, {
                id: 'not touched',
                upvotes: []
            }]
        });
    });

    it('downvote highlight success', () => {
        const oldVideos = [{
            id: 'highlightId',
            upvotes: ['userOne', 'userTwo']
        }, {
            id: 'not touched',
            upvotes: []
        }];
        const newVideo = {
            id: 'highlightId',
            upvotes: ['userOne']
        };
        const action = actions.downvoteHighlightSuccess(newVideo);
        expect(reducer({
            ...initialState,
            videos: oldVideos
        }, action)).toEqual({
            ...initialState,
            videos: [newVideo, {
                id: 'not touched',
                upvotes: []
            }]
        });
    });

    it('already fetched videos', () => {
        const action = actions.alreadyFetchedVideos();
        expect(reducer({
            ...initialState,
            loadingVideos: true
        }, action)).toEqual({
            ...initialState,
            loadedVideos: false
        });
    });

    it('fetch user highlights to be approved success', () => {
        const highlights = ['a', 'b', 'c'];
        const action = actions.fetchUserHighlightsToBeApprovedSuccess(highlights);
        expect(reducer({
            ...initialState,
            loadingVideosToBeApproved: true
        }, action)).toEqual({
            ...initialState,
            videosToBeApproved: highlights,
            loadingVideosToBeApproved: false,
            loadedVideosToBeApproved: true
        });
    });

    it('fetch rejected highlights success', () => {
        const highlights = ['a', 'b', 'c'];
        const action = actions.fetchRejectedHighlightsSuccess(highlights);
        expect(reducer({
            ...initialState,
            loadingRejectedVideos: true
        }, action)).toEqual({
            ...initialState,
            videosRejected: highlights,
            loadingRejectedVideos: false,
            loadedRejectedVideos: true
        });
    });

    it('fetch user highlights to be approved', () => {
        const action = actions.fetchUserHighlightsToBeApprovedRequest();
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            loadingVideosToBeApproved: true
        });
    });

    it('fetch rejected user highlights to be approved', () => {
        const action = actions.fetchRejectedHighlightsRequest();
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            loadingRejectedVideos: true
        });
    });

    it('already fetched rejected videos', () => {
        const action = actions.alreadyFetchedRejectedVideos();
        expect(reducer({
            ...initialState,
            loadingRejectedVideos: true
        }, action)).toEqual({
            ...initialState,
            loadingRejectedVideos: false
        });
    });

    it('already fetched approved videos', () => {
        const action = actions.alreadyFetchedApprovedHighlights();
        expect(reducer({
            ...initialState,
            loadingVideosToBeApproved: true
        }, action)).toEqual({
            ...initialState,
            loadingVideosToBeApproved: false
        });
    });

    it('delete highlight success', () => {
        const highlightToDelete = {
            id: 'deleteMe',
            title: 'title'
        };
        const currentVideos = [
            {
                id: 'deleteMe',
                title: 'title'
            },
            {
                id: 'not deleted',
                title: 'not to delete'
            }
        ];
        const newVideos = [{
            id: 'not deleted',
            title: 'not to delete'
        }];
        const action = adminActions.deleteHighlightSuccess(highlightToDelete);
        expect(reducer({
            ...initialState,
            videos: currentVideos,
            loadingVideos: true
        }, action)).toEqual({
            ...initialState,
            videos: newVideos,
            loadingVideos: false
        });
    });

    it('approve highlight success', () => {
        const newHighlight = {
            id: 'idOne',
            title: 'to be approved'
        };

        const existing = [{
            id: 'idTwo',
            title: 'alreadyHere'
        },
        {
            id: 'idThree',
            title: 'also here'
        }];

        const action = adminActions.approveHighlightSuccess(newHighlight);
        expect(reducer({
            ...initialState,
            loadingVideos: true,
            videos: existing
        }, action)).toEqual({
            ...initialState,
            loadingVideos: false,
            videos: existing.concat(newHighlight)
        });
    });

    it('reapprove rejected highlight success', () => {
        const newHighlight = {
            id: 'idOne',
            title: 'to be approved'
        };

        const existing = [{
            id: 'idTwo',
            title: 'alreadyHere'
        },
        {
            id: 'idThree',
            title: 'also here'
        }];
        const action = adminActions.reapproveRejectedHighlightSuccess(newHighlight);
        expect(reducer({
            ...initialState,
            loadingVideos: true,
            videos: existing
        }, action)).toEqual({
            ...initialState,
            loadingVideos: false,
            videos: existing.concat(newHighlight)
        });
    });

    it('approve highlight request', () => {
        const action = adminActions.approveHighlightRequest(null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            loadingVideos: true
        });
    });

    it('reapprove rejected highlight request', () => {
        const action = adminActions.reapproveRejectedHighlightRequest(null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            loadingVideos: true
        });
    });

    it('delete highlight request', () => {
        const action = adminActions.deleteHighlightRequest(null);
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            loadingVideos: true
        });
    });

    it('add comment to video success', () => {
        const video = {
            id: 'videoId',
            title: 'yes',
            comments: ['comment']
        };

        const currentVideos = [{
            id: 'videoId',
            title: 'yes',
            comments: []
        }, {
            id: 'not touched',
            upvotes: []
        }];
        const action = actions.addCommentToVideoSuccess(video);
        expect(reducer({
            ...initialState,
            videos: currentVideos
        }, action)).toEqual({
            ...initialState,
            videos: [video, {
                id: 'not touched',
                upvotes: []
            }]
        });
    });

    it('add reply to video success', () => {
        const video = {
            id: 'videoId',
            title: 'yes',
            comments: ['comment']
        };

        const currentVideos = [{
            id: 'videoId',
            title: 'yes',
            comments: []
        }, {
            id: 'not touched',
            upvotes: []
        }];
        const action = actions.addReplyToVideoSuccess(video);
        expect(reducer({
            ...initialState,
            videos: currentVideos
        }, action)).toEqual({
            ...initialState,
            videos: [video, {
                id: 'not touched',
                upvotes: []
            }]
        });
    });

    it('delete comment success', () => {
        const currentVideos = [{
            id: 'videoId',
            title: 'yes',
            comments: [
                {
                    id: 'not comment',
                    title: 'oh'
                },
                {
                    id: 'commentId',
                    comment: 'message'
                }
            ]
        },
        {
            id: 'not touched',
            upvotes: []
        }];
        const remainingVideos = [
            {
                id: 'videoId',
                title: 'yes',
                comments: [
                    {
                        id: 'not comment',
                        title: 'oh'
                    }
                ]
            },
            {
                id: 'not touched',
                upvotes: []
            }
        ];
        const action = actions.deleteCommentSuccess('videoId', 'commentId');
        expect(reducer({
            ...initialState,
            videos: currentVideos
        }, action)).toEqual({
            ...initialState,
            videos: remainingVideos
        });
    });

    it('delete reply success', () => {
        const currentVideos = [{
            id: 'videoId',
            title: 'yes',
            comments: [
                {
                    id: 'not comment',
                    title: 'oh',
                    comments: [
                        {
                            id: 'keep this reply',
                            reply: 'keep me'
                        }
                    ]
                },
                {
                    id: 'commentId',
                    comment: 'message',
                    comments: [
                        {
                            id: 'replyId',
                            reply: 'some reply'
                        },
                        {
                            id: 'another Id',
                            reply: 'hey'
                        }
                    ]
                }
            ]
        }, {
            id: 'not touched',
            upvotes: []
        }];
        const newVideos = [{
            id: 'videoId',
            title: 'yes',
            comments: [
                {
                    id: 'not comment',
                    title: 'oh',
                    comments: [
                        {
                            id: 'keep this reply',
                            reply: 'keep me'
                        }
                    ]
                },
                {
                    id: 'commentId',
                    comment: 'message',
                    comments: [
                        {
                            id: 'another Id',
                            reply: 'hey'
                        }
                    ]
                }
            ]
        }, {
            id: 'not touched',
            upvotes: []
        }];
        const action = actions.deleteReplySuccess('videoId', 'commentId', 'replyId');
        expect(reducer({
            ...initialState,
            videos: currentVideos
        }, action)).toEqual({
            ...initialState,
            videos: newVideos
        });
    });

    it('update profile picture', () => {
        const currentVideos = [{
            id: 'videoId',
            title: 'yes',
            comments: [
                {
                    id: 'not comment',
                    title: 'oh',
                    userId: 'userId',
                    photoUrl: 'originalPhotoId',
                    comments: [
                        {
                            id: 'keep this reply',
                            reply: 'keep me',
                            userId: 'userId',
                            photoUrl: 'originalPhotoId'
                        },
                        {
                            id: 'not touched',
                            userId: 'ignored',
                            upvotes: []
                        }
                    ]
                },
                {
                    id: 'commentId',
                    comment: 'message',
                    comments: [
                        {
                            id: 'replyId',
                            reply: 'some reply'
                        },
                        {
                            id: 'another Id',
                            reply: 'hey'
                        },
                        {
                            id: 'touched',
                            userId: 'userId',
                            photoUrl: 'originalPhotoId'
                        }
                    ]
                }
            ]
        }];
        const newVideos = [{
            id: 'videoId',
            title: 'yes',
            comments: [
                {
                    id: 'not comment',
                    title: 'oh',
                    userId: 'userId',
                    photoUrl: 'newPhotoId',
                    comments: [
                        {
                            id: 'keep this reply',
                            reply: 'keep me',
                            userId: 'userId',
                            photoUrl: 'newPhotoId'
                        },
                        {
                            id: 'not touched',
                            userId: 'ignored',
                            upvotes: []
                        }
                    ]
                },
                {
                    id: 'commentId',
                    comment: 'message',
                    comments: [
                        {
                            id: 'replyId',
                            reply: 'some reply'
                        },
                        {
                            id: 'another Id',
                            reply: 'hey'
                        },
                        {
                            id: 'touched',
                            userId: 'userId',
                            photoUrl: 'newPhotoId'
                        }
                    ]
                }
            ]
        }];
        const action = profileActions.updateProfilePictureSuccess('newPhotoId', 'userId');
        expect(reducer({
            ...initialState,
            videos: currentVideos
        }, action)).toEqual({
            ...initialState,
            videos: newVideos
        });
    });

    it('set highlight error', () => {
        const action = actions.setHighlightError({
            message: 'Error message',
            code: 'Error code'
        }, 'Error header');
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            errorMessage: 'Error message',
            errorCode: 'Error code',
            errorHeader: 'Error header'
        });
    });

    it('close highlight error', () => {
        const action = actions.closeHighlightError();
        expect(reducer({
            ...initialState,
            errorMessage: 'Error message',
            errorCode: 'Error code',
            errorHeader: 'Error header'
        }, action)).toEqual({
            ...initialState,
            errorMessage: '',
            errorCode: '',
            errorHeader: ''
        });
    });

    it('set success message', () => {
        const action = actions.setSuccessMessage('message');
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            successMessage: 'message'
        });
    });

    it('close success message', () => {
        const action = actions.closeSuccessMessage();
        expect(reducer({
            ...initialState,
            successMessage: 'success'
        }, action)).toEqual({
            ...initialState,
            successMessage: ''
        });
    });
});
