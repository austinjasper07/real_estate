import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Loader2} from "lucide-react"
import toast from "react-hot-toast";
import { useUploadFile } from "../../config/uploadFile";
import { updateProfile, reset } from "../../features/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, message, error, status } = useSelector((state) => state.auth);
  const [disable, setDisable] = useState(true);
  const [userData, setUserData] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    imageUrl: user.imageUrl,
    phone: user.phone,
    aboutMe: user.aboutMe,
    address: user.address,
    zipCode: user.zipCode,
    country: user.country,
    city: user.city,
    aboutMe: user.aboutMe,
  });
  const [file, setFile] = useState(undefined);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const [uploadError, setUploadError] = useState(null);
  const [update, setUpdate] = useState(false);
  const { uploadFile, progress } = useUploadFile();

  useEffect(() => {
    if (file) {
      handleAvatarUpload(file);
    }
  }, [file]);

  useEffect(() => {
    if (update) {
      dispatch(updateProfile(userData));
      setUpdate(false);
    }
  }, [update, dispatch, userData]);
  
  useEffect(() => { inputRef.current.focus(); }, [disable]);
  useEffect(() => {
    if (status === "succeeded") {
      toast.success("Profile updated successfully")
    }
  
    return () => {
      dispatch(reset())
    }
  }, [status])
  

  const handleAvatarUpload = async (file) => {
    try {
      const url = await uploadFile("avatar", file);
      setUserData((prevData) => ({ ...prevData, imageUrl: url }));
      setUpdate(true);
    } catch (error) {
      setUploadError("Error uploading file");
      setTimeout(() => setUploadError(""), 3000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisable(true)
    dispatch(updateProfile(userData)); // Dispatch the update action
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };


  return (
    <main className="">
      {/* Page content */}
      <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-[60vh] mt-16 lg:-mt-9 px-12 pt-10 text-white">
        <h2 className="text-4xl font-semibold mb-5">Hello {user.firstname}</h2>
        <p className="font-light lg:w-[50%] text-lg">
          This is your profile page. You can see the progress you've made with
          your work and manage your projects or assigned tasks.
        </p>
      </div>
      <div className="px-8 mx-auto -mt-20">
        <div className="flex flex-col md:flex-row-reverse">
          {/* User shortened information */}
          <div className="w-full xl:w-4/12 mb-5 xl:mb-0 px-4 md:w-2/3 relative">
            <div className="bg-white shadow-lg rounded-2xl pb-5">
              <div className="flex justify-center pt-10">
                <form>
                  <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                  />
                  <img
                    alt="Profile image"
                    src={
                      userData.imageUrl ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0KehqXBrMLd32HsfjDoaq098WeNA0b3g_2A&s"
                    }
                    className="absolute -top-20 left-1/2 -translate-x-1/2 shadow-lg rounded-full size-44 md:size-52 text-center border-none max-w-150-px"
                  />
                </form>
              </div>

              <div className="text-center mt-16 md:mt-24">
                {uploadError ? (
                  <p className="italic mb-1 text-red-600">{uploadError}</p>
                ) : (
                  progress > 0 &&
                  progress < 100 && (
                    <p className="italic mb-1">
                      Uploading image {progress}% done
                    </p>
                  )
                )}
                <button
                  onClick={() => fileRef.current.click()}
                  className="bg-blue-500 text-white font-semibold text-xs p-2 rounded shadow-md hover:bg-blue-700 outline-none focus:outline-none ease-linear transition-all duration-150"
                >
                  Upload
                </button>
                <div className="flex justify-center py-4 pt-8">
                  <div className="mr-4 p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                      22
                    </span>
                    <span className="text-sm text-gray-500">Listings</span>
                  </div>
                  <div className="mr-4 p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                      10
                    </span>
                    <span className="text-sm text-gray-500">Rented</span>
                  </div>
                  <div className="lg:mr-4 p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                      89
                    </span>
                    <span className="text-sm text-gray-500">Comments</span>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <h3 className="text-xl font-semibold leading-normal text-gray-800 mb-2">
                  {user.firstname + " " + user.lastname}
                  <span className="text-sm font-light text-gray-500">, 27</span>
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-gray-500"></i>
                  {user.state || "City"} | {user.country || "Country"}
                </div>
                {user.isProfessional && (
                  <div className="mb-2 text-gray-700 mt-10">
                    <i className="fas fa-briefcase mr-2 text-lg text-gray-500"></i>
                    {user.profession}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Full Information */}
          <div className="w-full xl:w-8/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-2xl">
              <div className="px-6 py-6">
                <div className="flex flex-wrap justify-between items-center">
                  <h3 className="text-xl font-bold">My account</h3>
                  <button
                    onClick={() => setDisable(false)}
                    className="bg-blue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow-md hover:bg-blue-700 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
              <div className="p-6 bg-[#ebebeb]">
                <form onSubmit={handleSubmit}>
                  <h6 className="text-gray-500 text-lg mt-3 mb-6 font-bold uppercase">
                    User information
                  </h6>

                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                          First name
                        </label>
                        <input
                          ref={inputRef}
                          disabled={disable}
                          type="text"
                          name="firstname"
                          className="border-0 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-base font-semibold shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          value={userData.firstname || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                          Last name
                        </label>
                        <input
                          disabled={disable}
                          type="text"
                          name="lastname"
                          className="border-0 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-base font-semibold shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          value={userData.lastname || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                          Email address
                        </label>
                        <input
                          disabled={true}
                          type="email"
                          name="email"
                          className="border-0 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded shadow focus:outline-none font-semibold focus:ring w-full ease-linear transition-all duration-150 text-base"
                          value={user.email || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                          Phone Number
                        </label>
                        <input
                          disabled={disable}
                          type="text"
                          name="phone"
                          className="border-0 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-base font-semibold shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          value={userData.phone || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {user.isProfessional && (
                    <>
                      <hr className="mt-6 border-b-1 border-gray-300" />

                      <h6 className="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
                        Contact information
                      </h6>
                      <div className="flex flex-wrap">
                        <div className="w-full px-4">
                          <div className="relative w-full mb-3">
                            <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                              Address
                            </label>
                            <input
                              disabled={disable}
                              type="text"
                              name="address"
                              className="border-0 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-base font-semibold shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                              value={userData.address || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap">
                        <div className="w-full lg:w-4/12 px-4">
                          <div className="relative w-full mb-3">
                            <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                              City
                            </label>
                            <input
                              disabled={disable}
                              type="text"
                              name="city"
                              className="border-0 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-base font-semibold shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                              value={userData.city || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="w-full lg:w-4/12 px-4">
                          <div className="relative w-full mb-3">
                            <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                              Country
                            </label>
                            <input
                              disabled={disable}
                              type="text"
                              name="country"
                              className="border-0 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-base font-semibold shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                              value={userData.country}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="w-full lg:w-4/12 px-4">
                          <div className="relative w-full mb-3">
                            <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                              Zip/Postal code
                            </label>
                            <input
                              disabled={disable}
                              type="number"
                              name="zipCode"
                              className="border-0 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-base font-semibold shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                              value={userData.zipCode || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <hr className="mt-6 border-b-1 border-gray-300" />

                  <h6 className="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
                    About me
                  </h6>
                  <div className="flex flex-wrap">
                    <div className="w-full px-4">
                      <div className="relative w-full mb-3">
                        <textarea
                          disabled={disable}
                          rows="5"
                          name="aboutMe"
                          className="border-0 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-base font-semibold shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          value={userData.aboutMe || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-wrap justify-end mr-1">
                    <button
                      type="submit"
                      disabled={disable}
                      className={
                        disable
                          ? "opacity-70 bg-blue-500 p-2 text-white rounded-md"
                          : "p-2 text-white bg-blue-500 rounded-md hover:bg-blue-700 transition-colors"
                      }
                    >
                      {status === 'loading' ? 
                        <Loader2 className="animate-spin mx-auto"/> : "Update Profile"
                      }
                      
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
