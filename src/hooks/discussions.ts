import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty, isLoaded, useFirebaseConnect } from 'react-redux-firebase';
import { useParams } from 'react-router';

import { Discussion } from '../interfaces/discussions';
import { RootState } from '../redux/reducers';
import {
  firebaseObjectToArray,
  firebaseToArray,
  firebaseToObject,
} from '../utils/firebase-transformers';

export const useDiscussions = (): {
  discussions: Discussion[];
  isLoaded: boolean;
  isEmpty: boolean;
} => {
  const { spaceId } = useParams<{
    spaceId: string;
  }>();

  console.log('useDiscussions', spaceId)
  useFirebaseConnect([
    {
      path: 'discussions',
      queryParams: ['orderByChild=spaceId', `equalTo=${spaceId}`],
    },
  ]);

  const discussions = useSelector((state: RootState) => state.firebase.data.discussions);
  // console.log('Discussions', discussions);
  const data = useMemo(() => {
    return firebaseObjectToArray<Discussion>(discussions);
  }, [discussions]);

  return {
    discussions: data,
    isLoaded: isLoaded(discussions),
    isEmpty: isEmpty(discussions),
  };
};

export const useDiscussion = () => {
  const { discussionId } = useParams<{
    discussionId: string;
  }>();

  const { discussions, isLoaded, isEmpty } = useDiscussions();
  const selectedDiscussion = useMemo(() => {
    if (!discussionId || !discussions) return null;
    return discussions.find((d) => d.id === discussionId);
  }, [discussions, discussionId]);

  return {
    discussion: selectedDiscussion,
    isLoaded,
    isEmpty,
  };
};

export const useDiscussionChange = () => {
  const { changeId } = useParams<{
    changeId: string;
  }>();

  const { discussion, isLoaded, isEmpty } = useCurrentDiscussion();

  const change = useMemo(() => {
    if (discussion && changeId) {
      return discussion?.changes[changeId];
    }

    return null;
  }, [discussion, changeId]);

  return {
    change,
    isLoaded,
    isEmpty: isEmpty || !change,
  };
};

export const useDiscussionRequest = () => {
  const { requestId } = useParams<{
    requestId: string;
  }>();

  const { discussion, isLoaded, isEmpty } = useCurrentDiscussion();

  const request = useMemo(() => {
    if (discussion && requestId) {
      return (discussion as Discussion).requests[requestId];
    }

    return null;
  }, [discussion, requestId]);

  return {
    request,
    isLoaded,
    isEmpty: isEmpty || !request,
  };
};

export const useCurrentDiscussion = (): {
  discussion: Discussion | null;
  isLoaded: boolean;
  isEmpty: boolean;
} => {
  const { spaceId, discussionId } = useParams<{
    spaceId: string;
    discussionId: string;
  }>();
  useFirebaseConnect([
    {
      path: `discussions/${discussionId}`,
      // queryParams: ['orderByChild=spaceId', `equalTo=${spaceId}`],
      storeAs: 'currentDiscussion',
    },
  ]);

  const discussion = useSelector((state: RootState) => state.firebase.ordered.currentDiscussion);

  const data = useMemo(() => {
    if (discussion) {
      return firebaseToObject(discussion);
    }

    return null;
  }, [discussion]);

  return {
    discussion: data as Discussion,
    isLoaded: isLoaded(discussion),
    isEmpty: isEmpty(discussion),
  };
};
