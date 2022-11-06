import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../api/firebase";

const provider = new GoogleAuthProvider();

export const LoginPage = () => {
  const navigate = useNavigate();

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

          navigate("/");
        }}
      >
        Sign In With Google
      </button>
    </div>
  );
};

export default LoginPage;
