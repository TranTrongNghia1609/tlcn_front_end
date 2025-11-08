import React, { useState } from 'react';
import TurndownService from 'turndown';
import { useUser } from '../../context/UserContext';
import { createPost, uploadPostImages, uploadPostImageSingle } from '../../services/postService';
import Modal from '../common/Modal';
import { useModalManager } from '../../hooks/useModalManager';
import ModalContentRenderer from './CreatePostComponent/ModalContentRenderer';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useUser();
  
  const modalManager = useModalManager();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    codeSnippet: '',
    tags: [],
    images: [],
    imageFiles: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    fence: '```',
    emDelimiter: '_',
    strongDelimiter: '**',
    linkStyle: 'inlined'
  });

  // Custom rules
  turndownService.addRule('strikethrough', {
    filter: ['del', 's', 'strike'],
    replacement: (content) => '~~' + content + '~~'
  });

  turndownService.addRule('underline', {
    filter: 'u',
    replacement: (content) => '<u>' + content + '</u>'
  });

  // Form handlers
  const handleContentChange = (htmlContent) => {
    const markdownContent = turndownService.turndown(htmlContent);
    console.log('📄 Markdown output:', markdownContent);
    setFormData(prev => ({
      ...prev,
      content: markdownContent
    }));
  };

  const handleAddTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, tag]
    }));
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageFilesChange = (files) => {
    console.log('🔍 Processing', files.length, 'images...');
    const fileArray = Array.from(files);

    const imagePreviews = fileArray.map(file => {
      const preview = URL.createObjectURL(file);
      console.log('🔗 Created preview URL:', preview);
    console.log('📁 File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
      
      const customizedImage = {
        file,
        preview,
        name: file.name,
        originalName: file.name,
        size: file.size,
        type: file.type,
        caption: `${file.name.split('.')[0]}`,
        altText: `User uploaded image: ${file.name}`,
        quality: 85,
        resize: {
          width: null,
          height: null,
          maintainAspectRatio: true
        },
        effects: {
          brightness: 100,
          contrast: 100,
          saturation: 100,
          blur: 0
        },
        timestamp: Date.now(),
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      if (file.size > 5 * 1024 * 1024) {
        customizedImage.suggested = {
          quality: 70,
          resize: { width: 1920, height: 1080, maintainAspectRatio: true },
          message: "Large file detected. Suggest reducing quality and size."
        };
      } else if (file.size > 2 * 1024 * 1024) {
        customizedImage.suggested = {
          quality: 80,
          message: "Medium file. Consider slight quality reduction."
        };
      }

      return customizedImage;
    });

    setFormData(prev => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...fileArray],
      images: [...prev.images, ...imagePreviews]
    }));
  };

  const handleAddImage = (imageData) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageData]
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => {
      const imageToRemove = prev.images[indexToRemove];
      if (imageToRemove && imageToRemove.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return {
        ...prev,
        images: prev.images.filter((_, index) => index !== indexToRemove),
        imageFiles: prev.imageFiles.filter((_, index) => index !== indexToRemove)
      };
    });
  };

  const handleEditImage = (index, updatedImageData) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, ...updatedImageData } : img
      )
    }));
  };

  //  Enhanced modal-aware image edit
  const handleEditImageSave = (index, updatedImageData) => {
    console.log('🎨 Editing image:', index, updatedImageData);
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, ...updatedImageData } : img
      )
    }));
    modalManager.handleBackToCreate();
  };

  const uploadImages = async () => {
    if (formData.imageFiles.length === 0) return [];

    try {
      setIsUploadingImages(true);
      console.log('📤 Uploading', formData.imageFiles.length, 'files to Cloudinary...');
      
      const uploadResult = await uploadPostImages(formData.imageFiles);
      console.log('✅ Cloudinary upload response:', uploadResult);
      
      const cloudinaryImages = uploadResult.images || uploadResult.data?.images || [];
      return cloudinaryImages;
    } catch (error) {
      console.error('❌ Error uploading to Cloudinary:', error);
      throw new Error('Failed to upload images: ' + error.message);
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleEditorImageUpload = async (file) => {
    try {
      console.log('📤 Uploading editor image...');
      const result = await uploadPostImageSingle(file);
      console.log('✅ Editor image uploaded:', result);
      return result.url;
    } catch (error) {
      console.error('❌ Error uploading editor image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      let uploadedImages = [];
      if (formData.imageFiles.length > 0) {
        console.log('📤 Starting Cloudinary upload...');
        uploadedImages = await uploadImages();
      }
      
      const submitData = {
        title: formData.title.trim(),
        content: formData.content,
        hashtags: formData.tags,
        images: uploadedImages
      };

      console.log('📝 Submitting:', submitData);
      const response = await createPost(submitData);
      console.log('✅ Post created:', response);
      
      handleCancel();
      
      if (onPostCreated) {
        onPostCreated(response.data || response);
      }
      
      alert('Bài viết đã được tạo thành công!');
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Cleanup preview URLs
    formData.images.forEach(image => {
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });

    setFormData({
      title: '',
      content: '',
      codeSnippet: '',
      tags: [],
      images: [],
      imageFiles: []
    });
    setShowCodeEditor(false);
    modalManager.closeModal();
  };

  const handleOpenModal = () => {
    modalManager.openModal('create');
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      formData.images.forEach(image => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, []);

  const canSubmit = formData.title.trim() && formData.content.trim() && !isSubmitting && !isUploadingImages;

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-center">
        <p className="text-gray-600 mb-4">Join our community to share your thoughts!</p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Trigger Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&size=48&background=2563eb&color=fff`}
              alt={user.userName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <button
              onClick={handleOpenModal}
              className="flex-1 text-left px-4 py-3 bg-gray-50 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Bạn có suy nghĩ gì, {user.fullName || user.userName}?
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Single Modal với dynamic content */}
      <Modal
        isOpen={modalManager.isModalOpen}
        onClose={modalManager.modalContent === 'create' ? handleCancel : modalManager.handleBackToCreate}
        {...modalManager.getModalProps()}
      >
        <ModalContentRenderer
          modalContent={modalManager.modalContent}
          activeImageIndex={modalManager.activeImageIndex}
          formData={formData}
          user={user}
          isSubmitting={isSubmitting}
          isUploadingImages={isUploadingImages}
          showCodeEditor={showCodeEditor}
          canSubmit={canSubmit}
          
          // Form handlers
          setFormData={setFormData}
          handleContentChange={handleContentChange}
          handleEditorImageUpload={handleEditorImageUpload}
          setShowCodeEditor={setShowCodeEditor}
          handleAddImage={handleAddImage}
          handleRemoveImage={handleRemoveImage}
          handleEditImage={handleEditImage}
          handleImageFilesChange={handleImageFilesChange}
          handleAddTag={handleAddTag}
          handleRemoveTag={handleRemoveTag}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          
          // Modal navigation
          showImagePreview={modalManager.showImagePreview}
          showImageCustomizer={modalManager.showImageCustomizer}
          handleBackToCreate={modalManager.handleBackToCreate}
          handleEditImageSave={handleEditImageSave}
        />
      </Modal>
    </>
  );
};

export default CreatePost;