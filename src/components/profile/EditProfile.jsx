import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Calendar, School, Loader2, Save, X, ArrowLeft, Search } from 'lucide-react';
import { toast } from 'sonner';
import AvatarUpload from './AvatarUpload';
import { userService } from '@/services/userService';

const EditProfile = ({ profileData, onCancel, onUpdateSuccess }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profileData.fullName || '',
    dob: profileData.dob || '',
    School: profileData.School || '',
    avatar: profileData.avatar || ''
  });

  // School autocomplete states
  const [schoolSearch, setSchoolSearch] = useState(profileData.School || '');
  const [schoolSuggestions, setSchoolSuggestions] = useState([]);
  const [isSearchingSchools, setIsSearchingSchools] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);
  const suggestionRef = useRef(null);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search schools from API
  const searchSchools = async (query) => {
    if (!query || query.length < 2) {
      setSchoolSuggestions([]);
      return;
    }

    setIsSearchingSchools(true);
    try {
      // Search for Vietnam universities
      const response = await fetch(
        `http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}&country=Vietnam`
      );
      const data = await response.json();
      
      // Limit to 10 suggestions
      setSchoolSuggestions(data.slice(0, 10));
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching schools:', error);
      setSchoolSuggestions([]);
    } finally {
      setIsSearchingSchools(false);
    }
  };

  // Handle school search input change
  const handleSchoolSearchChange = (e) => {
    const value = e.target.value;
    setSchoolSearch(value);
    setFormData(prev => ({
      ...prev,
      School: value
    }));

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchSchools(value);
    }, 300);
  };

  // Handle school selection from suggestions
  const handleSchoolSelect = (schoolName) => {
    setSchoolSearch(schoolName);
    setFormData(prev => ({
      ...prev,
      School: schoolName
    }));
    setShowSuggestions(false);
    setSchoolSuggestions([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (avatarUrl) => {
    setFormData(prev => ({
      ...prev,
      avatar: avatarUrl
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error('Vui lòng nhập họ tên');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await userService.updateProfile({
        fullName: formData.fullName.trim(),
        dob: formData.dob,
        School: formData.School.trim(),
        avatar: formData.avatar
      });

      toast.success('Cập nhật thông tin thành công!');
      
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Không thể cập nhật thông tin');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onCancel}
              disabled={isUpdating}
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa thông tin</h3>
              <p className="text-sm text-gray-500">Cập nhật thông tin cá nhân của bạn</p>
            </div>
          </div>
        </div>

        {/* Avatar Upload */}
        <div className="bg-gray-50 rounded-lg p-6">
          <Label className="text-base font-semibold mb-4 block text-gray-900">Ảnh đại diện</Label>
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={formData.avatar || profileData.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-md"
              />
            </div>
            <AvatarUpload
              currentAvatar={formData.avatar}
              onAvatarChange={handleAvatarChange}
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Username - Read Only */}
          <div>
            <Label htmlFor="userName" className="flex items-center gap-2 mb-2 text-gray-700">
              <User size={18} className="text-blue-600" />
              Tên đăng nhập
            </Label>
            <Input
              id="userName"
              value={profileData.userName}
              disabled
              className="bg-gray-100 cursor-not-allowed border-gray-200"
            />
            <p className="text-xs text-gray-500 mt-1.5">Không thể thay đổi tên đăng nhập</p>
          </div>

          {/* Email - Read Only */}
          <div>
            <Label htmlFor="email" className="flex items-center gap-2 mb-2 text-gray-700">
              <Mail size={18} className="text-blue-600" />
              Email
            </Label>
            <Input
              id="email"
              value={profileData.email}
              disabled
              className="bg-gray-100 cursor-not-allowed border-gray-200"
            />
            <p className="text-xs text-gray-500 mt-1.5">Không thể thay đổi email</p>
          </div>

          {/* Full Name */}
          <div>
            <Label htmlFor="fullName" className="flex items-center gap-2 mb-2 text-gray-700">
              <User size={18} className="text-blue-600" />
              Họ và tên <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên đầy đủ"
              disabled={isUpdating}
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <Label htmlFor="dob" className="flex items-center gap-2 mb-2 text-gray-700">
              <Calendar size={18} className="text-blue-600" />
              Ngày sinh
            </Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              disabled={isUpdating}
              max={new Date().toISOString().split('T')[0]}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* School with Autocomplete */}
          <div className="relative" ref={suggestionRef}>
            <Label htmlFor="School" className="flex items-center gap-2 mb-2 text-gray-700">
              <School size={18} className="text-blue-600" />
              Trường học
            </Label>
            <div className="relative">
              <Input
                id="School"
                name="School"
                value={schoolSearch}
                onChange={handleSchoolSearchChange}
                onFocus={() => {
                  if (schoolSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder="Tìm kiếm tên trường học..."
                disabled={isUpdating}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isSearchingSchools ? (
                  <Loader2 size={18} className="animate-spin text-gray-400" />
                ) : (
                  <Search size={18} className="text-gray-400" />
                )}
              </div>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && schoolSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {schoolSuggestions.map((school, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSchoolSelect(school.name)}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{school.name}</div>
                    {school.domains && school.domains[0] && (
                      <div className="text-xs text-gray-500 mt-1">
                        🌐 {school.domains[0]}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-1.5">
              Nhập tối thiểu 2 ký tự để tìm kiếm trường học tại Việt Nam
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isUpdating}
            className="flex-1 border-gray-300 hover:bg-gray-50"
          >
            <X size={18} className="mr-2" />
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isUpdating}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          >
            {isUpdating ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EditProfile;