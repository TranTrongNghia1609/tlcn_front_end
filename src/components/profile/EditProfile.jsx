import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Mail, Calendar, School, Loader2, Save, X, ArrowLeft, Search, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import AvatarUpload from './AvatarUpload';
import { userService } from '@/services/userService';

// Danh sách các trường đại học Việt Nam - Fallback khi API fail
const VIETNAM_UNIVERSITIES = [
  'Đại học Bách Khoa Hà Nội',
  'Đại học Quốc gia Hà Nội',
  'Đại học Quốc gia TP.HCM',
  'Đại học Bách Khoa TP.HCM',
  'Đại học Kinh tế Quốc dân',
  'Đại học Ngoại thương',
  'Đại học Sư phạm Hà Nội',
  'Đại học Sư phạm TP.HCM',
  'Đại học Y Hà Nội',
  'Đại học Công nghệ - ĐHQGHN',
  'Đại học Khoa học Tự nhiên - ĐHQGHN',
  'Đại học Kinh tế - ĐHQGHN',
  'Đại học Xã hội và Nhân văn - ĐHQGHN',
  'Đại học Nông nghiệp Hà Nội',
  'Đại học Xây dựng Hà Nội',
  'Đại học Giao thông Vận tải',
  'Đại học Thương mại',
  'Đại học Luật Hà Nội',
  'Đại học Mỏ - Địa chất',
  'Đại học Dược Hà Nội',
  'Đại học Điện lực',
  'Học viện Công nghệ Bưu chính Viễn thông',
  'Học viện Ngân hàng',
  'Học viện Tài chính',
  'Học viện Kỹ thuật Mật mã',
  'Đại học Công nghiệp Hà Nội',
  'Đại học Văn hóa Hà Nội',
  'Đại học Thủy lợi',
  'Đại học Hàng hải Việt Nam',
  'Đại học FPT',
  'Đại học Tôn Đức Thắng',
  'Đại học Hoa Sen',
  'Đại học Văn Lang',
  'Đại học Công nghệ Thông tin - ĐHQG-HCM',
  'Đại học Khoa học Tự nhiên - ĐHQG-HCM',
  'Đại học Kinh tế - Luật - ĐHQG-HCM',
  'Đại học Huế',
  'Đại học Đà Nẵng',
  'Đại học Cần Thơ',
  'Đại học Vinh',
  'Đại học Thái Nguyên',
  'Trường Đại học Sư phạm Kỹ thuật TP.HCM',
  'Trường Đại học Công nghệ Sài Gòn',
  'Trường Đại học Sài Gòn',
  'Trường Đại học Kinh tế TP.HCM',
  'Trường Đại học Mở TP.HCM',
  'Trường Đại học Ngân hàng TP.HCM',
  'Trường Đại học Tài chính - Marketing',
  'Trường Đại học Công Nghiệp TP.HCM',
  'Trường Đại học Nông Lâm TP.HCM',
  'Trường Đại học Y Dược TP.HCM',
  'Trường Đại học Khoa học Xã hội và Nhân văn TP.HCM',
  'Trường Đại học Công nghệ TP.HCM',
  'Trường Đại học Quốc tế - ĐHQG-HCM',
  'Học viện Hàng không Việt Nam',
  'Đại học Duy Tân',
  'Đại học Phenikaa',
  'Đại học VinUni',
  'Đại học RMIT Việt Nam',
  'Đại học Fulbright Việt Nam',
];

