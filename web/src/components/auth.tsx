import { auth } from "../api/firebase";

export const getAuthToken = async () => {
  if (auth.currentUser) {
    return await auth.currentUser?.getIdToken();
  } else {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        unsubscribe();
        if (user) {
          resolve(await user.getIdToken());
        }
        reject();
      });
    });
  }
};
