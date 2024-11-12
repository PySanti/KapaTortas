import EmailVerification from '../../components/email-verification';
import { Suspense } from 'react';

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <EmailVerification />
    </Suspense>
  );
}
