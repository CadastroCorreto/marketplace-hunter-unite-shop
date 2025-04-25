
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AuthForm from './AuthForm';

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal = ({ isOpen, onOpenChange }: AuthModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
