'use client';

import { signOut } from 'next-auth/react';
import { Button } from './ui/button';

export default function SignOutButton() {
  return (
    <Button
      onClick={() => {
        signOut({
          callbackUrl: `${window.location.origin}/login`, // Use `callbackUrl` for redirection
        });
      }}
    >
      Sign Out
    </Button>
  );
}
