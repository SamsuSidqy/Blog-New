"use client"

import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (customDelay) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: customDelay },
  }),
};

export default function SectionMain() {
  return (
    <motion.div
      className="mx-4 md:mx-10 lg:mx-20 my-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-10 px-4 md:px-10"
        variants={containerVariants}
      >
        {/* Section Utama */}
        <motion.div
          className="flex flex-col gap-5 w-full lg:w-[600px]"
          variants={itemVariants}
          custom={0}
          whileHover={{ scale: 1.02, y: -4, boxShadow: "0px 5px 20px rgba(0,0,0,0.1)" }}
          whileTap={{ scale: 0.98 }}
        >
          <div
            onClick={() => console.log(2)}
            className="hover:opacity-[0.5] duration-250 cursor-pointer border border-white-950 w-full h-60 md:h-72 bg-[url(https://plus.unsplash.com/premium_photo-1681426687411-21986b0626a8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover rounded-md"
          ></div>

          <div className="flex flex-col gap-3">
            <h2 className="hover:text-sky-400 cursor-pointer duration-150 font-[Closeness_Fonts] text-state-100 text-xl md:text-2xl">
              Menentukan Arah Mata Angin Di Mari
            </h2>
            <div className="items-center flex flex-row gap-2">
              <FaCalendarAlt />
              <p>25 Januari 2004 • 20:25 WIB</p>
            </div>
            <p className="font-serif text-sm md:text-base">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s ....
            </p>
          </div>
        </motion.div>

        {/* Section Kedua */}
        <div className="hidden lg:block lg:flex lg:flex-col lg:gap-5 w-full lg:w-[500px]">
          {[1, 2, 3].map((item, idx) => (
            <motion.div
              key={item}
              className="flex flex-col sm:flex-row justify-start gap-3 sm:gap-5"
              variants={itemVariants}
              custom={0.7 * (idx + 1)}
              whileHover={{ scale: 1.02, y: -4, boxShadow: "0px 5px 20px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="cursor-pointer border border-white-950 w-full sm:w-[280px] bg-[url(https://plus.unsplash.com/premium_photo-1681426687411-21986b0626a8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover h-24 sm:h-30"></div>
              <div className="flex flex-col gap-2">
                <h2 className="font-[Closeness_Fonts] text-state-100 text-lg">
                  Tutorial Menjadi Singa Raja ..?
                </h2>
                <div className="items-center flex flex-row gap-2">
                  <FaCalendarAlt />
                  <p>25 Januari 2004 • 20:25 WIB</p>
                </div>
                <p className="font-serif text-sm md:text-base">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry ....
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
