"use client";

import { FaCalendarAlt } from "react-icons/fa";
import { useRouter } from 'next/navigation';

export default function ContentBlog({data}) {
  const router = useRouter()

  const DateTimeView = (date) => {
      const tgl = new Date(date)
      const bln = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
      return `${tgl.getDate()} ${bln[tgl.getMonth()]} ${tgl.getFullYear()}, ${tgl.getHours()}:${tgl.getMinutes()}`
  }
  const extractFirstParagraphText = (htmlString) =>  {        
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const firstParagraph = doc.querySelector("p");
    return firstParagraph ? firstParagraph.textContent : "";
  }

  const ReadBlog = (slg) => {
    router.push(`/${slg}`)
  }

  return (
    <div className="mx-auto max-w-screen-xl px-5 my-10 min-h-screen">
  <div className="grid lg:grid-cols-3 gap-10">
    {data?.map((e, i) => (
      <div key={i} className="w-full">
        <div className="h-80 rounded-lg overflow-hidden">
          <div onClick={() => ReadBlog(e.slug)} className="h-full w-full bg-[url('https://stackoverflow.co/img/product/teams/teams-home-overview.png')] bg-cover cursor-pointer transition-transform duration-300 hover:scale-105"></div>
        </div>

        <div className="flex flex-col gap-3 mt-5">
          <h2 onClick={() => ReadBlog(e.slug)} className="hover:text-sky-400 cursor-pointer duration-150 font-[Closeness_Fonts] text-state-100 text-xl md:text-2xl">
           {e.title}
          </h2>
          <div className="items-center flex flex-row gap-2">
            <FaCalendarAlt />
            <p>{DateTimeView(e.created_at)}</p>
          </div>
          <p className="font-serif text-sm md:text-base">
            {extractFirstParagraphText(e.body).slice(0,150)}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

  );
}
