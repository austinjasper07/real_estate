import { useRef, useState, useEffect } from "react";
import { LoaderIcon, toast } from "react-hot-toast";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { useUploadFile } from "../../config/uploadFile";

export default function CreateListing() {
  const storage = getStorage(); // Get the Firebase storage instance
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [propertyData, setPropertyData] = useState({});
  const { uploadFile, progress } = useUploadFile();
  const [uploadDone, setUploadDone] = useState(false); 
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: 0,
    discountedPrice: 0,
    bedroom: 0,
    bathroom: 0,
    parking: false, // Initial state for checkboxes as boolean
    offer: false,
    type: "", // Updated to handle radio button selection
    furnished: false,
  });

  // Handle form input changes
  function handleInputChange(e) {
    const { name, type, value, checked } = e.target;

    // Handle checkboxes separately
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Function to handle image deletion
  async function handleDelete(imageUrl) {
    try {
      const imageRef = ref(storage, imageUrl); // Create reference with full folder path

      // Delete the file from Firebase Storage
      await deleteObject(imageRef);

      // Remove the image from the state after successful deletion
      setPropertyData((prevData) => ({
        ...prevData,
        imageUrls: prevData.imageUrls.filter((image) => image !== imageUrl), // Remove the selected image from state
      }));

      // Optional: Show a success message
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  }

  // Handle image uploads
  async function handelFileUpload(files) {
    try {
      if (files.length + imageUrls.length < 1) {
        throw new Error("You can only upload a minimum of 1 image");
      }
      // Check if the total number of files exceeds 6
      if (files.length + imageUrls.length > 6) {
        throw new Error("You can only upload a maximum of 6 images.");
      }

      setUploading(true);
      const allUrl = [];

      await Promise.all(
        files.map(async (file) => {
          const url = await uploadFile("properties", file);
          allUrl.push(url);
        })
      );
      // Update imageUrls state
      setImageUrls((prevValue) => [...prevValue, ...allUrl]);
      setUploadDone(true);
      setUploading(false);
      console.log("This is allUrl:", allUrl);
    } catch (error) {
      setUploading(false)
      console.error(error.message);
      toast.error(error.message);
    }
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    console.log("Updated propertyData:", propertyData);
  }

  // Update propertyData when imageUrls or formData changes
  useEffect(() => {
    if (imageUrls.length > 0 || formData) {
      setPropertyData((prevData) => ({
        ...prevData,
        ...formData,
        imageUrls,
      }));
    }
  }, [imageUrls, formData]);

  // Autofocus on the name input
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <section className="min-h-screen mt-20 lg:-mt-9 max-w-4xl mx-auto py-4 px-6 sm:px-12 md:p-4">
      <h1 className="text-3xl font-bold text-slate-700 text-center mt-8 mb-10">
        Create a Listing
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row flex-wrap gap-8"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            ref={inputRef}
            type="text"
            placeholder="Name"
            name="name"
            maxLength={60}
            minLength={10}
            required
            className="border-0 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded-lg focus:outline-blue-500 w-full ease-linear transition-all duration-150"
            value={formData.name}
            onChange={handleInputChange}
          />

          <textarea
            rows="3"
            placeholder="Description"
            name="description"
            required
            className="border-0 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded-lg focus:outline-blue-500 w-full ease-linear transition-all duration-150"
            value={formData.description}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="address"
            required
            placeholder="Address"
            className="border-0 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded-lg focus:outline-blue-500 w-full ease-linear transition-all duration-150"
            value={formData.address}
            onChange={handleInputChange}
          />

          {/* Handle "type" with radio buttons */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <span className="font-semibold text-slate-700">
                Type of Listing:
              </span>
              <input
                type="radio"
                name="type"
                id="sell"
                value="Sell"
                checked={formData.type === "Sell"}
                onChange={handleInputChange}
                className="w-4"
              />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                name="type"
                id="rent"
                value="Rent"
                checked={formData.type === "Rent"}
                onChange={handleInputChange}
                className="w-4"
              />
              <span>Rent</span>
            </div>
          </div>

          {/* Handle other checkboxes */}
          <div className="flex gap-x-2">
            <input
              type="checkbox"
              name="parking"
              id="parking"
              checked={formData.parking}
              onChange={handleInputChange}
              className="w-4"
            />
            <span>Parking spot</span>
          </div>

          <div className="flex gap-x-2">
            <input
              type="checkbox"
              name="furnished"
              id="furnished"
              checked={formData.furnished}
              onChange={handleInputChange}
              className="w-4"
            />
            <span>Furnished</span>
          </div>

          <div className="flex gap-x-2">
            <input
              type="checkbox"
              name="offer"
              id="offer"
              checked={formData.offer}
              onChange={handleInputChange}
              className="w-4"
            />
            <span>Offer</span>
          </div>

          {/* Bedroom and Bathroom fields */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={10}
                name="bedroom"
                id="beds"
                className="px-2 py-1 border border-gray-400 rounded-lg"
                value={formData.bedroom}
                onChange={handleInputChange}
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={10}
                name="bathroom"
                id="bathroom"
                className="px-2 py-1 border border-gray-400 rounded-lg"
                value={formData.bathroom}
                onChange={handleInputChange}
              />
              <span>Baths</span>
            </div>

            {/* Regular and Discounted price fields */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="regularPrice"
                id="regularPrice"
                className="border border-gray-400 px-2 py-1 text-gray-700 rounded-lg"
                value={formData.regularPrice}
                onChange={handleInputChange}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                name="discountedPrice"
                id="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleInputChange}
                className="px-2 py-1 border border-gray-400 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-y-3">
          <p>
            <span className="font-semibold">Images:</span>
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(Array.from(e.target.files))}
              type="file"
              name="imageUrls"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300"
            />
            <button
              type="button"
              onClick={() => {
                handelFileUpload(files);
              }}
              disabled={files.length === 0 || uploading} // Disable if no files selected
              className="p-3 bg-green-700 text-white border border-green-700 rounded-md uppercase transition-all duration-300 
              hover:opacity-80 w-20 disabled:opacity-30"
            >
              {
                uploading ? <LoaderIcon className="animate-spin mx-auto size-6 text-white"/> : "Upload"
              }
              
            </button>
          </div>

          {/* Display uploaded images with delete option */}
          {uploadDone &&
            propertyData.imageUrls?.map((imageUrl, index) => (
              <div key={index} className="flex justify-between p-3 border items-center">
                <img src={imageUrl} alt="property-image" className="h-20 w-20 object-contain rounded-lg" />
                <button
                  onClick={() => handleDelete(imageUrl)}
                  type="button"
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75 shadow-sm shadow-zinc-300"
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            type="submit"
            className="p-3 bg-slate-700 text-white rounded-lg hover:opacity-95 disabled:opacity-80 uppercase font-medium mt-4"
          >
            Create listing
          </button>
        </div>
      </form>
    </section>
  );
}
