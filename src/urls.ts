export const URL_LANDING = '/';
export const URL_LOGIN = '/login';
export const URL_SIGNUP = '/signup';
export const URL_SPACES = '/spaces';
export const URL_CREATE_SPACE = `${URL_SPACES}/create`;
export const URL_SPACE_DETAILS = `${URL_SPACES}/:spaceId`;
export const URL_SPACE_DISCUSSIONS = `${URL_SPACE_DETAILS}/discussions`;
export const URL_SPACE_DISCUSSION_DETAIL = `${URL_SPACE_DISCUSSIONS}/:discussionId`;
export const URL_SPACE_DISCUSSION_SUBMISSIONS = `${URL_SPACE_DISCUSSIONS}/:discussionId/submissions`;
export const URL_SPACE_DISCUSSION_SUBMISSION_DETAIL = `${URL_SPACE_DISCUSSION_SUBMISSIONS}/:submissionId`;
export const URL_SPACE_CHANGE = `${URL_SPACE_DISCUSSION_DETAIL}/changes/:changeId`;
export const URL_SPACE_CHANGE_DETAILS = `${URL_SPACE_CHANGE}/details`;
export const URL_SPACE_CHANGE_EDIT = `${URL_SPACE_CHANGE}/edit`;
export const URL_SPACE_REQUEST = `${URL_SPACE_DISCUSSION_DETAIL}/requests/:requestId`;
export const URL_SPACE_REQUEST_DETAILS = `${URL_SPACE_REQUEST}/details`;
export const URL_SPACE_REQUEST_EDIT = `${URL_SPACE_REQUEST}/edit`;
export const URL_SPACE_CHANGE_CREATE = `${URL_SPACE_DISCUSSION_DETAIL}/changes/create`;
export const URL_SPACE_REQUEST_CREATE = `${URL_SPACE_DISCUSSION_DETAIL}/requests/create`;

export const getSpaceDetailsUrl = (spaceId: string) =>
  URL_SPACE_DETAILS.replace(':spaceId', spaceId);

export const getSpaceDiscussionsUrl = (spaceId: string) =>
  URL_SPACE_DISCUSSIONS.replace(':spaceId', spaceId);

export const getDiscussionDetailUrl = (spaceId: string, discussionId: string) =>
  URL_SPACE_DISCUSSION_DETAIL.replace(':spaceId', spaceId).replace(':discussionId', discussionId);

export const getSubmissionDetailUrl = (
  spaceId: string,
  discussionId: string,
  submissionId: string,
) =>
  URL_SPACE_DISCUSSION_SUBMISSION_DETAIL.replace(':spaceId', spaceId)
    .replace(':discussionId', discussionId)
    .replace(':submissionId', submissionId);

export const getDiscussionChangeCreateUrl = (spaceId: string, discussionId: string) =>
  URL_SPACE_CHANGE_CREATE.replace(':spaceId', spaceId).replace(':discussionId', discussionId);

export const getDiscussionRequestCreateUrl = (spaceId: string, discussionId: string) =>
  URL_SPACE_REQUEST_CREATE.replace(':spaceId', spaceId).replace(':discussionId', discussionId);

export const getDiscussionChangeUrl = (spaceId: string, discussionId: string, changeId: string) =>
  URL_SPACE_CHANGE.replace(':spaceId', spaceId)
    .replace(':discussionId', discussionId)
    .replace(':changeId', changeId);

export const getDiscussionChangeDetailsUrl = (
  spaceId: string,
  discussionId: string,
  changeId: string,
) =>
  URL_SPACE_CHANGE_DETAILS.replace(':spaceId', spaceId)
    .replace(':discussionId', discussionId)
    .replace(':changeId', changeId);

export const getDiscussionChangeEditUrl = (
  spaceId: string,
  discussionId: string,
  changeId: string,
) =>
  URL_SPACE_CHANGE_EDIT.replace(':spaceId', spaceId)
    .replace(':discussionId', discussionId)
    .replace(':changeId', changeId);

export const getDiscussionRequestUrl = (spaceId: string, discussionId: string, requestId: string) =>
  URL_SPACE_REQUEST.replace(':spaceId', spaceId)
    .replace(':discussionId', discussionId)
    .replace(':requestId', requestId);

export const getDiscussionRequestDetailsUrl = (
  spaceId: string,
  discussionId: string,
  requestId: string,
) =>
  URL_SPACE_REQUEST_DETAILS.replace(':spaceId', spaceId)
    .replace(':discussionId', discussionId)
    .replace(':requestId', requestId);

export const getDiscussionRequestEditUrl = (
  spaceId: string,
  discussionId: string,
  requestId: string,
) =>
  URL_SPACE_REQUEST_EDIT.replace(':spaceId', spaceId)
    .replace(':discussionId', discussionId)
    .replace(':requestId', requestId);
