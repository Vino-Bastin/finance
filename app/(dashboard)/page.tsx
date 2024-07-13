"use client";

import { Button } from "../../components/ui/button";
import useNewAccount from "../../features/accounts/hooks/useNewAccount";

export default function Home() {
  const { open } = useNewAccount();

  return <Button onClick={() => open()}>Open</Button>;
}
