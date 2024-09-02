import { useState } from "react";

export default function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative mb-3">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-[#2C3E50]" />
      </div>

      <input
        {...props}
        className="w-full font-medium pl-10 py-2 pr-3 my-1 border border-[#E0E0E0] rounded-xl text-[#2C3E50] placeholder-[#7F8C8D] bg-gray-100 focus:outline-blue-500 focus:border-[#1F3A93]"
      />
    </div>
  );
}

export function PasswordInput({
  icon: Icon,
  eye: EyeIcon,
  eyeOff: EyeOffIcon,
  ...props
}) {
  const [hidePass, setHidePass] = useState(true);

  function handleShowPass(e) {
    const passwordInput = document.getElementById(props.id);

    if (passwordInput.value) {
      setHidePass(false);
      e.target.style.display = "none";
      passwordInput.setAttribute("type", "text");
    }
  }

  function handleHidePass(e) {
    const passwordInput = document.getElementById(props.id);

    if (passwordInput.value) {
      setHidePass(true);
      e.target.style.display = "none";
      passwordInput.setAttribute("type", "password");
    }
  }

  return (
    <div className="relative mb-3 sm:mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-[#2C3E50]" />
      </div>

      <input
        {...props}
        className="w-full font-medium pl-10 py-2 pr-3 my-1 border border-[#E0E0E0] rounded-xl text-[#2C3E50] placeholder-[#7F8C8D] bg-gray-100 focus:outline-blue-500 focus:border-[#1F3A93]"
      />

      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        {hidePass ? (
          <EyeIcon
            className="size-5 text-[#2C3E50] cursor-pointer"
            id="eyeOn"
            onClick={hidePass ? handleShowPass : handleHidePass}
          />
        ) : (
          <EyeOffIcon
            id="eyeOff"
            className="size-5 text-[#2C3E50] cursor-pointer"
            onClick={hidePass ? handleShowPass : handleHidePass}
          />
        )}
      </div>
    </div>
  );
}
