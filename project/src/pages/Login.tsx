import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react'

function Login({ onAuth }: { onAuth: (user: any, token: string) => void }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const loginHandler = async (e: React.FormEvent) => {
       e.preventDefault();
       // Perform login logic here
       const userData = {
         mobile,
         password,
     };
     try {
       const response = await fetch('http://localhost:8001/api/users/login', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify(userData),
       });
  
          const ans = await response.json();
          if (!response.ok) {
              throw new Error(ans.error || 'Login failed');
          }

          onAuth(ans.user, ans.token);
          alert('User logged in successfully');
          setMobile('');
          setPassword('');
          navigate('/profile');
  
      }
      catch (error) {
        console.error('Error:', error);
        alert(error instanceof Error ? error.message : 'Login failed. Please try again.');
      }
  }
  return (
    <div>
  <div className="flex items-center justify-center h-screen">
   
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    onSubmit={loginHandler}>
     
     <label className="block text-gray-700 text-sm font-bold mb-2">
      Mobile Number
     </label>

     <input
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
      type="text"
      placeholder="Enter your mobile number"
      value={mobile}
      onChange={(e) => setMobile(e.target.value)}
     />

     <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
      Password
     </label>
     <input
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
      type="password"
      placeholder="Enter your password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
     />

      <button type='submit'
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
      >
        Login
      </button>

      <p className="mt-4 text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="text-black hover:text-blue-700 cursor-pointer">
          Sign up
        </Link>
      </p>
    </form>

    
    
  </div>

    

    </div>
  )
}

export default Login
