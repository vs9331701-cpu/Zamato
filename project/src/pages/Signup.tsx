import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
interface SignupProps {
  onAuth: (user: any, token: string) => void;
}
function Signup({ onAuth }: SignupProps) {
  const [mobile, setMobile] = useState('');
   const [password, setPassword] = useState('');
   const [selectedImage, setSelectedImage] = useState<File | null>(null);

   const navigate = useNavigate();

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
     setSelectedImage(file);
   };

   const loginHandler = async (e: React.FormEvent) => {
     e.preventDefault();

     const formData = new FormData();
     formData.append('mobile', mobile);
     formData.append('password', password);
     if (selectedImage) {
       formData.append('image', selectedImage);
     }

   try {
     const response = await fetch('http://localhost:8001/api/users/signup', {
         method: 'POST',
         body: formData,
     });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const ans = await response.json();
        if (!response.ok) {
            throw new Error(ans.error || 'Signup failed');
        }

        alert('User signed up successfully');

        onAuth(ans.user, ans.token);
        setMobile('');
        setPassword('');
        setSelectedImage(null);
        navigate('/profile');

    }
    catch (error) {
      console.error('Error:', error);
      alert('Signup failed. Please try again.');
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

      <input 
       type='file'
       accept='image/*'
       className="mt-4"
       onChange={handleImageChange}
      />
 
       <button type='submit'
       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
       >
        signup
       </button>

           <p className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-black hover:text-blue-700 cursor-pointer">
         Login
        </Link>
      </p>
     </form>
   </div>
 
     
 
     </div>
  )
}

export default Signup
