import { auth } from "../api/firebase";

export const getAuthToken = async () => {
  return await auth.currentUser?.getIdToken();
};
