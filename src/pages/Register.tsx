import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, BadgeCheck } from "lucide-react";
import { LightLayout } from "../components/LightLayout";
import { UnderlineInput } from "../components/ui/UnderlineInput";
import { CircularButton } from "../components/ui/CircularButton";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

type Gender = "male" | "female" | "brand";

export default function Register() {
  const navigate = useNavigate();
  const { updateProfile, user } = useAuth();
  
  const [gender, setGender] = useState<Gender>("male");
  const [formData, setFormData] = useState({
    username: "",
    month: "",
    day: "",
    year: "",
    recoveryEmail: ""
  });

  // Pre-fill if data exists
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || "",
        recoveryEmail: user.recoveryEmail || "",
        month: user.birthday.month || "",
        day: user.birthday.day || "",
        year: user.birthday.year || ""
      }));
      if (user.gender) setGender(user.gender);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    if (isValid) {
      updateProfile({
        username: formData.username,
        birthday: { month: formData.month, day: formData.day, year: formData.year },
        gender,
        recoveryEmail: formData.recoveryEmail
      });
      navigate('/profile');
    }
  };

  const GenderOption = ({ type, label, icon: Icon }: { type: Gender; label: string; icon: any }) => (
    <button
      onClick={() => setGender(type)}
      className="flex flex-col items-center gap-2 group"
    >
      <div className={cn(
        "transition-colors duration-200",
        gender === type ? "text-brand" : "text-gray-600"
      )}>
        <Icon size={40} fill={gender === type ? "currentColor" : "none"} strokeWidth={1.5} />
      </div>
      <span className={cn(
        "text-sm font-medium",
        gender === type ? "text-brand" : "text-brand/60"
      )}>
        {label}
      </span>
    </button>
  );

  // Basic validation
  const isValid = formData.username.length > 0;

  return (
    <LightLayout>
      <div className="mt-4 space-y-10">
        {/* Username */}
        <UnderlineInput
          label="User name?"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        {/* Birthday */}
        <div>
          <label className="text-xl font-bold text-gray-400 block mb-4">
            When's is your birthday?
          </label>
          <div className="flex gap-6">
            <input
              name="month"
              placeholder="Month"
              value={formData.month}
              onChange={handleChange}
              className="w-1/3 bg-transparent border-b-[3px] border-brand/60 focus:border-brand text-xl text-gray-700 pb-2 focus:outline-none text-center font-bold placeholder-gray-400"
            />
            <input
              name="day"
              placeholder="Day"
              value={formData.day}
              onChange={handleChange}
              className="w-1/4 bg-transparent border-b-[3px] border-brand/60 focus:border-brand text-xl text-gray-700 pb-2 focus:outline-none text-center font-bold placeholder-gray-400"
            />
            <input
              name="year"
              placeholder="Year"
              value={formData.year}
              onChange={handleChange}
              className="w-1/3 bg-transparent border-b-[3px] border-brand/60 focus:border-brand text-xl text-gray-700 pb-2 focus:outline-none text-center font-bold placeholder-gray-400"
            />
          </div>
        </div>

        {/* Gender Selection */}
        <div className="flex justify-between px-4 py-2">
          <GenderOption type="male" label="Male" icon={User} />
          <GenderOption type="female" label="Female" icon={User} />
          <GenderOption type="brand" label="Brand" icon={BadgeCheck} />
        </div>

        {/* Recovery Email */}
        <UnderlineInput
          label="Recovery email?"
          name="recoveryEmail"
          value={formData.recoveryEmail}
          onChange={handleChange}
        />
      </div>

      <div className="mt-auto mb-4 flex justify-center">
        <CircularButton 
          active={isValid}
          onClick={handleContinue} 
        />
      </div>
    </LightLayout>
  );
}
