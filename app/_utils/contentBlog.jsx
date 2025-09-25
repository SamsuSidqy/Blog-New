"use client";

import { FaCalendarAlt } from "react-icons/fa";

export default function ContentBlog() {
  return (
    <div className="mx-5 md:mx-15 lg:mx-20 my-10 min-h-screen">
      <div className="lg:justify-center lg:items-center grid lg:grid-cols-3 gap-40">

        <div className="w-full lg:w-[400px] lg:h-100 h-90">
          <div className="w-full lg:h-60 h-80 bg-sky-400"></div>
          <div className="flex flex-col gap-3 mt-5">
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
        </div>
        

      </div>
    </div>
  );
}
