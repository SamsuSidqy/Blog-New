"use client";

import React, { useState, useRef } from "react";
import RichTextExample from "./component/Editor";
import HeaderDashboard from "./component/Header";
import { FaDatabase, FaImages, FaPencilAlt } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { motion, AnimatePresence  } from "framer-motion";
import { serialize, deserialize } from "./component/utils/SlateSerialize"
import Alerts from "../_utils/Alert"
import ToggleSwitch from "../_utils/ToogleOn"
import axios from "axios"
import { TbLoader } from "react-icons/tb";

// Modal Komponen dengan Animasi & Background Transparan
function Modal({ onClose, data }) {
    return (
        <AnimatePresence>
            <motion.div className="fixed inset-0 bg-transparent bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="bg-white text-black border-1 border-black min-h-150 rounded-lg p-6 mx-20 w-full shadow-lg relative" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                    <button onClick={onClose} className="absolute cursor-pointer top-2 right-2 text-gray-600 hover:text-red-600 text-xl">
                        &times;
                    </button>
                    <h2 className="text-xl font-bold mb-4">Database Blog</h2>
                    {data}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}




const BtnSkelton = () => {
  return (
    <motion.div
      className="w-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="space-y-4"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        {/* Image skeleton */}
        <div className="text-green-600 text-2xl flex justify-center items-center bg-gray-300 h-15 w-full rounded">
          <TbLoader className="animate-spin" />
        </div>
        
      </motion.div>
    </motion.div>
  );
};

export default function Dashboard() {
    const refFile = useRef(null);
    const [files, setFiles] = useState(null)
    const initialValue = [
        {
            type: "paragraph",
            children: [{ text: "" }],
        },
    ];
    const [value, setValue] = useState(initialValue);
    const [tag, setTag] = useState('');
    const [tagValue, setTagValue] = useState('')
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState([]);
    const [dataBlog, setDataBlog] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertStatus, setAlertStatus] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editorKey, setEditorKey] = useState(0);
    const [publish, setPublish] = useState(true)
    const [updateBlog, setUpdateBlog] = useState(false)

    const HandlePublish = async() => {
    	setLoading(true)
    	const body = serialize(value)
    	const formData = new FormData()

    	if (!body.trim() || !title.trim() || !files || files.length === 0) {
		    setLoading(false);
		    setIsAlertOpen(true);
		    setAlertMessage("Form Required Di Perlukan");
		    setAlertStatus(false);
		    setAlertTitle("Failed");
		    return
		}


    	formData.append("file",files)
    	formData.append("body",body)
    	formData.append("title",title)
    	formData.append('tagline',tagValue)
    	const res = await axios.post(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/blog/create`,formData,{    		
    		headers:{
    			"Content-Type":'multipart/form-data'
    		},
    		validateStatus:false
    	})
    	if (res.status === 200) {
    		setLoading(false)
    		setIsAlertOpen(true)
    		setAlertMessage("Blog Berhasil Di Publish")
    		setAlertStatus(true)
    		setAlertTitle("Succsess") 
    		setValue(initialValue)      		
    	}else{
    		setLoading(false)
    		setIsAlertOpen(true)
    		setAlertMessage("Blog Gagal Di Publish")
    		setAlertStatus(false)
    		setAlertTitle("Failed")
    		setValue(initialValue)   
    	}
    	setTags([])
    	setTitle('')
    	setFiles(null)
    	setTagValue('') 
    	setEditorKey(editorKey + 1)
    	
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && tag.trim() !== '') {
            e.preventDefault();
            if (!tags.includes(tag.trim())) {
            	setTagValue(prev => `${prev} #${tag.trim()}`.trim());
                setTags([...tags, tag.trim()]);
            }
            setTag('')
        }
    };

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };


    const LihatDataBlog = async() => {
    	setIsModalOpen(true)
    	const results = await axios.get(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/blog/list/dashboard`,{
    		validateStatus:false
    	})
    	setDataBlog(results.data.data)
    }

    const DateTimeView = (date) => {
    	const tgl = new Date(date)
    	const bln = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
    	return `${tgl.getDate()} ${bln[tgl.getMonth()]} ${tgl.getFullYear()}, ${tgl.getHours()}:${tgl.getMinutes()}`
    }

    const UpdateDataBlog = async(data) => {
    	setUpdateBlog(true)
    	setIsModalOpen(false)
    	setTitle(data.title)
    	const deserialized = deserialize(data.body);
    	console.log(deserialized)
		  if (!deserialized || deserialized.length === 0) {
		    setValue(initialValue);
		  } else {
		    setValue(deserialized);
		  }
    	setEditorKey(editorKey + 1)
    	setPublish(data.publish)
    	setTags(data.tagline)    	
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-300">
            <HeaderDashboard />
            <div className="hidden lg:block bg-white my-15 mx-20 px-10 pt-10 flex flex-col gap-10">
                <div className="flex flex-row justify-between text-black items-center">
                    {!loading ? <div onClick={HandlePublish} className="w-20 bg-black text-white flex justify-center px-15 py-2 rounded-md hover:bg-blue-400 cursor-pointer"
                    >Publish</div> : <BtnSkelton />}
                    <div className="flex flex-row text-2xl justify-center gap-5">
                        <div onClick={LihatDataBlog} className="cursor-pointer hover:text-blue-600">
                            <FaDatabase />
                        </div>

                        <div onClick={() => refFile.current.click()} className="cursor-pointer hover:text-blue-600">
                            <FaImages />
                            <input
                            required={true} 
                            onChange={(e) => {
                            	const files = e.target.files[0]
                            	setFiles(files)
                            }}
                            ref={refFile} type="file" accept="image/png, image/jpeg" className="hidden" />
                        </div>
                    </div>
                </div>

                <div className={files ? "py-10" : ""} >
                	<img src={files ? URL.createObjectURL(files) : null } alt="" className="" />
                </div>

                <div className="text-black py-10 flex flex-col gap-10">
		            <input
		                className="border-1 w-full h-10 px-5 border-black"
		                placeholder="Title Blog"
		                value={title}
		                onChange={(e) => setTitle(e.target.value)}
		            />
		            {updateBlog && (
		            <div className="flex flex-col gap-2" >
		            	<h2 className="font-semibold" >Publish</h2>
		            	<ToggleSwitch onClick={() => setPublish(!publish)} isOn={publish}  />
		            </div>	
		            )}
		            {/* Input untuk Tag */}
		            <div className="border-1 w-full min-h-10 px-5 border-black flex flex-wrap gap-2 p-2">
		                {tags.map((tag, index) => (
		                    <div
		                        key={index}
		                        className="bg-blue-200 text-blue-800 px-3 py-1 rounded-md flex items-center gap-2"
		                    >
		                        <span>{tag}</span>
		                        <button
		                            type="button"
		                            onClick={() => removeTag(index)}
		                            className="text-red-600 cursor-pointer text-lg hover:text-red-700"
		                        >
		                            <IoIosCloseCircle />
		                        </button>
		                    </div>
		                ))}
		                <input
		                    className="flex-grow min-w-[150px] focus:outline-none"
		                    placeholder="Add tags"
		                    value={tag}
		                    onChange={(e) => setTag(e.target.value)}
		                    onKeyDown={handleKeyDown}
		                />
		            </div>
		        </div>

                <RichTextExample key={editorKey} value={value} onChange={setValue} />
            </div>

            {/* Modal */}
            {isModalOpen && (
			  <Modal onClose={() => setIsModalOpen(false)} 
			    data={(
			      <div className="max-h-[70vh] overflow-y-auto">
			        <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
			          <thead className="bg-gray-100">
			            <tr>
			              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Title Blog</th>
			              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Created At</th>
			              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Status</th>
			              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Change</th>
			            </tr>
			          </thead>
			          <tbody className="bg-white divide-y divide-gray-200">
			            {dataBlog?.map(data => (
			            <tr className="hover:bg-gray-50" key={data._id}>
			              <td className="px-6 py-4 text-sm text-gray-800">{data.title}</td>
			              <td className="px-6 py-4 text-sm text-gray-800">{DateTimeView(data.created_at)}</td>
			              <td className="px-6 py-4 text-sm text-gray-800">
			              	{data.publish ? (
			              	<div className="flex justify-center items-center p-1 rounded-md bg-green-200" >
			              		Publish
			              	</div>			              	
			              	):
			              	<div className="flex justify-center items-center p-1 rounded-md bg-red-200" >
			              		Not Publish
			              	</div>}
			              </td>
			              <td className="px-6 py-4 text-sm text-gray-800">
			              	<div onClick={() => UpdateDataBlog(data)}  className="cursor-pointer hover:text-blue-600 text-3xl" >
			              		<FaPencilAlt />
			              	</div>
			              </td>
			            </tr>	
			            ))}			           
			            {/* Tambahkan baris lagi jika ingin test scroll */}
			          </tbody>
			        </table>
			      </div>
			    )}
			  />
			)}

            <Alerts
		        show={isAlertOpen}
		        onClose={() => setIsAlertOpen(false)}
		        title={alertTitle}
		        message={alertMessage}
		        status={alertStatus}
		      />
        </div>
    );
}
