import React, { useState, useRef } from 'react';
import TurndownService from 'turndown';
import { marked } from 'marked';
import { useUser } from '../../../context/UserContext';
import { uploadPostImages, uploadPostImageSingle } from '../../../services/postService';
import Modal from '../../common/Modal';
import { useModalManager } from '../../../hooks/useModalManager';
import ModalContentRenderer from '../CreatePostComponent/ModalContentRenderer';

const PostEdit = ({ post, onSave, onCancel, isUpdating }) => {
  const { user } = useUser();
  const modalManager = useModalManager();
  
  // ✅ Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: false,
    mangle: false
  });
  
  // Process existing images
  const processExistingImages = () => {
    if (!post.images || post.images.length === 0) return [];
    
    
    return post.images.map((imgData, index) => {
      const imgUrl = typeof imgData === 'string' ? imgData : imgData.url;
      
      return {
        url: imgUrl,
        preview: imgUrl,
        id: `existing_${index}`,
        name: `Image ${index + 1}`,
        originalName: imgData.originalName || `Image ${index + 1}`,
        caption: '',
        altText: '',
        quality: 85,
        isExisting: true,
        size: imgData.size || 0,
        type: imgData.type || 'image/jpeg'
      };
    });
  };
  
  const originalContentRef = useRef(post.content);
  
  const [formData, setFormData] = useState({
    title: post.title || '',
    content: post.content || '',
    codeSnippet: post.codeSnippet || '',
    tags: post.hashtags || [],
    images: processExistingImages(),
    imageFiles: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(!!post.codeSnippet);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

 

  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    fence: '```',
    emDelimiter: '_',
    strongDelimiter: '**',
    linkStyle: 'inlined',
    bulletListMarker: '-'
  });

  turndownService.addRule('strikethrough', {
    filter: ['del', 's', 'strike'],
    replacement: (content) => '~~' + content + '~~'
  });

  turndownService.addRule('underline', {
    filter: 'u',
    replacement: (content) => '<u>' + content + '</u>'
  });

  const handleContentChange = (htmlContent) => {
   
    const markdownContent = turndownService.turndown(htmlContent);
    
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
    const fileArray = Array.from(files);

    const imagePreviews = fileArray.map(file => {
      const preview = URL.createObjectURL(file);
      
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
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        isExisting: false
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
      
      if (imageToRemove && imageToRemove.preview && !imageToRemove.isExisting) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      const newImageFiles = imageToRemove.isExisting 
        ? prev.imageFiles 
        : prev.imageFiles.filter((_, idx) => {
            const newImageIndex = prev.images.slice(0, indexToRemove).filter(img => !img.isExisting).length;
            return idx !== newImageIndex;
          });

      return {
        ...prev,
        images: prev.images.filter((_, index) => index !== indexToRemove),
        imageFiles: newImageFiles
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

  const handleEditImageSave = (index, updatedImageData) => {
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
      
      const uploadResult = await uploadPostImages(formData.imageFiles);
      
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
      const result = await uploadPostImageSingle(file);
      return result.url;
    } catch (error) {
      console.error('Error uploading editor image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || isSubmitting || isUpdating) {
    
      return;
    }

    try {
      setIsSubmitting(true);
      
      let newUploadedImages = [];
      if (formData.imageFiles.length > 0) {
        newUploadedImages = await uploadImages();
      }
      
      const existingImages = formData.images
        .filter(img => img.isExisting)
        .map(img => img.url);
      
      const allImages = [...existingImages, ...newUploadedImages];
      
      const updateData = {
        title: formData.title.trim(),
        content: formData.content,
        hashtags: formData.tags,
        images: allImages,
        codeSnippet: formData.codeSnippet || ''
      };

      
      onSave(updateData);
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    formData.images.forEach(image => {
      if (image.preview && !image.isExisting) {
        URL.revokeObjectURL(image.preview);
      }
    });
    
    onCancel();
    modalManager.closeModal();
  };

  React.useEffect(() => {
    modalManager.openModal('create');
    
    return () => {
      formData.images.forEach(image => {
        if (image.preview && !image.isExisting) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, []);

  const canSubmit = formData.title.trim() && formData.content.trim() && !isSubmitting && !isUploadingImages && !isUpdating;

  const displayContent = marked.parse(formData.content || '');
  

  return (
  <Modal
    isOpen={modalManager.isModalOpen}
    onClose={modalManager.modalContent === 'create' ? handleCancelEdit : modalManager.handleBackToCreate}
    {...modalManager.getModalProps()}
    title="Chỉnh sửa bài viết" // ✅ Add custom title
  >
    <ModalContentRenderer
      modalContent={modalManager.modalContent}
      activeImageIndex={modalManager.activeImageIndex}
      formData={{
        ...formData,
        content: displayContent
      }}
      user={user}
      isSubmitting={isSubmitting || isUpdating}
      isUploadingImages={isUploadingImages}
      showCodeEditor={showCodeEditor}
      canSubmit={canSubmit}
      isEditMode={true}
      
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
      handleCancel={handleCancelEdit}
      
      showImagePreview={modalManager.showImagePreview}
      showImageCustomizer={modalManager.showImageCustomizer}
      handleBackToCreate={modalManager.handleBackToCreate}
      handleEditImageSave={handleEditImageSave}
    />
  </Modal>
);
};

export default PostEdit;