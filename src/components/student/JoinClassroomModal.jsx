import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Key, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import classroomService from '@/services/classroomService';

const JoinClassroomModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Enter code, 2: Success
  const [loading, setLoading] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [joinedClassroom, setJoinedClassroom] = useState(null);

  const handleJoin = async (e) => {
    e.preventDefault();

    const code = classCode.trim() || inviteCode.trim();

    if (!code) {
      toast.error('Vui lòng nhập mã lớp học hoặc mã mời');
      return;
    }

    setLoading(true);

    try {
      const response = await classroomService.joinClassroom({
        classCode: classCode.trim() || undefined,
        inviteCode: inviteCode.trim() || undefined
      });

      setJoinedClassroom(response.data.classroom);
      setStep(2);
      toast.success('Tham gia lớp học thành công!');
    } catch (error) {
      console.error('Error joining classroom:', error);
      const errorMessage = error.response?.data?.message || 'Không thể tham gia lớp học';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setClassCode('');
    setInviteCode('');
    setJoinedClassroom(null);
    onClose();
  };

  const handleContinue = () => {
    if (onSuccess) {
      onSuccess();
    }
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          {step === 1 ? (
            <>
              {/* Step 1: Enter Code */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="text-white" size={28} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Tham gia lớp học</h2>
                <p className="text-gray-600">
                  Nhập mã lớp học hoặc mã mời để tham gia
                </p>
              </div>

              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <Label>Mã lớp học (Class Code)</Label>
                  <Input
                    placeholder="VD: CS101-2024"
                    value={classCode}
                    onChange={(e) => {
                      setClassCode(e.target.value.toUpperCase());
                      setInviteCode(''); // Clear invite code
                    }}
                    className="font-mono"
                    disabled={loading || !!inviteCode}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mã lớp học công khai được giảng viên cung cấp
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">HOẶC</span>
                  </div>
                </div>

                <div>
                  <Label>Mã mời (Invite Code)</Label>
                  <Input
                    placeholder="VD: ABC123XYZ"
                    value={inviteCode}
                    onChange={(e) => {
                      setInviteCode(e.target.value.toUpperCase());
                      setClassCode(''); // Clear class code
                    }}
                    className="font-mono"
                    disabled={loading || !!classCode}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mã mời riêng được gửi qua email
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Gợi ý:</strong> Bạn có thể tìm mã lớp học trong email mời hoặc 
                    yêu cầu giảng viên cung cấp.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                    disabled={loading}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || (!classCode && !inviteCode)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Đang tham gia...
                      </>
                    ) : (
                      <>
                        Tham gia
                        <ArrowRight size={16} className="ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Step 2: Success */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-600" size={32} />
                </div>
                
                <h2 className="text-2xl font-bold mb-2">
                  Tham gia thành công!
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Bạn đã tham gia lớp học
                </p>

                {joinedClassroom && (
                  <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 p-6 mb-6">
                    <h3 className="font-bold text-lg mb-2">
                      {joinedClassroom.className}
                    </h3>
                    {joinedClassroom.description && (
                      <p className="text-gray-600 text-sm mb-3">
                        {joinedClassroom.description}
                      </p>
                    )}
                    <div className="flex items-center justify-center gap-2 text-sm text-purple-600">
                      <Key size={14} />
                      <span className="font-mono font-semibold">
                        {joinedClassroom.classCode}
                      </span>
                    </div>
                  </Card>
                )}

                <Button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  Tiếp tục
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </Dialog>
  );
};

export default JoinClassroomModal;