import { LoginForm } from '@/components/auth/loginForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <LoginForm />
    </main>
  );
}
