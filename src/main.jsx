import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App.jsx'
import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 2. Tạo một instance của QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // (Tùy chọn) Cấu hình mặc định:
      // refetchOnWindowFocus: false, // Nếu bạn không muốn tự reload khi đổi tab
      retry: 1, // Số lần thử lại nếu API lỗi
    },
  },
})

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
      <App />
    <Toaster
      position="top-right"        
      richColors                  
      closeButton                 
      duration={3000}            
      expand={false}              
      visibleToasts={5}
      toastOptions={{
        className: 'my-toast',
        style: {
          background: 'white',
          color: '#333',
        },
      }}
    />
  </QueryClientProvider>
  
)
