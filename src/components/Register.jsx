import { useState } from "react";


export default function Register(){

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);


  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return(
    <div>
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="flare-bg w-full h-full" />
      </div>

      <div className="relative z-10 bg-white/80 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl w-full max-w-md px-8 py-10">
        <div className="flex flex-col items-center space-y-2 mb-6">
          {/* <img src="/assets/kickdsa.png" alt="KickDSA Logo" className="h-6 scale-500 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]" /> */}
          <h2 className="text-3xl font-extrabold gradient-text-dark">Chào mừng đã dến với BNOJ</h2>
          <p className="text-sm text-gray-600 text-center">Hãy tạo tài khoản của bạn</p>
        </div>

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">Họ và Tên</label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nguyen Van A"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">Email</label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="nguyenvana@gmail.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">Nhập mật khẩu</label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nhập mật khẩu"
            />
            {form.password && (
              <div className="w-full mt-2 h-2 rounded bg-gray-200 overflow-hidden transition-opacity duration-300">
                <div
                  className={`h-full transition-all duration-500 ${
                    passwordStrength <= 2 ? 'bg-red-500 w-1/4' :
                    passwordStrength === 3 ? 'bg-yellow-400 w-2/4' :
                    passwordStrength === 4 ? 'bg-yellow-500 w-3/4' :
                    'bg-green-500 w-full'}`}
                />
              </div>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-left">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nhập mật khẩu"
            />
            {form.confirmPassword && (
              <div className="w-full mt-2 h-2 rounded bg-gray-200 overflow-hidden transition-opacity duration-300">
                <div
                  className={`h-full transition-all duration-500 ${
                    passwordStrength <= 2 ? 'bg-red-500 w-1/4' :
                    passwordStrength === 3 ? 'bg-yellow-400 w-2/4' :
                    passwordStrength === 4 ? 'bg-yellow-500 w-3/4' :
                    'bg-green-500 w-full'}`}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-md font-semibold text-white hover:shadow-lg hover:scale-[1.02] transition"
          >
            Sign Up
          </button>

          <p className="text-xs text-gray-500 flex items-center justify-center">— or sign up with —</p>

          <div className="flex flex-col gap-3 mt-4">
            <a
              href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
              className="flex items-center justify-center bg-white border border-gray-300 rounded-md py-2 text-gray-700 hover:bg-gray-100 transition"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
              Sign up with Google
            </a>

            <a
              href={`${import.meta.env.VITE_API_BASE_URL}/auth/github`}
              className="flex items-center justify-center bg-white-900 border border-gray-300 rounded-md py-2 text-white hover:bg-gray transition"
            >
              <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-5 h-5 mr-2" />
              Sign up with GitHub
            </a>
          </div>

          <p className="text-sm text-center text-gray-700 mt-4">
            Already have an account?{' '}
            <a href="/login" className="underline text-purple-500 hover:text-pink-500 transition">Login</a>
          </p>
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
  );
}