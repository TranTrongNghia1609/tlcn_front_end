import { createContext, useContext, useState, useCallback } from 'react';
import materialService from '../services/materialService';
import { toast } from 'sonner';

const MaterialContext = createContext();

export const useMaterial = () => {
  const context = useContext(MaterialContext);
  if (!context) {
    throw new Error('useMaterial must be used within MaterialProvider');
  }
  return context;
};

export const MaterialProvider = ({ children }) => {
  const [materials, setMaterials] = useState([]);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  
  // Add pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch materials with filters and pagination
  const fetchMaterials = useCallback(async (classCode, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await materialService.getMaterials(classCode, params);
      
      // Update materials and pagination
      setMaterials(response.materials || []);
      
      if (response.pagination) {
        setPagination(response.pagination);
      }
      
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Không thể tải danh sách tài liệu';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single material
  const fetchMaterial = useCallback(async (classCode, materialId) => {
    setLoading(true);
    setError(null);
    try {
      const material = await materialService.getMaterial(classCode, materialId);
      setCurrentMaterial(material);
      return material;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Không thể tải tài liệu';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload material
  const uploadMaterial = useCallback(async (classCode, formData) => {
    setUploading(true);
    setUploadProgress(0);
    setError(null);
    try {
      const material = await materialService.uploadMaterial(
        classCode,
        formData,
        (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      );
      
      toast.success('Tải tài liệu lên thành công!');
      
      // Add to materials list (at beginning)
      setMaterials(prev => [material, ...prev]);
      
      // Update pagination total
      setPagination(prev => ({
        ...prev,
        total: prev.total + 1,
        totalPages: Math.ceil((prev.total + 1) / prev.limit)
      }));
      
      return material;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Không thể tải tài liệu lên';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, []);

  // Update material
  const updateMaterial = useCallback(async (classCode, materialId, data) => {
    setLoading(true);
    setError(null);
    try {
      const updatedMaterial = await materialService.updateMaterial(classCode, materialId, data);
      
      toast.success('Cập nhật tài liệu thành công!');
      
      // Update in materials list
      setMaterials(prev =>
        prev.map(m => (m._id === materialId ? updatedMaterial : m))
      );
      
      // Update current material if it's the one being edited
      if (currentMaterial?._id === materialId) {
        setCurrentMaterial(updatedMaterial);
      }
      
      return updatedMaterial;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Không thể cập nhật tài liệu';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentMaterial]);

  // Delete material
  const deleteMaterial = useCallback(async (classCode, materialId) => {
    setLoading(true);
    setError(null);
    try {
      await materialService.deleteMaterial(classCode, materialId);
      
      toast.success('Xóa tài liệu thành công!');
      
      // Remove from materials list
      setMaterials(prev => prev.filter(m => m._id !== materialId));
      
      // Update pagination total
      setPagination(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        totalPages: Math.ceil(Math.max(0, prev.total - 1) / prev.limit)
      }));
      
      // Clear current material if it's the one being deleted
      if (currentMaterial?._id === materialId) {
        setCurrentMaterial(null);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Không thể xóa tài liệu';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentMaterial]);

  // Download material
  const downloadMaterial = useCallback(async (classCode, materialId) => {
    try {
      const data = await materialService.downloadMaterial(classCode, materialId);
      
      // Open download URL in new tab
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
        toast.success('Đang tải xuống...');
        
        // Update download count in local state
        setMaterials(prev =>
          prev.map(m =>
            m._id === materialId
              ? { ...m, downloads: (m.downloads || 0) + 1 }
              : m
          )
        );
      }
      
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Không thể tải xuống tài liệu';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    }
  }, []);

  // Fetch material stats
  const fetchStats = useCallback(async (classCode) => {
    setLoading(true);
    setError(null);
    try {
      const statsData = await materialService.getStats(classCode);
      setStats(statsData);
      return statsData;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Không thể tải thống kê';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch recent materials
  const fetchRecentMaterials = useCallback(async (classCode, limit = 5) => {
    try {
      const recentMaterials = await materialService.getRecent(classCode, limit);
      return recentMaterials;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Không thể tải tài liệu gần đây';
      toast.error(errorMsg);
      throw err;
    }
  }, []);

  // Fetch popular materials
  const fetchPopularMaterials = useCallback(async (classCode, limit = 5) => {
    try {
      const popularMaterials = await materialService.getPopular(classCode, limit);
      return popularMaterials;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Không thể tải tài liệu phổ biến';
      toast.error(errorMsg);
      throw err;
    }
  }, []);

  // Change page
  const changePage = useCallback((page) => {
    setPagination(prev => ({
      ...prev,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < prev.totalPages
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear current material
  const clearCurrentMaterial = useCallback(() => {
    setCurrentMaterial(null);
  }, []);

  // Reset all state
  const resetMaterialState = useCallback(() => {
    setMaterials([]);
    setCurrentMaterial(null);
    setStats(null);
    setError(null);
    setUploadProgress(0);
    setPagination({
      page: 1,
      limit: 9,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false
    });
  }, []);

  const value = {
    // State
    materials,
    currentMaterial,
    stats,
    loading,
    uploading,
    uploadProgress,
    error,
    pagination, 

    // Actions
    fetchMaterials,
    fetchMaterial,
    uploadMaterial,
    updateMaterial,
    deleteMaterial,
    downloadMaterial,
    fetchStats,
    fetchRecentMaterials,
    fetchPopularMaterials,
    changePage, 

    // Utilities
    clearError,
    clearCurrentMaterial,
    resetMaterialState,
    setCurrentMaterial,
  };

  return (
    <MaterialContext.Provider value={value}>
      {children}
    </MaterialContext.Provider>
  );
};