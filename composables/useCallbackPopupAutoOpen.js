const AUTO_OPEN_DELAY_MS = 10_000;

let autoOpenTimer = null;

export const useCallbackPopupAutoOpen = () => {
  const isDialogOpen = useState('toksovo-callback-dialog-open', () => false);

  const cancelAutoOpen = () => {
    if (autoOpenTimer) {
      clearTimeout(autoOpenTimer);
      autoOpenTimer = null;
    }
  };

  const openDialog = () => {
    isDialogOpen.value = true;
  };

  const scheduleAutoOpen = () => {
    if (!import.meta.client || autoOpenTimer) return;

    autoOpenTimer = setTimeout(() => {
      autoOpenTimer = null;
      openDialog();
    }, AUTO_OPEN_DELAY_MS);
  };

  return {
    isDialogOpen,
    cancelAutoOpen,
    scheduleAutoOpen,
    openDialog,
  };
};
