import { useSelector, useDispatch } from "react-redux";
import { LucideLoader } from "lucide-react";
import { useEffect } from "react";
import { user_listings } from "../../features/userSlice";
import { Link } from "react-router-dom";

export default function Listing() {
  const { listings, status, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  console.log("this is the listings", listings);

  // useEffect(() => {
  //   dispatch(user_listings());
  // }, [dispatch]);

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
    <div className="mt-24 lg:mt-10 container px-8">
      <h1 class="text-3xl font-bold text-center mb-8">Property Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6">
        {listings && listings.length > 0 ? (
          listings.map((property) => (
            <div
              key={property._id}
              className="bg-gradient-to-br from-slate-100 to-slate-200 shadow-md rounded-xl overflow-hidden transform transition hover:scale-105 mb-8 mx-auto space-y-2"
            >
              <Link to={`/listing/${property._id}`}>
                <img
                  src={property.imageUrls[1]}
                  alt="property-image"
                  className=" w-full h-32 sm:h-48 object-scale-cover"
                />
                <div className="px-4 py-3">
                  <h2 className="text-lg font-semibold">{property.name}</h2>
                  <p className="text-gray-500 mt-2">
                    {property.description.slice(0, 100) + "..."}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-gray-900">
                      $120
                    </span>
                    <a href="#" className="text-blue-600 hover:underline">
                      View Details
                    </a>
                  </div>
                </div>
              </Link>
              <hr className="border border-gray-300 my-1" />
              <div className="flex justify-end gap-x-4 px-4 pb-4 mt-1">
                <button className="bg-red-600 text-white p-1 rounded-lg hover:opacity-80 transition text-base">
                  Delete
                </button>
                <button className="bg-green-600 text-white p-1 rounded-lg hover:opacity-80 transition text-base">
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

