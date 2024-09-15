import { useRef, useState, useEffect } from "react";

export default function CreateListing() {
  const inputRef = useRef(null);
  const [propertyData, setPropertyData] = useState({});

  function handleInputChange() {
    const { name, value } = e.target;
    setPropertyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <section className="min-h-screen mt-20 lg:-mt-9 max-w-4xl mx-auto py-4 px-6 sm:p-4">
      <h1 className="text-3xl font-bold text-slate-700 text-center mt-8 mb-10">
        Create a Listing
      </h1>

      <form className="flex flex-col sm:flex-row gap-8">
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
            value={propertyData.name}
            onChange={handleInputChange}
          />

          <textarea
            rows="3"
            placeholder="Description"
            name="description"
            className="border-0 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded-lg focus:outline-blue-500 w-full ease-linear transition-all duration-150"
            value={propertyData.description}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            className="border-0 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded-lg focus:outline-blue-500 w-full ease-linear transition-all duration-150"
            value={propertyData.address}
            onChange={handleInputChange}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="type"
                id="sell"
                value={"Sell"}
                className="w-4"
              />
              <span>Sell</span>
            </div>

            <div className="flex gap-x-2">
              <input
                type="checkbox"
                name="type"
                id="rent"
                value={"Rent"}
                className="w-4"
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-x-2">
              <input
                type="checkbox"
                name="parking"
                id="parking"
                className="w-4"
              />
              <span>Parking spot</span>
            </div>

            <div className="flex gap-x-2">
              <input
                type="checkbox"
                name="furnished"
                id="furnished"
                className="w-4"
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-x-2">
              <input type="checkbox" name="offer" id="offer" className="w-4" />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={10}
                defaultValue={1}
                name="bedroom"
                id="beds"
                className="px-2 py-1 border border-gray-400 rounded-lg"
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={10}
                defaultValue={1}
                name="bathroom"
                id="bathroom"
                className="px-2 py-1 border border-gray-400 rounded-lg"
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="regularPrice"
                id="regularPrice"
                className="border border-gray-400 px-2 py-1 text-gray-700 rounded-lg focus:outline-blue-500 ease-linear transition-all duration-150 max-w-28"
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
                className="px-2 py-1 border border-gray-400 rounded-lg focus:outline-blue-500 ease-linear transition-all duration-150 max-w-28"
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
            <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input type="file" name="imageUrls" accept="image/*" multiple className="p-3 border border-gray-300" />
            <button
              onClick={(e)=>{e.preventDefault()}}
              className="p-3 text-green-700 border border-green-700 rounded-md uppercase transition-all duration-300 hover:bg-green-600 hover:text-white disabled:opacity-80"
            >
              Upload  
            </button>
          </div>
          <button className="p-3 bg-slate-700 text-white rounded-lg hover:opacity-95 disabled:opacity-80 uppercase font-medium mt-4">Create listing</button>
        </div>
        
      </form>
    </section>
  );
}
