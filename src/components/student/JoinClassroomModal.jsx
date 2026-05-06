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
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={20} />
          </button>

          {step === 1 ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="text-white" size={28} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Join ClassRoom</h2>
                <p className="text-gray-600">
                  Enter the invite code to join
                </p>
              </div>

              <form onSubmit={handleJoin} className="space-y-4">



                <div>
                  <Label>Invite Code</Label>
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
                    Private invite code sent via email
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> You can find the classroom code in the invitation email or
                    ask the teacher for it.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 cursor-pointer hover:bg-gray-100"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || (!classCode && !inviteCode)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Joining...
                      </>
                    ) : (
                      <>
                        Join ClassRoom
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
                  You have successfully joined the classroom!
                </h2>

                <p className="text-gray-600 mb-6">
                  You have successfully joined the classroom
                </p>

                {joinedClassroom && (
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-6 mb-6">
                    <h3 className="font-bold text-lg mb-2">
                      {joinedClassroom.className}
                    </h3>
                    {joinedClassroom.description && (
                      <p className="text-gray-600 text-sm mb-3">
                        {joinedClassroom.description}
                      </p>
                    )}
                    <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                      <Key size={14} />
                      <span className="font-mono font-semibold">
                        {joinedClassroom.classCode}
                      </span>
                    </div>
                  </Card>
                )}

                <Button
                  onClick={handleContinue}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Continue
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