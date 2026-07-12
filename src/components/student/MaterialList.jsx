import React, { useState, useEffect } from 'react';
import {
  Download, Edit, Trash2, Search, Eye, File, Image,
  Video, FileText, Folder, BarChart3, X, SortAsc,
  User, Calendar, Database, BookMarked,
} from 'lucide-react';
import TablePagination from '@/components/common/TablePagination';

// Helpers
const EXT_COLORS = {
  PDF: 'bg-red-50    text-red-600    border-red-100',
  DOC: 'bg-blue-50   text-blue-600   border-blue-100',
  DOCX: 'bg-blue-50   text-blue-600   border-blue-100',
  XLS: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  XLSX: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  PPT: 'bg-orange-50  text-orange-600  border-orange-100',
  PPTX: 'bg-orange-50  text-orange-600  border-orange-100',
  PNG: 'bg-purple-50  text-purple-600  border-purple-100',
  JPG: 'bg-purple-50  text-purple-600  border-purple-100',
  JPEG: 'bg-purple-50  text-purple-600  border-purple-100',
  ZIP: 'bg-amber-50   text-amber-600   border-amber-100',
  RAR: 'bg-amber-50   text-amber-600   border-amber-100',
};

const getExtCls = (ext) => EXT_COLORS[ext] || 'bg-slate-50 text-slate-600 border-slate-100';

const getFileExt = (fileName, fileType) => {
  if (fileType === 'application/pdf') return 'PDF';
  if (fileName) {
    const parts = fileName.split('.');
    if (parts.length > 1) {
      const ext = parts[parts.length - 1].toUpperCase();
      if (ext.length <= 4) return ext;
    }
  }
  return 'FILE';
};

const getCatLabel = (cat, categories) => categories.find(c => c.value === cat)?.label || 'Khác';

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const formatDate = (d) => {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Skeleton Component
const MaterialCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden animate-pulse">
    <div className="p-5">
      <div className="flex justify-between mb-4">
        <div className="h-5 w-20 bg-blue-100 rounded-full" />
        <div className="h-5 w-12 bg-slate-200 rounded" />
      </div>
      <div className="h-6 w-full bg-slate-200 rounded mb-2" />
      <div className="h-5 w-2/3 bg-slate-200 rounded mb-4" />
      <div className="border-t border-slate-100 pt-3 space-y-2">
        <div className="h-4 w-40 bg-slate-200 rounded" />
        <div className="h-4 w-32 bg-slate-200 rounded" />
      </div>
    </div>
    <div className="bg-blue-50/50 border-t border-blue-100 px-5 py-3 flex justify-between">
      <div className="h-4 w-28 bg-slate-200 rounded" />
      <div className="h-8 w-24 bg-blue-100 rounded-xl" />
    </div>
  </div>
);

const MaterialList = ({ classCode, materials = [], loading = false }) => {
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);

  const safeMaterials = Array.isArray(materials) ? materials : [];

  const categories = [
    { value: 'all', label: 'Tất cả', icon: <Folder className="w-3.5 h-3.5" /> },
    { value: 'lecture', label: 'Bài giảng', icon: <FileText className="w-3.5 h-3.5" /> },
    { value: 'assignment', label: 'Bài tập', icon: <Edit className="w-3.5 h-3.5" /> },
    { value: 'reference', label: 'Tham khảo', icon: <File className="w-3.5 h-3.5" /> },
    { value: 'exam', label: 'Đề thi', icon: <FileText className="w-3.5 h-3.5" /> },
    { value: 'other', label: 'Khác', icon: <File className="w-3.5 h-3.5" /> },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'popular', label: 'Phổ biến' },
    { value: 'views', label: 'Lượt xem' },
    { value: 'name', label: 'Tên A-Z' },
  ];

  const handleDownload = async (material) => {
    try {
      if (material.fileUrl) {
        window.open(material.fileUrl, '_blank');
      }
    } catch (error) {
      console.error('❌ Error downloading material:', error);
    }
  };

  const filteredMaterials = safeMaterials.filter(material => {
    const matchesSearch =
      material.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || material.category === category;
    return matchesSearch && matchesCategory;
  });

  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt || b.uploadedAt || 0) - new Date(a.createdAt || a.uploadedAt || 0);
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt || a.uploadedAt || 0) - new Date(b.createdAt || b.uploadedAt || 0);
    }
    if (sortBy === 'popular' || sortBy === 'views') {
      return (b.downloads || 0) - (a.downloads || 0);
    }
    if (sortBy === 'name') {
      return a.title?.localeCompare(b.title);
    }
    return 0;
  });

  const itemsPerPage = 9;
  const totalPages = Math.ceil(sortedMaterials.length / itemsPerPage);
  const paginatedMaterials = sortedMaterials.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, searchTerm, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookMarked size={28} className="text-blue-600" />
            Tài liệu
          </h2>
          {loading ? (
            <div className="h-4 w-40 mt-1 bg-slate-100 rounded animate-pulse" />
          ) : (
            <p className="text-gray-600 mt-1">
              {safeMaterials.length > 0 ? (
                <span>Tổng {safeMaterials.length} tài liệu{searchTerm && <span className="ml-2 text-gray-500">(Tìm thấy: {filteredMaterials.length})</span>}</span>
              ) : (
                'Tài liệu học tập của lớp'
              )}
            </p>
          )}
        </div>
      </div>

      {/* ── Filters Card ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Sort */}
          <div className="relative">
            <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-sm outline-none cursor-pointer"
            >
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl whitespace-nowrap text-sm font-medium transition-all cursor-pointer flex-shrink-0 ${category === cat.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-blue-100 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                }`}
            >
              {cat.icon}{cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <MaterialCardSkeleton key={i} />)}
        </div>
      ) : paginatedMaterials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-14 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Folder className="w-9 h-9 text-blue-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-1">
            {searchTerm ? 'Không tìm thấy tài liệu phù hợp' : 'Chưa có tài liệu nào'}
          </h3>
          {searchTerm && (
            <p className="text-sm text-slate-400">
              Không tìm thấy kết quả cho "<span className="font-semibold text-slate-600">{searchTerm}</span>"
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedMaterials.map((material) => {
              const fileExt = getFileExt(material.fileName, material.fileType);
              const badgeText = (material.tags && material.tags[0]) || getCatLabel(material.category, categories);

              return (
                <div key={material._id} className="group bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col overflow-hidden">
                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Top row: category + ext */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
                        {badgeText}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getExtCls(fileExt)}`}>
                        {fileExt}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-slate-800 text-base leading-snug mb-3 line-clamp-2" title={material.title}>
                      {material.title}
                    </h3>

                    {material.description && (
                      <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                        {material.description}
                      </p>
                    )}

                    <div className="border-t border-blue-50 my-3" />

                    {/* Meta */}
                    <div className="space-y-2 flex-1 flex flex-col justify-end">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <User className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span className="truncate">
                          Người đăng: <span className="font-semibold text-slate-700">{material.uploadedBy?.fullName || material.uploader?.fullName || 'Giảng viên'}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span>
                          Ngày đăng: <span className="text-slate-600">{formatDate(material.uploadedAt || material.createdAt)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="bg-blue-50/50 border-t border-blue-100 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Database className="w-3.5 h-3.5 text-blue-400" />
                        {formatFileSize(material.fileSize)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        {material.downloads || 0} lượt tải
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(material)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-400 text-blue-700 text-xs font-semibold shadow-sm transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Tải xuống
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              showFirstLast
              maxVisiblePages={5}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MaterialList;