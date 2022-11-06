import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "../api/firebase";
import { useAuth } from "../components/auth";

const provider = new GoogleAuthProvider();

export const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div>
      <Link to="/">INDEX</Link>

      <button
        onClick={async () => {
          const result = await signInWithPopup(auth, provider);
          const credential = GoogleAuthProvider.credentialFromResult(result);
          console.log(credential);

          const token = await auth.currentUser?.getIdToken();
          if (!token) {
            return;
          }
          console.log(token);

          await login(token);
        }}
      >
        Sign In With Google
      </button>
    </div>
  );
};

export default LoginPage;
