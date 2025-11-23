import { createContext, useContext, useState } from 'react';
import classroomService from '../services/classroomService';
import { toast } from 'sonner';

const ClassroomContext = createContext();

export const useClassroom = () => {
  const context = useContext(ClassroomContext);
  if (!context) {
    throw new Error('useClassroom must be used within ClassroomProvider');
  }
  return context;
};

export const ClassroomProvider = ({ children }) => {
  const [classrooms, setClassrooms] = useState([]);
  const [currentClassroom, setCurrentClassroom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all classrooms
  const fetchClassrooms = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await classroomService.getClassrooms(params);
      setClassrooms(response.data.classrooms || []);
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Không thể tải danh sách lớp học');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch classroom detail
  const fetchClassroomDetail = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await classroomService.getClassroomById(id);
      setCurrentClassroom(response.data.classroom);
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Không thể tải chi tiết lớp học');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create classroom
  const createClassroom = async (data) => {
    setLoading(true);
    try {
      const response = await classroomService.createClassroom(data);
      toast.success('Tạo lớp học thành công');
      await fetchClassrooms();
      return response.data;
    } catch (err) {
      toast.error('Không thể tạo lớp học');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update classroom
  const updateClassroom = async (id, data) => {
    setLoading(true);
    try {
      const response = await classroomService.updateClassroom(id, data);
      toast.success('Cập nhật lớp học thành công');
      if (currentClassroom?._id === id) {
        setCurrentClassroom(response.data.classroom);
      }
      return response.data;
    } catch (err) {
      toast.error('Không thể cập nhật lớp học');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete classroom
  const deleteClassroom = async (id) => {
    setLoading(true);
    try {
      await classroomService.deleteClassroom(id);
      toast.success('Xóa lớp học thành công');
      setClassrooms(prev => prev.filter(c => c._id !== id));
      if (currentClassroom?._id === id) {
        setCurrentClassroom(null);
      }
    } catch (err) {
      toast.error('Không thể xóa lớp học');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    classrooms,
    currentClassroom,
    loading,
    error,
    fetchClassrooms,
    fetchClassroomDetail,
    createClassroom,
    updateClassroom,
    deleteClassroom,
    setCurrentClassroom,
  };

  return (
    <ClassroomContext.Provider value={value}>
      {children}
    </ClassroomContext.Provider>
  );
};