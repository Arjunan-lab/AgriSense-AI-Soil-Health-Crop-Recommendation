import { useAuth } from '../contexts/AuthContext';

export function useUser() {
  const { user, isAuthenticated, loading, updateUser } = useAuth();
  return {
    user,
    isAuthenticated,
    loading,
    updateUser,
  };
}

export default useUser;
