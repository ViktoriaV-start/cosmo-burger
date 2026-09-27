type UseProfilePageReturn = {
  onLogout: () => void;
};

export const useProfilePage = (): UseProfilePageReturn => {
  const onLogout = (): void => {
    // TODO: выход через API
  };

  return {
    onLogout,
  };
};
