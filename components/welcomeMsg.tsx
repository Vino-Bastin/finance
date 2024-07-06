"use client";

import { useUser } from "@clerk/nextjs";

const WelcomeMsg = () => {
  const { isLoaded, user } = useUser();
  return (
    <div className="space-y-2 mb-4">
      <h1 className="text-white text-2xl lg:text-4xl font-medium">
        Welcome Back{isLoaded && user?.firstName ? `, ${user.firstName} ` : " "}
        👋
      </h1>
      <p className="text-sm lg:text-base text-[#89b6fd]">
        This is your financial overview report
      </p>
    </div>
  );
};

export default WelcomeMsg;
