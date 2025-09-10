import React, { useState } from 'react';
import TurndownService from 'turndown';
import { useUser } from '../../context/UserContext';
import { createPost } from '../../services/postService';
import PostEditor from './CreatePostComponent/PostEditor';
import CodeEditor from './CreatePostComponent/CodeEditor';
import ImageUpload from './CreatePostComponent/ImageUpload';
//import PostMedia from './CreatePostComponent/PostMedia';
import TagsInput from './CreatePostComponent/TagsInput';
import PostActions from './CreatePostComponent/PostActions';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    htmlContent: '',
    codeSnippet: '',
    tags: [],
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);

  // Initialize TurndownService
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

  const handleContentChange = (htmlContent) => {
    const markdownContent = turndownService.turndown(htmlContent);
    setFormData(prev => ({
      ...prev,
      htmlContent,
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

  const handleAddImage = (imageData) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageData]
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleEditImage = (index, updatedImageData) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? updatedImageData : img)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      const submitData = {
        title: formData.title.trim(),
        content: formData.content,
        htmlContent: formData.htmlContent,
        codeSnippet: formData.codeSnippet,
        hashtags: formData.tags.join(','),
        images: formData.images
      };

      const response = await createPost(submitData);
      onPostCreated(response.data.post);
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        htmlContent: '',
        codeSnippet: '',
        tags: [],
        images: []
      });
      setIsExpanded(false);
      setShowCodeEditor(false);
      
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleCancel = () => {
    setFormData({
      title: '',
      content: '',
      htmlContent: '',
      codeSnippet: '',
      tags: [],
      images: []
    });
    setIsExpanded(false);
    setShowCodeEditor(false);
  };

  const canSubmit = formData.title.trim() && formData.content.trim();

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {!isExpanded ? (
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&size=48&background=2563eb&color=fff`}
              alt={user.userName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <button
              onClick={() => setIsExpanded(true)}
              className="flex-1 text-left px-4 py-3 bg-gray-50 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Bạn có suy nghĩ gì, {user.fullName || user.userName}?
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-start space-x-4 mb-4">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&size=48&background=2563eb&color=fff`}
              alt={user.userName}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Tiêu đề..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full text-xl font-semibold border-none outline-none placeholder-gray-400 mb-4"
                maxLength={200}
              />
              
              <PostEditor
                value={formData.htmlContent}
                onChange={handleContentChange}
                placeholder="Chia sẻ suy nghĩ của bạn..."
              />

              {/* Character/Word Count */}
              <div className="flex justify-between text-sm text-gray-500 mt-2 mb-4">
                <span>
                  Characters: {formData.content.length}
                </span>
                <span>
                  Words: {formData.content.split(/\s+/).filter(word => word.length > 0).length}
                </span>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <CodeEditor
            value={formData.codeSnippet}
            onChange={(value) => setFormData(prev => ({ ...prev, codeSnippet: value }))}
            onClose={() => setShowCodeEditor(false)}
            isVisible={showCodeEditor}
          />

          {/* Image Upload */}
          <ImageUpload
            images={formData.images}
            onUpload={handleAddImage}
            onRemove={handleRemoveImage}
            maxImages={4}
          />

          {/* Media Preview */}
          {/* <PostMedia
            images={formData.images}
            onRemoveImage={handleRemoveImage}
            onEditImage={handleEditImage}
            maxImages={4}
          /> */}

          {/* Tags Input */}
          <TagsInput
            tags={formData.tags}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            maxTags={5}
          />

          {/* Actions */}
          <PostActions
            showCodeEditor={showCodeEditor}
            onToggleCodeEditor={() => setShowCodeEditor(!showCodeEditor)}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            canSubmit={canSubmit}
          />
        </form>
      )}
    </div>
  );
};

export default CreatePost;