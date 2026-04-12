import { useState } from 'react';

export const useModalManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('create'); // 'create' | 'preview' | 'customize'
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  // Modal navigation functions
  const openModal = (content = 'create') => {
    setIsModalOpen(true);
    setModalContent(content);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('create');
    setActiveImageIndex(null);
  };

  const showCreatePost = () => {
    setModalContent('create');
    setActiveImageIndex(null);
  };

  const showImagePreview = (index) => {
    setModalContent('preview');
    setActiveImageIndex(index);
  };

  const showImageCustomizer = (index) => {
    setModalContent('customize');
    setActiveImageIndex(index);
  };

  const handleBackToCreate = () => {
    setModalContent('create');
    setActiveImageIndex(null);
  };

  // Get modal props based on current content
  const getModalProps = () => {
    switch (modalContent) {
      case 'preview':
        return {
          title: null,
          size: "4xl",
          showCloseButton: false,
          closeOnBackdrop: true,
          className: "max-h-[95vh]"
        };
      case 'customize':
        return {
          title: "Customize Image",
          size: "4xl",
          showCloseButton: true,
          closeOnBackdrop: false,
          className: "max-h-[95vh]"
        };
      default: // create
        return {
          title: "Tạo bài viết mới",
          size: "4xl",
          showCloseButton: true,
          closeOnBackdrop: false,
          className: "max-h-[95vh]"
        };
    }
  };

  return {
    // State
    isModalOpen,
    modalContent,
    activeImageIndex,
    
    // Actions
    openModal,
    closeModal,
    showCreatePost,
    showImagePreview,
    showImageCustomizer,
    handleBackToCreate,
    
    // Computed
    getModalProps
  };
};