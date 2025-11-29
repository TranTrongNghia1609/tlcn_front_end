import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mail, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import classroomService from "@/services/classroomService";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/context/AuthModalContext";

const JoinClassroomPage = () => {
  const params = useParams();
  const { classCode, token } = params;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openModal } = useAuthModal();

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [inviteData, setInviteData] = useState(null);
  const [error, setError] = useState(null);
  const [emailRegistered, setEmailRegistered] = useState(null);


  // Verify token khi vào trang
  useEffect(() => {
    if (!classCode || classCode === 'undefined') {
      console.error('❌ classCode is invalid:', classCode);
      setError('URL không hợp lệ. Thiếu mã lớp học.');
      setLoading(false);
      return;
    }

    if (!token || token === 'undefined') {
      console.error('❌ token is invalid:', token);
      setError('URL không hợp lệ. Thiếu token xác thực.');
      setLoading(false);
      return;
    }

    verifyToken();
  }, [classCode, token]);

  // Check email registered sau khi verify token
  useEffect(() => {
    if (inviteData?.email) {
      checkEmail();
    }
  }, [inviteData]);

  // Auto join nếu đã login
  useEffect(() => {
    if (user && inviteData && emailRegistered !== null) {
      handleAutoJoin();
    }
  }, [user, inviteData, emailRegistered]);

  const verifyToken = async () => {
    try {
      const response = await classroomService.verifyInviteToken(classCode, token);
            
      setInviteData(response.data);
      setError(null);
    } catch (error) {
      console.error(" Error verifying token:", error);
      setError(error.response?.data?.message || error.message || "Link mời không hợp lệ hoặc đã hết hạn");
    } finally {
      setLoading(false);
    }
  };

  const checkEmail = async () => {
    try {      
      const response = await classroomService.checkEmailRegistered(inviteData.email);
            
      setEmailRegistered(response.data.registered);
    } catch (error) {
      console.error(" Error checking email:", error);
    }
  };

  const handleAutoJoin = async () => {
    if (user.email.toLowerCase() !== inviteData.email.toLowerCase()) {
      toast.error("Email của bạn không khớp với lời mời. Vui lòng đăng nhập bằng email đúng.");
      return;
    }

    setVerifying(true);
    try {

      await classroomService.joinClassroomByToken(classCode, token);
      
      toast.success("Tham gia lớp học thành công!");
      
      setTimeout(() => {
        navigate(`/classrooms/${inviteData.classCode}`);
      }, 1000);
    } catch (error) {
      console.error(" Error joining classroom:", error);
      toast.error(error.response?.data?.message || "Lỗi khi tham gia lớp học");
      setVerifying(false);
    }
  };

  const handleLogin = () => {

    openModal("login", {
      prefillEmail: inviteData.email,
      pendingAction: {
        type: 'joinClassroom',
        data: { classCode, token }
      }
    });
  };

  const handleRegister = () => {
    openModal("register", {
      prefillEmail: inviteData.email,
      pendingAction: {
        type: 'joinClassroom',
        data: { classCode, token }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang xác thực lời mời...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Link không hợp lệ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 animate-pulse" />
          </div>
          <p className="text-xl font-semibold text-gray-900 mb-2">Đang tham gia lớp học...</p>
          <p className="text-gray-600">Vui lòng chờ một chút</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Lời mời tham gia lớp học</h1>
          <p className="text-blue-100">Bạn được mời tham gia:</p>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">
                {inviteData?.classroomName}
              </h2>
              <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {inviteData?.classCode}
              </span>
            </div>
            {inviteData?.classroomDescription && (
              <p className="text-gray-600 text-sm">{inviteData.classroomDescription}</p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <Mail className="w-4 h-4 mr-2" />
              Email: <span className="font-medium ml-1">{inviteData?.email}</span>
            </div>

            {user ? (
              // Đã login
              user.email.toLowerCase() === inviteData?.email.toLowerCase() ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600 inline mr-2" />
                  <span className="text-green-800 font-medium">
                    Bạn đã đăng nhập đúng tài khoản
                  </span>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <AlertCircle className="w-5 h-5 text-yellow-600 inline mr-2" />
                  <span className="text-yellow-800 text-sm">
                    Email không khớp. Vui lòng đăng xuất và đăng nhập lại bằng email{" "}
                    <strong>{inviteData?.email}</strong>
                  </span>
                </div>
              )
            ) : (
              // Chưa login
              <div className="space-y-3">
                {emailRegistered === null ? (
                  <div className="text-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                  </div>
                ) : emailRegistered ? (
                  // Email đã đăng ký -> Show login
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-blue-800 text-sm">
                        Email này đã có tài khoản. Vui lòng đăng nhập để tham gia lớp học.
                      </p>
                    </div>
                    <button
                      onClick={handleLogin}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium"
                    >
                      Đăng nhập
                    </button>
                  </>
                ) : (
                  // Email chưa đăng ký -> Show register
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-green-800 text-sm">
                        Bạn chưa có tài khoản. Đăng ký ngay để tham gia lớp học.
                      </p>
                    </div>
                    <button
                      onClick={handleRegister}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium"
                    >
                      Đăng ký ngay
                    </button>
                    <button
                      onClick={handleLogin}
                      className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
                    >
                      Đã có tài khoản? Đăng nhập
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinClassroomPage;