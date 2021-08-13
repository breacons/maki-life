import { useParams } from 'react-router';
import { isEmpty, isLoaded, useFirebaseConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { useMemo } from 'react';
import { firebaseToArray, firebaseToObject } from '../utils/firebase-transformers';
import { User, UserType } from '../interfaces/users';
import { useUserId } from './use-user';
import { Space } from '../interfaces/spaces';

export const useSpaceId = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  return spaceId;
};

export const useSpaces = () => {
  const userId = useUserId();
  useFirebaseConnect([
    { path: `spaces`, queryParams: [`orderByChild=memberIds/${userId}`, `equalTo=true`] },
  ]);
  const spaces = useSelector((state: RootState) => state.firebase.ordered.spaces);

  const transformed = useMemo(() => firebaseToArray(spaces), [spaces]);

  return {
    spaces: transformed,
    isLoaded: isLoaded(spaces),
    isEmpty: isEmpty(spaces),
  };
};

export const useSpace = (): { space: Space | null; isLoaded: boolean; isEmpty: boolean } => {
  const id = useSpaceId();
  useFirebaseConnect([{ path: `spaces/${id}`, storeAs: 'currentSpace' }]);
  const space = useSelector((state: RootState) => state.firebase.ordered.currentSpace);

  const transformed = useMemo(() => firebaseToObject(space), [space]);

  return {
    space: transformed as Space,
    isLoaded: isLoaded(space),
    isEmpty: isEmpty(space),
  };
};

export const useSpaceById = ({
  id,
}: {
  id: string;
}): { space: Space | null; isLoaded: boolean; isEmpty: boolean } => {
  useFirebaseConnect([{ path: `spaces/${id}`, storeAs: 'editedSpace' }]);
  const space = useSelector((state: RootState) => state.firebase.ordered.editedSpace);

  const transformed = useMemo(() => {
    if (space) {
      return firebaseToObject(space);
    }

    return null;
  }, [space]);

  return {
    space: transformed as Space,
    isLoaded: isLoaded(space),
    isEmpty: isEmpty(space),
  };
};

export const useSpaceMembers = (type?: UserType) => {
  const id = useSpaceId();

  useFirebaseConnect([
    {
      path: `users`,
      // queryParams: [`orderByChild=spaceIds/${id}`, 'equalTo=true'],
      // storeAs: 'users',
    },
  ]);

  const users = useSelector((state: RootState) => state.firebase.ordered.users);

  const transformed = useMemo(() => {
    const asArray = firebaseToArray(users);

    if (type) {
      return asArray.filter((user: User) => user.type === type);
    }

    return asArray;
  }, [users, type]);

  return {
    members: transformed,
    isLoaded: isLoaded(users),
    isEmpty: isEmpty(users),
  };
};

export const useSpaceMember = (id: string) => {
  const { members, ...rest } = useSpaceMembers();

  const member = useMemo(() => {
    if (members) {
      return members.find((user) => user.id === id);
    }

    return null;
  }, [members, id]);

  return {
    member,
    ...rest,
  };
};

export const useFetchedSpaceMember = (
  id: string,
): { member: User | null; isLoaded: boolean; isEmpty: boolean } => {
  useFirebaseConnect([
    {
      path: `users/${id}`,
      // queryParams: [`orderByChild=spaceIds/${id}`, 'equalTo=true'],
      // storeAs: 'users',
    },
  ]);

  const users = useSelector((state: RootState) => state.firebase.ordered.users);

  console.log('users', users);

  const member = useMemo(() => {
    if (users) {
      return firebaseToObject((users as any)[id]) as User;
    }

    return null;
  }, [users, id]);

  console.log('member', id, member);

  return {
    member,
    isLoaded: isLoaded(users),
    isEmpty: isEmpty(users),
  };
};
