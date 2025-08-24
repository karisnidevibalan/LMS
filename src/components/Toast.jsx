import { Toaster } from 'react-hot-toast';

const Toast = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      style: {
        background: '#333',
        color: '#fff',
        fontWeight: '500'
      },
    }}
  />
);

export default Toast;