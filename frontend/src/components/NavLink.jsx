import React, { useState } from "react";
import { Link } from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion"

export default function FlyoutLink({ children, link, FlyoutContent }){
  const [open, setOpen] = useState(false);
  const showFlyout = open && FlyoutContent;
   
  return (
    <div
      className="relative h-0 w-fit"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link to={link} className="relative text-white">
        {children}
        <span
          style={{
            transform: showFlyout ? "scaleX(1)" : "scaleX(0)",
          }}
          className="absolute -bottom-2 -left-2 -right-2 h-1 origin-left rounded-full bg-indigo-300 transition-transform duration-300 ease-out"
        />
      </Link>
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{opacity: 0, translateY: 30}}
            animate={{opacity: 1, translateY: 0}}
            exit={{opacity: 0, translateY: 15}}
            style={{ translateX: "-50%" }}
            transition={{duration: 0.3, ease: "easeOut"}}
            className="bg-white z-50 shadow-xl absolute left-1/2  top-12"
          >
            <FlyoutContent />
          </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};
