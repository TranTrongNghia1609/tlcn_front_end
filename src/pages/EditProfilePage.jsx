import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditProfile from '@/components/profile/EditProfile';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { profileData } = location.state || {};

  if (!profileData) {
    navigate(-1);
    return null;
  }

  const handleCancel = () => {
    navigate(`/profile/${profileData.userName}`);
  };

  const handleUpdateSuccess = () => {
    // Navigate về profile, Profile component sẽ tự fetch lại data mới
    navigate(`/profile/${profileData.userName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa thông tin</h1>
              <p className="text-sm text-gray-500">Cập nhật thông tin cá nhân của bạn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EditProfile
          profileData={profileData}
          onCancel={handleCancel}
          onUpdateSuccess={handleUpdateSuccess}
        />
      </div>
    </div>
  );
};

export default EditProfilePage;