import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Modal from '../common/Modal';
import { useAuthModal } from '../../context/AuthModalContext';
import { userService } from '../../services/userService';
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

const OnboardingModal = ({open, onClose}) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingCheckUsername, setLoadingCheckUsername] = useState(false);
    const [userName, setUserName] = useState('');
    const { closeModals } = useAuthModal();
    const { onBoarding } = useAuth();
    const checkUserName = userService.checkUserName;
    const navigate = useNavigate()

    const handleUsernameChange =  useMemo(
        () =>
            debounce(async (q) => {
                try{
                    if (q != "")
                        await checkUserName(q);
                    setLoadingCheckUsername(false)
                    setError('')
                }
                catch (error){
                    setError('Username này đã tồn tại')
                }
            }, 1000),
            []
    )
    useEffect(() => {
        return () => handleUsernameChange.cancel();
    }, [handleUsernameChange]);

    const hanldeSumbit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try{
            console.log('Go to');
            await onBoarding(userName)
            setLoading(false)
            navigate('/profile')
        }
        catch (e){
            setLoading(false)
            console.error('❌ Lỗi trong khi đăng ký', error);
            setError('❌ Lỗi trong khi đăng ký')
            throw error.response?.data || { message: 'Failed to check' };
        }
    }
    
    return (
        <>
        <Modal isOpen={open} onClose={onClose}>
            <div className="relative bg-white/80 backdrop-blur-md border border-white/30 shadow-xl rounded-xl sm:rounded-2xl w-full px-4 py-6 sm:px-6 md:px-8 sm:py-8 md:py-10 max-h-[90vh] overflow-y-auto">
                <div className="absolute inset-0 pointer-events-none z-0">
                <div className="flare-bg w-full h-full" />
                </div>

                <div className="relative z-10">
                <div className="flex flex-col items-center space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold gradient-text-dark text-center">
                    Chào mừng đã đến với BNOJ
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 text-center px-2">
                    Hãy nhập username để hoàn thành quá trình đăng ký
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <p className="text-red-600 text-xs sm:text-sm mb-3 sm:mb-4 text-center px-2">
                    {error}
                    </p>
                )}

                {/* Form - responsive spacing */}
                <form onSubmit={hanldeSumbit} className="space-y-2 sm:space-y-3">
                    {/* Name field */}
                    <div>
                    <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 text-left mb-1 sm:mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => {
                            if (e.target.value != "")
                                setLoadingCheckUsername(true)
                            setUserName(e.target.value); 
                            handleUsernameChange(e.target.value)
                        }}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="user1"
                    />
                    </div>

                    {/* Submit button */}
                    <button
                    type="submit"
                    disabled={loading || loadingCheckUsername}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 sm:py-2.5 rounded-md font-semibold text-white hover:shadow-lg hover:scale-[1.02] transition text-sm sm:text-base"
                    >
                    {loading || loadingCheckUsername ? (
                        <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        </div>
                    ) : (
                        'Sign Up'
                    )}
                    </button>
                </form>
                </div>

                <style>
                {`
                    .gradient-text-dark {
                    background: linear-gradient(90deg, #7286ff, #fe7587);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    }
                    .flare-bg {
                    background: radial-gradient(40% 40% at 50% 50%, rgba(210,32,255,0.4) 0%, rgba(210,32,255,0.1) 40%, transparent 80%);
                    filter: blur(100px);
                    }
                `}
                </style>
            </div>
        </Modal>
        </>
    )
}

export default OnboardingModal