import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../api/firebase";

const useAuth = () => {
  return {
    login: async (token: string, userId: string) => {
      return;
    },
  };
};

const provider = new GoogleAuthProvider();

export const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div>
      <button
        onClick={async () => {
          const result = await signInWithPopup(auth, provider);
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          if (!token) {
            return;
          }

          await login(token, result.user.uid);
        }}
      >
        Sign In With Google
      </button>
    </div>
  );
};

export default LoginPage;
