import EmailVerificationForm from '@/components/email-verification-form';
import { Suspense } from 'react';

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <EmailVerificationForm />
    </Suspense>
  );
}
