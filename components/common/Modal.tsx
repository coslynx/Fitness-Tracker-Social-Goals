"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { useStore } from "@/store";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  ...props
}) => {
  const { isOpen: storeIsOpen, setIsOpen } = useStore();

  const handleModalClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 overflow-y-auto",
        storeIsOpen && "flex items-center justify-center min-h-screen",
        props.className
      )}
    >
      {storeIsOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      )}
      {storeIsOpen && (
        <div
          className="relative w-full max-w-md mx-auto overflow-hidden rounded-lg shadow-xl"
          {...props}
        >
          <div className="bg-white px-6 py-8 rounded-lg shadow-md">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full"
              >
                <span className="sr-only">Close modal</span>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;