const EditProfile = ({ profileData, onCancel, onUpdateSuccess }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profileData.fullName || '',
    dob: profileData.dob || '',
    School: profileData.School || '',
    avatar: profileData.avatar || '',
    aiHintEnabled: profileData.aiHintEnabled !== false,
  });

  // School autocomplete states
  const [schoolSearch, setSchoolSearch] = useState(profileData.School || '');
  const [schoolSuggestions, setSchoolSuggestions] = useState([]);
  const [isSearchingSchools, setIsSearchingSchools] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const searchTimeoutRef = useRef(null);
  const suggestionRef = useRef(null);

  // Validation state
  const [nameError, setNameError] = useState('');

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

  // Normalize Vietnamese text for better search
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  // Local search fallback
  const searchLocalSchools = (query) => {
    const normalizedQuery = normalizeText(query);

    const filtered = VIETNAM_UNIVERSITIES.filter(school => {
      const normalizedSchool = normalizeText(school);
      return normalizedSchool.includes(normalizedQuery);
    });

    return filtered.slice(0, 10).map(name => ({ 
      name,
      source: 'local'
    }));
  };

  // Search schools with API first, fallback to local
  const searchSchools = async (query) => {
    if (!query || query.length < 2) {
      setSchoolSuggestions([]);
      setShowSuggestions(false);
      setUsingFallback(false);
      return;
    }

    setIsSearchingSchools(true);
    setUsingFallback(false);

    try {
      // Try API first with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

      const response = await fetch(
        `http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}&country=Vietnam`,
        { 
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      // Filter valid results
      const filtered = data
        .filter(school => school.name && school.name.trim() !== '')
        .map(school => ({
          name: school.name,
          domain: school.domains?.[0] || null,
          web_pages: school.web_pages?.[0] || null,
          source: 'api'
        }))
        .slice(0, 10);

      if (filtered.length > 0) {
        console.log('✅ Using API data');
        setSchoolSuggestions(filtered);
        setShowSuggestions(true);
        setUsingFallback(false);
        setIsSearchingSchools(false);
        return;
      }

      // If API returns empty, use local fallback
      throw new Error('No results from API');

    } catch (error) {
      // Fallback to local search
      console.log('⚠️ API failed, using local fallback:', error.message);
      
      const localResults = searchLocalSchools(query);
      
      if (localResults.length > 0) {
        setSchoolSuggestions(localResults);
        setShowSuggestions(true);
        setUsingFallback(true);
      } else {
        setSchoolSuggestions([]);
        setShowSuggestions(false);
        setUsingFallback(false);
      }
    } finally {
      setIsSearchingSchools(false);
    }
  };

  // Handle school search input change with debounce
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
    setUsingFallback(false);
  };

  const validateFullName = (value) => {
    if (!value.trim()) {
      setNameError('Full name cannot be empty');
      return false;
    }
    
    if (value.length > 100) {
      setNameError('Full name cannot exceed 100 characters');
      return false;
    }

    setNameError('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'fullName') {
      if (value.length > 100) {
        return;
      }
      validateFullName(value);
    }

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

    if (!validateFullName(formData.fullName)) {
      toast.error(nameError || 'Please check your full name');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await userService.updateProfile({
        fullName: formData.fullName.trim(),
        dob: formData.dob,
        School: String(formData.School || '').trim(),
        avatar: formData.avatar,
        aiHintEnabled: formData.aiHintEnabled,
      });

      toast.success('Profile updated successfully!');
      
      if (onUpdateSuccess) {
        onUpdateSuccess(response?.data);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
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
              <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
              <p className="text-sm text-gray-500">Update your personal profile information</p>
            </div>
          </div>
        </div>

        {/* Avatar Upload */}
        <div className="bg-gray-50 rounded-lg p-6">
          <Label className="text-base font-semibold mb-4 block text-gray-900">Profile Picture</Label>
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
              Username
            </Label>
            <Input
              id="userName"
              value={profileData.userName}
              disabled
              className="bg-gray-100 cursor-not-allowed border-gray-200"
            />
            <p className="text-xs text-gray-500 mt-1.5">Username cannot be changed</p>
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
            <p className="text-xs text-gray-500 mt-1.5">Email cannot be changed</p>
          </div>

          {/* Full Name */}
          <div>
            <Label htmlFor="fullName" className="flex items-center gap-2 mb-2 text-gray-700">
              <User size={18} className="text-blue-600" />
              Full Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={isUpdating}
                required
                maxLength={100}
                className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                  nameError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {formData.fullName.length}/100
              </div>
            </div>
            {nameError ? (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <span>⚠️</span>
                {nameError}
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1.5">
                Maximum 100 characters
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <Label htmlFor="dob" className="flex items-center gap-2 mb-2 text-gray-700">
              <Calendar size={18} className="text-blue-600" />
              Date of Birth
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

          {/* School with Hybrid Autocomplete */}
          <div className="relative" ref={suggestionRef}>
            <Label htmlFor="School" className="flex items-center gap-2 mb-2 text-gray-700">
              <School size={18} className="text-blue-600" />
              School
            </Label>
            <div className="relative">
              <Input
                id="School"
                name="School"
                value={schoolSearch}
                onChange={handleSchoolSearchChange}
                onFocus={() => {
                  if (schoolSearch && schoolSearch.length >= 2) {
                    searchSchools(schoolSearch);
                  }
                }}
                placeholder="Search for your school..."
                disabled={isUpdating}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isSearchingSchools ? (
                  <Loader2 size={18} className="animate-spin text-blue-600" />
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
                    <div className="flex items-start gap-2">
                      <School size={16} className="text-blue-600 shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">{school.name}</div>
                        {school.domain && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <span>{school.domain}</span>
                          </div>
                        )}
                        
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

         
          </div>

          {/* Privacy: AI Hint */}
          <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-4" id="ai-hint-privacy">
            <div className="flex items-start gap-3">
              <Checkbox
                id="aiHintEnabled"
                checked={formData.aiHintEnabled}
                onCheckedChange={(checked) => {
                  setFormData((prev) => ({
                    ...prev,
                    aiHintEnabled: checked === true,
                  }));
                }}
                disabled={isUpdating}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="aiHintEnabled" className="flex cursor-pointer items-center gap-2 text-gray-800">
                  <Sparkles size={16} className="text-amber-600" />
                  Enable AI Hint
                </Label>
                <p className="mt-1 text-xs text-gray-600">
                  When disabled, the AI Hint feature will be completely blocked for your account.
                </p>
              </div>
            </div>
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
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUpdating || !!nameError}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EditProfile;