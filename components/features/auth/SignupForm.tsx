"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useStore } from "@/store";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { apiClient } from "@/lib/api/client";

interface SignupFormProps {
  onSubmit?: (data: SignupFormData) => void; // Optional onSubmit callback
}

interface SignupFormData {
  email: string;
  password: string;
  // ... other fields if needed (e.g., username)
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, setUser } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState<SignupFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!signupData.email || !signupData.password) {
        setError("Please enter both email and password");
        setIsLoading(false);
        return;
      }

      const response = await apiClient.post("/api/auth/signup", signupData);

      if (response.ok) {
        // Handle successful signup (e.g., redirect to login or dashboard)
        if (onSubmit) {
          onSubmit(signupData); // Call the onSubmit callback if provided
        } else {
          // Default behavior - redirect to login or dashboard
          router.push("/auth/login");
        }
        setIsLoading(false);
      } else {
        setError(response.data.message || "Failed to sign up");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Failed to sign up. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-500">{error}</p>}

      <Input
        id="email"
        type="email"
        placeholder="Email"
        value={signupData.email}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2"
      />

      <Input
        id="password"
        type="password"
        placeholder="Password"
        value={signupData.password}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2"
      />

      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
        className="bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-brand-primary-dark"
      >
        {isLoading ? "Signing up..." : "Sign Up"}
      </Button>
    </form>
  );
};

export default SignupForm;