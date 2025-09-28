"use client"
import { use, useRef, useEffect  } from 'react'
import { useRouter } from 'next/navigation'
import { FaPaste   } from "react-icons/fa";

import hljs from 'highlight.js/lib/core';

import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('javascript', javascript)

import HeaderMain from '../_utils/header'


export default function ReadBlog({params}){
	const { slug } = use(params)
	const containerRef = useRef(null);
	const testt = '<h1 class="text-sky-400">Hello</h1>'
	const highlightedCode = hljs.highlight(
	  `import type { Metadata } from 'next'
 
		export const metadata: Metadata = {
		  title: {
		    default: 'Acme',
		  },
		}`,
	  { language: 'javascript' }  
	).value
	
	useEffect(() => {
		const container = containerRef.current;
	    const buttons = container?.querySelectorAll('.tombol-copy');
	    if (!buttons) return;

	    const handlers = [];

	    buttons.forEach((btn) => {
	      const handleCopy = () => {
	        const pre = btn.closest('pre'); // cari elemen <pre> terdekat
	        const code = pre?.querySelector('code');
	        if (code) {
	          const text = code.innerText;
	          navigator.clipboard.writeText(text)
	            .then(() => alert('Copied!'))
	            .catch(() => alert('Failed to copy'));
	        }
	      };

	      btn.addEventListener('click', handleCopy);
	      handlers.push({ btn, handleCopy });
	    });

	    // cleanup saat komponen unmount
	    return () => {
	      handlers.forEach(({ btn, handleCopy }) => {
	        btn.removeEventListener('click', handleCopy);
	      });
	    };
	},[])

	return(
		<>
		<HeaderMain />
		<div ref={containerRef} className="justify-center  mx-5 items-center flex flex-col" >
			<div className="w-full lg:w-[900px] flex flex-col gap-10 mb-10">

				{/*Image Blog*/}
				<div className="
				w-full
				bg-[url(https://plus.unsplash.com/premium_photo-1681426687411-21986b0626a8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover rounded-md
				lg:h-100
				h-80
				bg-sky-200
				" >
				</div>

				<div className="justify-center flex items-center" >
					<h2 className="text-3xl text-center font-[Closeness_Fonts]" >Cara Membuat Sabu Sabu Fixx No Root</h2>
				</div>


				<div className="font-serif text-lg" >
					{/*<div dangerouslySetInnerHTML={{__html:``}} >
					</div>*/}
					<p className=" text-justify">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
					Praesent a lorem ac nulla tempor porta. Morbi non lorem metus. 
					Morbi aliquet auctor felis id lacinia. Maecenas in risus in libero feugiat imperdiet a in felis. Nullam leo enim, tristique id tristique non, egestas eu nunc. Sed a pulvinar dui, eu congue diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Orci varius natoque penatibus et magnis dis parturient montes, nascetur 
					ridiculus mus. Nam ac quam tellus. Aenean quis eleifend lectus. Ut suscipit enim vel ex dapibus
					</p>
					<br/>
					<p className=" text-justify">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
					Praesent a lorem ac nulla tempor porta. Morbi non lorem metus. 
					Morbi aliquet auctor felis id lacinia. Maecenas in risus in libero feugiat imperdiet a in felis. Nullam leo enim, tristique id tristique non, egestas eu nunc. Sed a pulvinar dui, eu congue diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Orci varius natoque penatibus et magnis dis parturient montes, nascetur 
					ridiculus mus. Nam ac quam tellus. Aenean quis eleifend lectus. Ut suscipit enim vel ex dapibus
					</p>
					<br/>
					<pre className="relative text-white">
					  <div
					    className="absolute tombol-copy top-5 right-5 cursor-pointer text-white hover:text-gray-300"					    
					  >
					    <FaPaste  />
					  </div>
					  <code
					    className="hljs language-python"
					    dangerouslySetInnerHTML={{ __html: highlightedCode }}
					  />
					</pre>
					<div
					dangerouslySetInnerHTML={{__html:testt}}
					>
					</div>
					<blockquote className="bg-white text-black p-4 italic font-bold border-l-4 border-indigo-500" >
						Hello Worlds
					</blockquote>
					<br/>
					<ul>
						<li>1. Hayy</li>
					</ul>
					<br />
					<p className=" text-justify">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
					Praesent a lorem ac nulla tempor porta. Morbi non lorem metus. 
					Morbi aliquet auctor felis id lacinia. Maecenas in risus in libero feugiat imperdiet a in felis. Nullam leo enim, tristique id tristique non, egestas eu nunc. Sed a pulvinar dui, eu congue diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Orci varius natoque penatibus et magnis dis parturient montes, nascetur 
					ridiculus mus. Nam ac quam tellus. Aenean quis eleifend lectus. Ut suscipit enim vel ex dapibus
					</p>

					<div className="justify-center items-center flex" >
						<img
						  src="https://cdn.abisamsu.my.id/cdn/785c077a-2e2e-40c9-95c3-4518ec2409cf.jpg"
						  className="w-full lg:h-[400px] lg:object-contain  object-cover"
						/>

					</div>
					<br />
				</div>

			</div>
		</div>
		</>
	)
}
