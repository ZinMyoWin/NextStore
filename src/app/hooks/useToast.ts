import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const toast = ({ title, description, variant = 'default' }: ToastOptions) => {
    if (variant === 'destructive') {
      sonnerToast.error(title, {
        description: description,
      });
    } else {
      sonnerToast(title, {
        description: description,
      });
    }
  };

  return { toast };
} 