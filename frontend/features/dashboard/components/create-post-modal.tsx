"use client";

import { CreatePostForm } from "./create-post-form";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function CreatePostModal({ open, onClose, onSuccess }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-white/[0.08] bg-[#0c0f16] p-5 shadow-2xl sm:rounded-2xl"
        role="dialog"
        aria-labelledby="create-post-title"
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 id="create-post-title" className="font-serif text-xl font-semibold text-white">
            New signal
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/45 transition hover:bg-white/[0.06] hover:text-white"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <CreatePostForm
          variant="modal"
          onSuccess={onSuccess}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
