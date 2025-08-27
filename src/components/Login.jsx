import { useState } from "react";
export default function Login(){
  const [email, setEmail] = useState("");      // Khai báo state email
  const [password, setPassword] = useState(""); // Khai báo state password
  const [error, setError] = useState("");      
  const [showPassword, setShowPassword] = useState(false); 

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kiểm tra dữ liệu nhập vào
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
    } else {
      setError(""); // Xóa lỗi nếu nhập đủ
      // Xử lý đăng nhập ở đây...
    }
  };
  return(
    <div
      
     
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="flare-bg w-full h-full" />
      </div>

      <div className="relative z-10 bg-white/80 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl w-full max-w-md px-8 py-10">
        <div className="flex flex-col items-center space-y-2 mb-6">
          {/* <img src="/assets/kickdsa.png" alt="KickDSA Logo" className="h-6 scale-500 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]" /> */}
          <h2 className="text-3xl font-extrabold gradient-text-dark">Welcome</h2>
          <p className="text-sm text-gray-600 text-center">
            Your account is protected with secure authentication.
          </p>
        </div>

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
            />
          </div>

          <div className="relative">
            
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">Password</label>
            <input
              type={showPassword ? "text" : "password"} 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="●●●●●"
            />
            <div
            className="absolute top-9 right-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={0}
            aria-label="Hiện/Ẩn mật khẩu"
          >
            {showPassword ? (
              // Icon con mắt mở
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-4.03 9-9 9S3 17 3 12 7.03 3 12 3s9 4.03 9 9z" />
              </svg>
            ) : (
              // Icon con mắt đóng
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.97 0-9-4.03-9-9a8.96 8.96 0 012.125-5.825M6.6 6.6l10.8 10.8M9.88 9.88a3 3 0 004.24 4.24" />
              </svg>
            )}
          </div>

          </div>
          

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-md font-semibold text-white hover:shadow-lg hover:scale-[1.02] transition"
          >
            Login
          </button>
          <div className="flex justify-between mt-2 text-sm">
            <a href="/forgot-password" className="text-purple-600 hover:underline">Forgot Password?</a>
            <a href="/signup" className="text-pink-600 hover:underline">Sign Up</a>
          </div>
        </form>

        {/* Social Sign-In */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-xs text-gray-500">— or sign in with —</p>

          {/* Google */}
          <a
            href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
            className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 rounded-md font-medium border border-gray-200 shadow-sm hover:scale-[1.02] transition"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
            Sign in with Google
          </a>

          {/* GitHub */}
          <button
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-gray-900 py-2 rounded-md font-medium border border-gray-700 shadow-sm hover:scale-[1.02] transition "
            onClick={() => alert("GitHub Sign-In not implemented")}
          >
            <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="h-5 w-5" />
            Sign in with GitHub
          </button>
        </div>
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
  );
}

