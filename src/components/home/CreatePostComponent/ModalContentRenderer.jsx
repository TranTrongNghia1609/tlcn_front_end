import React from 'react';
import PostEditor from './PostEditor';
import CodeEditor from './CodeEditor';
import ImageUpload from './ImageUpload';
import TagsInput from './TagsInput';
import PostActions from './PostActions';
import ImagePreview from './ImageComponent/ImagePreview';
import ImageCustomizer from './ImageComponent/ImageCustomizer';

const ModalContentRenderer = ({
  modalContent,
  activeImageIndex,
  formData,
  user,
  isSubmitting,
  isUploadingImages,
  showCodeEditor,
  canSubmit,
  isEditMode = false, // ✅ Add this prop
  
  setFormData,
  handleContentChange,
  handleEditorImageUpload,
  setShowCodeEditor,
  handleAddImage,
  handleRemoveImage,
  handleEditImage,
  handleImageFilesChange,
  handleAddTag,
  handleRemoveTag,
  handleSubmit,
  handleCancel,
  
  showImagePreview,
  showImageCustomizer,
  handleBackToCreate,
  handleEditImageSave
}) => {

  
  const renderCreatePostContent = () => (
    <div className="max-h-[calc(95vh-80px)] overflow-y-auto">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Header Section với Avatar và Title */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&size=48&background=2563eb&color=fff`}
              alt={user.userName}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tiêu đề..."
              value={formData.title} // ✅ This should show existing title
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full text-xl font-semibold border-none outline-none placeholder-gray-400 focus:ring-0"
              maxLength={200}
              disabled={isSubmitting || isUploadingImages}
            />
          </div>
        </div>

        {/* Content Editor Section */}
        <div className="w-full">
          <PostEditor
            value={formData.content} // ✅ FIX: Truyền content vào, không để empty
            onChange={handleContentChange}
            onImageUpload={handleEditorImageUpload}
            placeholder={isEditMode ? "Chỉnh sửa nội dung..." : "Chia sẻ suy nghĩ của bạn..."}
          />

          <div className="flex justify-between items-center text-sm text-gray-500 mt-3 px-2">
            <span>Characters: {formData.content?.length || 0}</span>
            <span>Words: {formData.content ? formData.content.split(/\s+/).filter(word => word.length > 0).length : 0}</span>
          </div>
        </div>

        {/* Code Editor Section */}
        {showCodeEditor && (
          <div className="w-full">
            <CodeEditor
              value={formData.codeSnippet}
              onChange={(value) => setFormData(prev => ({ ...prev, codeSnippet: value }))}
              onClose={() => setShowCodeEditor(false)}
              isVisible={showCodeEditor}
            />
          </div>
        )}

        {/* Image Upload */}
        <div className="w-full">
          <ImageUpload
            images={formData.images}
            onUpload={handleAddImage}
            onRemove={handleRemoveImage}
            onEdit={handleEditImage}
            onPreview={showImagePreview}
            onCustomize={showImageCustomizer}
            onFilesChange={handleImageFilesChange}
            maxImages={4}
            disabled={isSubmitting}
            isUploading={isUploadingImages}
          />
        </div>

        {/* Tags Section */}
        <div className="w-full">
          <TagsInput
            tags={formData.tags}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            maxTags={5}
          />
        </div>

        {/* Actions Section */}
        <div className="w-full border-t border-gray-200 pt-4">
          <div className="w-full border-t border-gray-200 pt-4">
          <PostActions
            showCodeEditor={showCodeEditor}
            onToggleCodeEditor={() => setShowCodeEditor(!showCodeEditor)}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting || isUploadingImages}
            canSubmit={canSubmit}
            isEditMode={isEditMode} 
            submitText={
              isUploadingImages ? (isEditMode ? 'Đang tải ảnh...' : 'Uploading images...') : 
              isSubmitting ? (isEditMode ? 'Đang cập nhật...' : 'Publishing...') : 
              (isEditMode ? 'Cập nhật' : 'Đăng bài')
            }
          />
        </div>
        </div>
      </form>
    </div>
  );

  const renderImagePreview = () => (
    <ImagePreview
      image={formData.images[activeImageIndex]}
      onClose={handleBackToCreate}
      onEdit={() => showImageCustomizer(activeImageIndex)}
    />
  );

  const renderImageCustomizer = () => (
    <ImageCustomizer
      image={formData.images[activeImageIndex]}
      index={activeImageIndex}
      onSave={handleEditImageSave}
      onClose={handleBackToCreate}
      onPreview={() => showImagePreview(activeImageIndex)}
    />
  );

  switch (modalContent) {
    case 'preview':
      return renderImagePreview();
    case 'customize':
      return renderImageCustomizer();
    default:
      return renderCreatePostContent();
  }
};

export default ModalContentRenderer;