import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, LogOut } from 'lucide-react';

const LeaveClassroomModal = ({ isOpen, onClose, onConfirm, classroomName, loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card className="relative z-10 w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          {/* Warning Icon */}
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Xác nhận rời lớp học
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-2">
            Bạn có chắc chắn muốn rời khỏi lớp học
          </p>
          <p className="font-semibold text-gray-900 mb-4">
            "{classroomName}"?
          </p>

          {/* Warning Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 w-full">
            <p className="text-sm text-amber-800">
              ⚠️ Bạn sẽ mất quyền truy cập vào tất cả bài tập, tài liệu và lịch sử nộp bài của lớp học này.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <LogOut size={16} className="mr-2" />
                  Rời lớp
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LeaveClassroomModal;