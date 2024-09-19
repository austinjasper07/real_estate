import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { LucideLoader, TrashIcon, EditIcon, Eye } from "lucide-react";
import { toast } from 'react-hot-toast';
import { useEffect, useState } from "react";
import { user_listings, delete_listing, reset } from "../../features/userSlice";
import { Link, useNavigate } from "react-router-dom";

export default function UserListings() {
  const { listings, status, error, message } = useSelector((state) => state.user);
  const [ modal, setModal ] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(user_listings());
  }, [dispatch]);

  function handleDelete(id) {
    dispatch(delete_listing({ id }))
    .then(() => {
      dispatch(user_listings());
    });
    setModal(false);
    dispatch(reset())
    
  }
  function handleEdit(property) {
    navigate(`/edit_listing/${property._id}`, { state: { property } });
  }


  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LucideLoader className="animate-spin size-12" />
      </div>
    );
  }
  if (status === "failed") {
    return <p>Error: {error}</p>;
  }


  // Ensure listings is not null or undefined before calling .map()
  return (
    <>
      <div className="mt-16 lg:-mt-7 container px-8 md:px-0 mx-auto sm:w-10/12 pt-8">
        <h1 className="text-3xl font-bold text-slate-700 text-center mb-8">
          My Listings
        </h1>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 xl:gap-6">
          {listings && listings.length > 0 ? (
            listings.map((property) => (
              <div
                key={property._id}
                className="flex justify-between md:items-start border border-slate-400 bg-gradient-to-br from-white to-slate-200 shadow-sm rounded-xl p-1 flex-col min-h-52 min-w-24 sm:min-w-44 gap-4"
              >
                <div className="w-full">
                  <Link to={`/listing/${property._id}`}>
                    <img
                      src={property.imageUrls[0]}
                      alt="property-image"
                      className="h-40 md:h-24 w-full object-fill"
                    />
                  </Link>
                </div>

                <Link
                  to={`/listing/${property._id}`}
                  className="text-slate-700 font-semibold flex-1 hover:underline mx-2"
                >
                  <h2 className="">
                    {property.name.length < 50
                      ? property.name
                      : property.name.slice(0, 50) + "..."}
                  </h2>
                </Link>

                <div className="mt-2 flex w-full justify-between items-baseline p-3">
                  <div>
                    <button
                      onClick={() => navigate(`/listing/${property._id}`)}
                      className="hover:opacity-80 border p-2 text-base sm:text-sm rounded-lg bg-gray-100 hover:scale-95 transition duration-150 text-nowrap"
                    >
                      {/* View details */}
                      <Eye className="size-5" />
                    </button>
                  </div>
                  <div className="flex gap-x-3 mx-2  ">
                    <button
                      onClick={() => setModal(true)}
                      className="hover:opacity-80 transition"
                    >
                      <TrashIcon className="size-5 hover:text-red-600" />
                    </button>
                    <button
                      onClick={() => handleEdit(property)}
                      className="hover:opacity-70 transition"
                    >
                      <EditIcon className="size-5 hover:text-green-600" />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {modal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`h-screen fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${
                        modal ? "block" : "hidden"
                      }`}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, transition: { duration: 0.3 } }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white px-6 pb-8 rounded-3xl shadow-lg w-[26rem] h-[25%] overflow-y-auto py-6 text-center text-slate-800"
                      >
                        <h6 className="font-medium text-lg mb-7">
                          Are you sure you want to delete this listing?
                        </h6>
                        <div className="flex justify-evenly">
                          <button
                            onClick={() => handleDelete(property._id)}
                            className="border border-slate-300 shadow-sm rounded-lg px-4 py-1 hover:bg-gray-100 transition-all duration-200"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setModal(false)}
                            className="border border-slate-300 shadow-sm rounded-lg px-4 py-1 hover:bg-gray-100 transition-all duration-200"
                          >
                            No
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <p>No listings found</p>
          )}
        </div>
      </div>
    </>
  );
}
