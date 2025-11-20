import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LightLayout } from "../components/LightLayout";
import { UnderlineInput } from "../components/ui/UnderlineInput";
import { CircularButton } from "../components/ui/CircularButton";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValid = formData.username.length > 0 && formData.password.length > 0;

  const handleLogin = () => {
    if (isValid) {
        // Simulate login
        login("123-456-7890"); 
        updateProfile({ username: formData.username });
        // Redirect to Dashboard instead of Profile
        navigate('/dashboard');
    }
  };

  return (
    <LightLayout>
      <div className="mt-8 space-y-12">
        <UnderlineInput
          label="User name"
          name="username"
          value={formData.username}
          onChange={handleChange}
          type="text"
        />

        <UnderlineInput
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
        />
      </div>

      <div className="mt-auto mb-8 flex justify-center">
        <CircularButton 
          active={isValid}
          onClick={handleLogin} 
        />
      </div>
    </LightLayout>
  );
}
