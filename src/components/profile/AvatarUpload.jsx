import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const AvatarUpload = ({ currentAvatar, onAvatarChange }) => {
  const { uploading, updateAvatar } = useUser();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 2MB');
      return;
    }

    try {
      const result = await updateAvatar(file);
      if (result?.avatar && onAvatarChange) {
        onAvatarChange(result.avatar);
      }
      toast.success('Cập nhật ảnh đại diện thành công!');
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      toast.error('Không thể cập nhật ảnh đại diện');
    }
  };

  return (
    <div className="flex-1">
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Tải ảnh đại diện mới. Kích thước khuyến nghị: 200x200px
        </p>
        <p className="text-xs text-gray-500">
          Định dạng: JPG, PNG. Tối đa 2MB
        </p>
        
        <div className="pt-2">
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <label htmlFor="avatar-upload">
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              asChild
            >
              <span className="cursor-pointer">
                {uploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Chọn ảnh
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;