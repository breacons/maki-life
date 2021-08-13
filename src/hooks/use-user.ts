import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { User, UserType } from '../interfaces/users';
import { useSpace, useSpaceById } from './use-space';
import { useMemo } from 'react';

export const useUserId = () => {
  const { uid } = useSelector((state: RootState) => state.firebase.auth);
  return uid;
};

export const useProfile = (): User => {
  return (useSelector((state: RootState) => state.firebase.profile) as unknown) as User;
};

export const useAuth = () => {
  return useSelector((state: RootState) => state.firebase.auth);
};

export const useIsEditor = () => {
  const profile = useProfile();

  return profile.type === UserType.Editor;
};

export const useIsAdmin = () => {
  const userId = useUserId();
  const { space, isLoaded } = useSpace();

  const isAdmin = useMemo(() => {
    if (userId && space) {
      return Object.keys(space.adminIds || {}).includes(userId);
    }

    return false;
  }, [userId, space]);

  return {
    isAdmin,
    isLoaded,
  };
};

export const useIsAdminBySpaceId = ({ spaceId }: { spaceId: string }) => {
  const userId = useUserId();
  const { space, isLoaded } = useSpaceById({ id: spaceId });

  const isAdmin = useMemo(() => {
    if (userId && space) {
      return Object.keys(space.adminIds || {}).includes(userId);
    }

    return false;
  }, [userId, space]);

  return {
    isAdmin,
    isLoaded,
  };
};
