export default defineNuxtPlugin(() => {
  const { scheduleAutoOpen } = useCallbackPopupAutoOpen();
  scheduleAutoOpen();
});
