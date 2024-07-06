import React from "react";
import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const SignInPage = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full flex flex-col justify-center items-center px-4">
        <div className="text-center space-y-2 pt-16">
          <h1 className="text-3xl font-bold text-[#2e2a47]">Welcome Back!</h1>
          <p className="text-base text-[#7e8ca0]">
            Login or Create account to get back your dashboard
          </p>
        </div>
        <div className="flex justify-center items-center mt-4">
          <ClerkLoading>
            <Loader2 size={48} className="animate-spin text-muted-foreground" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignIn path="/sign-in" />
          </ClerkLoaded>
        </div>
      </div>
      <div className="hidden lg:flex h-full items-center justify-center bg-blue-600">
        <Image src="logo.svg" alt="Logo" width={100} height={100} />
      </div>
    </div>
  );
};

export default SignInPage;
