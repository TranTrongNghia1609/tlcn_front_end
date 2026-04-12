import apiClient from '../utils/api';
import { MATERIAL_ENDPOINTS } from '../config/endpoints';

const materialService = {
  // Get all materials
  getMaterials: async (classCode, params = {}) => {
    try {
      const response = await apiClient.get(
        MATERIAL_ENDPOINTS.GET_MATERIALS(classCode),
        { params }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error getting materials:', error);
      throw error;
    }
  },

  // Get single material
  getMaterial: async (classCode, materialId) => {
    try {
      const response = await apiClient.get(
        MATERIAL_ENDPOINTS.GET_MATERIAL(classCode, materialId)
      );
      return response.data.data.material;
    } catch (error) {
      console.error('Error getting material:', error);
      throw error;
    }
  },

  // Upload material
  uploadMaterial: async (classCode, formData, onUploadProgress) => {
    try {
      const response = await apiClient.post(
        MATERIAL_ENDPOINTS.UPLOAD_MATERIAL(classCode),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress
        }
      );
      return response.data.data.material;
    } catch (error) {
      console.error('Error uploading material:', error);
      throw error;
    }
  },

  // Update material
  updateMaterial: async (classCode, materialId, data) => {
    try {
      const response = await apiClient.put(
        MATERIAL_ENDPOINTS.UPDATE_MATERIAL(classCode, materialId),
        data
      );
      return response.data.data.material;
    } catch (error) {
      console.error('Error updating material:', error);
      throw error;
    }
  },

  // Delete material
  deleteMaterial: async (classCode, materialId) => {
    try {
      const response = await apiClient.delete(
        MATERIAL_ENDPOINTS.DELETE_MATERIAL(classCode, materialId)
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting material:', error);
      throw error;
    }
  },

  // Download material
  downloadMaterial: async (classCode, materialId) => {
    try {
      const response = await apiClient.post(
        MATERIAL_ENDPOINTS.DOWNLOAD_MATERIAL(classCode, materialId),
        {}
      );
      return response.data.data;
    } catch (error) {
      console.error('Error downloading material:', error);
      throw error;
    }
  },

  // Get stats
  getStats: async (classCode) => {
    try {
      const response = await apiClient.get(
        MATERIAL_ENDPOINTS.GET_STATS(classCode)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  },

  // Get recent materials
  getRecent: async (classCode, limit = 5) => {
    try {
      const response = await apiClient.get(
        MATERIAL_ENDPOINTS.GET_RECENT(classCode),
        { params: { limit } }
      );
      return response.data.data.materials;
    } catch (error) {
      console.error('Error getting recent materials:', error);
      throw error;
    }
  },

  // Get popular materials
  getPopular: async (classCode, limit = 5) => {
    try {
      const response = await apiClient.get(
        MATERIAL_ENDPOINTS.GET_POPULAR(classCode),
        { params: { limit } }
      );
      return response.data.data.materials;
    } catch (error) {
      console.error('Error getting popular materials:', error);
      throw error;
    }
  }
};

export default materialService;