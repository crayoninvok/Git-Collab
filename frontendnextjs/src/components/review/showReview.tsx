// src/components/ReviewModal.tsx
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ReviewForm from './makeReview';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  userId: string;
  isEventFinished: boolean;
}

const ReviewModal = ({ isOpen, onClose, eventId, userId, isEventFinished }: ReviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="p-4">
          <ReviewForm 
            eventId={eventId} 
            userId={userId} 
            isEventFinished={isEventFinished} 
            onSuccess={() => {
              onClose();
              window.location.reload();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;