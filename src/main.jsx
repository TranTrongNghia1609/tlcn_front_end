import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App.jsx'
import { Toaster } from 'sonner'
createRoot(document.getElementById('root')).render(
  <>
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
  </>
  
)
