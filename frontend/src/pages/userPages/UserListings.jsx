import { useSelector, useDispatch } from "react-redux";
import { LucideLoader } from "lucide-react";
import { useEffect } from "react";
import { user_listings } from "../../features/userSlice";
import { Link } from "react-router-dom";

export default function UserListings() {
  const { listings, status, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  console.log("this is the listings", listings);

  useEffect(() => {
    dispatch(user_listings());
  }, [dispatch]);

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
    <div className="mt-24 lg:mt-10 container px-8 mx-auto sm:w-3/4 md:w-3/5 lg:w-1/2">
      <h1 class="text-3xl font-bold text-slate-700 text-center mb-8">My Listings</h1>
      <div className="space-y-4">
        {listings && listings.length > 0 ? (
          listings.map((property) => (
            <div
              key={property._id}
              className="flex justify-between items-center border border-slate-400 bg-gradient-to-br from-white to-slate-200 shadow-sm rounded-lg p-3 "
            >
              <Link to={`/listing/${property._id}`}>
                <img
                  src={property.imageUrls[0]}
                  alt="property-image"
                  className="size-16 object-contain"
                />
              </Link>
              <Link className="text-slate-700 font-semibold flex-1 hover:underline  mx-2">
                <h2 className="">{
                  property.name.length < 30 ? property.name :
                  property.name.slice(0, 30) + "..."
                }
                  
                </h2>
              </Link>
              {/* <hr className="border border-gray-300 my-1" /> */}
              <div className="flex flex-col items-center gap-y-1 mx-2 ">
                <button className="text-red-600 hover:opacity-70 transition text-base">
                  Delete
                </button>
                <button className="text-green-600 hover:opacity-70 transition text-base">
                  Modify
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No listings found</p>
        )}
      </div>
    </div>
  );
}
