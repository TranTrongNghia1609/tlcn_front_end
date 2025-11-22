import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Search, 
  Download,
  ExternalLink,
  File,
  FileImage,
  FileVideo,
  FileArchive,
  FileType,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';
import { formatDate } from '@/utils/dateHelpers';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useStudentClassroom } from '@/context/StudentClassroomContext';

const MaterialList = ({ classCode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { materials, loading, fetchMaterials } = useStudentClassroom();

  // ✅ Fetch materials when component mounts
  useEffect(() => {
    console.log('📄 MaterialList: Fetching materials for', classCode);
    if (classCode) {
      fetchMaterials(classCode);
    }
  }, [classCode, fetchMaterials]);

  // ✅ Debug log
  useEffect(() => {
    console.log('📄 Materials state updated:', materials);
  }, [materials]);

  const safeMaterials = Array.isArray(materials) ? materials : [];
  console.log('📄 Safe materials:', safeMaterials);

  const filteredMaterials = safeMaterials.filter(material =>
    material.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('📄 Filtered materials:', filteredMaterials);

  // ✅ Enhanced file icon detection
  const getFileIcon = (fileType, fileName) => {
    const type = fileType?.toLowerCase() || '';
    const ext = fileName?.split('.').pop()?.toLowerCase() || '';
    
    // Images
    if (type.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
      return FileImage;
    }
    
    // Videos
    if (type.includes('video') || ['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(ext)) {
      return FileVideo;
    }
    
    // Archives
    if (type.includes('zip') || type.includes('rar') || ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return FileArchive;
    }
    
    // PDF
    if (type.includes('pdf') || ext === 'pdf') {
      return FileType;
    }
    
    // Spreadsheets
    if (type.includes('sheet') || ['xls', 'xlsx', 'csv'].includes(ext)) {
      return FileSpreadsheet;
    }
    
    // Code files
    if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css'].includes(ext)) {
      return FileCode;
    }
    
    return File;
  };

  const handleDownload = async (material) => {
    try {
      if (material.fileUrl) {
        window.open(material.fileUrl, '_blank');
      }
    } catch (error) {
      console.error('Error downloading material:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText size={28} className="text-blue-600" />
            Tài liệu
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredMaterials.length} tài liệu trong lớp học
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Tìm kiếm tài liệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Material List */}
      {filteredMaterials.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm ? 'Không tìm thấy tài liệu' : 'Chưa có tài liệu nào'}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? 'Thử tìm kiếm với từ khóa khác'
              : 'Giảng viên chưa tải lên tài liệu nào'
            }
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMaterials.map((material) => {
            const FileIcon = getFileIcon(material.fileType, material.fileName || material.title);
            
            return (
              <Card key={material._id} className="p-5 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  {/* File Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileIcon size={24} className="text-blue-600" />
                    </div>
                  </div>

                  {/* Material Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {material.title}
                    </h3>
                    
                    {material.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {material.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        📅 {formatDate(material.uploadedAt || material.createdAt)}
                      </span>
                      
                      {material.fileSize && (
                        <span>
                          💾 {(material.fileSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                      )}
                      
                      {material.fileType && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {material.fileType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(material)}
                      className="hover:bg-blue-50"
                    >
                      <Download size={16} className="mr-2" />
                      Tải xuống
                    </Button>
                    
                    {material.fileUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(material.fileUrl, '_blank')}
                        className="hover:bg-gray-100"
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Mở
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 p-4 rounded-lg text-xs font-mono">
          <div>Loading: {loading ? 'true' : 'false'}</div>
          <div>Materials count: {safeMaterials.length}</div>
          <div>Filtered count: {filteredMaterials.length}</div>
          <pre className="mt-2 overflow-auto max-h-40">
            {JSON.stringify(safeMaterials[0] || {}, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default MaterialList;