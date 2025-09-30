"use client"

import Head from 'next/head'
import { use, useRef, useEffect, useState  } from 'react'
import { useRouter } from 'next/navigation'
import { FaPaste, FaCalendarAlt } from "react-icons/fa";

import hljs from 'highlight.js/lib/core';

import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml'; // Untuk JSX/HTML
import golang from 'highlight.js/lib/languages/go';
import python from 'highlight.js/lib/languages/python';
import php from 'highlight.js/lib/languages/php';
import java from 'highlight.js/lib/languages/java';
import shell from 'highlight.js/lib/languages/shell';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('jsx', xml);         // JSX pakai xml
hljs.registerLanguage('tsx', typescript);  // TSX pakai typescript
hljs.registerLanguage('html', xml);
hljs.registerLanguage('go', golang);
hljs.registerLanguage('python', python);
hljs.registerLanguage('php', php);
hljs.registerLanguage('java', java);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('bash', shell);

import HeaderMain from '../_utils/header'
import SkeletonKonten from "../_utils/SkeletonKonten"

import axios from "axios"
import 'highlight.js/styles/xt256.min.css'
export default function ReadBlog({params}){
	const { slug } = use(params)
	const [konten, setKonten] = useState(null)
	const [loading, setLoading] = useState(false)


	const GetContent = async() => {
		setLoading(true)
		const resp = await axios.get(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/blog/look/${slug}`,{
			validateStatus:false
		})
		if (resp.status === 200) {
			setKonten(resp.data.data)
		}else if(resp.status === 429){

		}else{

		}
		setLoading(false)
	}
	
	useEffect(() => {
		GetContent()
	},[])

	useEffect(() => {
	  if (konten?.body) {
	    hljs.highlightAll();
	  }
	}, [konten]);

	if (loading) {
		return(
			<>
				<HeaderMain />
				<SkeletonKonten />
			</>
		)
	}
	
	const DateTimeView = (date) => {
      const tgl = new Date(date)
      const bln = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
      return `${tgl.getDate()} ${bln[tgl.getMonth()]} ${tgl.getFullYear()}, ${tgl.getHours()}:${tgl.getMinutes()}`
  	}

	return(
		<>
		<HeaderMain />
		<Head>
			<meta property="og:type" content="article" />
		    <meta property="og:image" content={`https://cdn.abisamsu.my.id/cdn/${konten?.media}`} />
		    <meta property="og:title" content={konten?.title} />
		    <meta property="og:description" content="Readding My Bloggg | Samsoee" />
		    <meta property="og:url" content={`https://abisamsu.my.id/${konten?.slug}/`} />
		    <meta property="og:site_name" content="abisamsu.my.id" />
		    <meta property="og:locale" content="id_ID" />
		    <meta name="twitter:card" content="summary_large_image" />
		    <meta name="twitter:title" content={konten?.title} />
		    <meta name="twitter:description" content="Readding My Bloggg | Samsoee" />
		    <meta name="twitter:image" content={`https://cdn.abisamsu.my.id/cdn/${konten?.media}`} />
		    <meta name="twitter:domain" content="www.abisamsu.my.id" />
		</Head>
		<div className="justify-center  mx-5 items-center flex flex-col" >
			<div className="w-full lg:w-[900px] flex flex-col gap-10 mb-10">

				{/*Image Blog*/}
				<div
				  className="
				    w-full
				    rounded-md
				    bg-[url(https://abisamsu.my.id/uploads/images/e2df2852-7021-4ea4-98f2-c4277029ec7d.jpg)]
				    bg-cover
				    bg-center
				    pb-[56.25%] 
				    bg-sky-200
				  "
				></div>

				<div className="justify-center flex items-center flex-col gap-5" >
					<h2 className="text-3xl text-center font-[Closeness_Fonts]" >{konten?.title}</h2>
					<div className="flex flex-row justify-center items-center gap-5" >
						<FaCalendarAlt />
						<b>{DateTimeView(konten?.created_at)} WIB</b>
					</div>
				</div>


				<div
				  className="font-serif text-lg prose max-w-none"
				  dangerouslySetInnerHTML={{ __html: konten?.body }}
				></div>


			</div>
		</div>
		</>
	)
}
