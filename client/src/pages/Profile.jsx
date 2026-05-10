import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [imageFile, setImageFile] = useState(null);
  const [formState, setFormState] = useState({});
  const [successMsg, setSuccessMsg] = useState(false);
  const [listings, setListings] = useState([]);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (imageFile) {
      const handleUpload = async () => {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        uploadData.append('upload_preset', 'images_preset');

        try {
          const res = await fetch('https://api.cloudinary.com/v1_1/dne8fofeo/image/upload', {
            method: 'POST',
            body: uploadData,
          });
          const data = await res.json();
          setFormState((prev) => ({ ...prev, avatar: data.url }));
        } catch (err) {
          console.error('Image upload failed:', err);
        }
      };
      handleUpload();
    }
  }, [imageFile]);

  const handleInputChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setSuccessMsg(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const deleteAccount = async () => {
    dispatch(deleteUserStart());
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const logOutUser = async () => {
    dispatch(signOutUserStart());
    try {
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (err) {
      dispatch(signOutUserFailure(err.message));
    }
  };

  const fetchUserListings = async () => {
    setFetchError(false);
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setFetchError(true);
        return;
      }
      setListings(data);
    } catch (err) {
      setFetchError(true);
    }
  };

  const deleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success === false) return;
      setListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (err) {
      console.error('Failed to delete listing:', err);
    }
  };

  return (
    <div className='p-4 max-w-lg mx-auto'>
      <h2 className='text-3xl text-center font-bold mb-6'>Your Profile</h2>
      <form onSubmit={updateUserDetails} className='flex flex-col gap-4'>
        <input
          type='file'
          hidden
          accept='image/*'
          ref={fileInputRef}
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <img
          src={formState.avatar || currentUser.avatar}
          alt='Profile'
          className='h-24 w-24 rounded-full object-cover cursor-pointer mx-auto'
          onClick={() => fileInputRef.current.click()}
        />
        <input
          type='text'
          id='username'
          placeholder='Username'
          defaultValue={currentUser.username}
          className='border p-3 rounded-lg'
          onChange={handleInputChange}
        />
        <input
          type='email'
          id='email'
          placeholder='Email'
          defaultValue={currentUser.email}
          className='border p-3 rounded-lg'
          onChange={handleInputChange}
        />
        <input
          type='password'
          id='password'
          placeholder='Password'
          defaultValue={currentUser.password}
          className='border p-3 rounded-lg'
          onChange={handleInputChange}
        />
        <button
          disabled={loading}
          className='bg-blue-600 text-white py-2 rounded-lg uppercase hover:opacity-90 disabled:opacity-80'
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
        <Link to='/create-listing' className='bg-green-600 text-white py-2 rounded-lg text-center uppercase'>
          Create New Listing
        </Link>
      </form>

      <div className='flex justify-between text-sm mt-4 text-red-600'>
        <span className='cursor-pointer' onClick={deleteAccount}>
          Delete Account
        </span>
        <span className='cursor-pointer' onClick={logOutUser}>
          Log Out
        </span>
      </div>

      {error && <p className='text-red-600 mt-4'>{error}</p>}
      {successMsg && <p className='text-green-600 mt-4'>Profile updated successfully!</p>}

      <button onClick={fetchUserListings} className='mt-6 w-full text-blue-700 underline'>
        View My Listings
      </button>
      {fetchError && <p className='text-red-600 mt-4'>Failed to load listings.</p>}

      {listings.length > 0 && (
        <div className='mt-6 flex flex-col gap-4'>
          <h3 className='text-xl text-center font-semibold'>My Listings</h3>
          {listings.map((item) => (
            <div key={item._id} className='border p-3 rounded-lg flex justify-between items-center'>
              <Link to={`/listing/${item._id}`}>
                <img src={item.imageUrls[0]} alt={item.name} className='h-16 w-16 object-cover rounded' />
              </Link>
              <Link to={`/listing/${item._id}`} className='flex-1 ml-4 text-slate-800 hover:underline'>
                {item.name}
              </Link>
              <div className='flex flex-col items-center gap-1'>
                <button onClick={() => deleteListing(item._id)} className='text-red-600 text-sm'>
                  Delete
                </button>
                <Link to={`/update-listing/${item._id}`} className='text-green-600 text-sm'>
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;

