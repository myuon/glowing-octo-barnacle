import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../api/firebase";
import { TextButton } from "../components/Button";

const provider = new GoogleAuthProvider();

export const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <TextButton
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
      </TextButton>
    </div>
  );
};

export default LoginPage;
