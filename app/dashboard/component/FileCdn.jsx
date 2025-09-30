import { useState, useEffect, useRef } from "react";
import { FaFolderOpen, FaLink, FaTrash, FaUpload   } from "react-icons/fa";
import AlertsConfirm from "@/app/_utils/AlertConfirm"
import axios from "axios"

export default function ComponentFilesCdn() {
	const [files, setFiles] = useState(null)
	const [deleted, setDeleted] = useState(false)
	const [nameCdn, setNameCdn] = useState(null)
	const refUp = useRef(null)

	const GetFilesCdn = async() => {
		const resp = await axios.get(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/data/cdn`,{
			validateStatus:false
		})			
		if (resp.status === 200) {
			setFiles(resp.data.dataFile)
		}
	}

	const DeleteCdn = (name) => {
		setNameCdn(name)
		setDeleted(!deleted)
	}


	const UploadFileCdn = async(files) => {
		const formData = new FormData()
		formData.append("file",files)
		const resp = await axios.post(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/data/cdn`,formData,{
			validateStatus:false
		})
		if (resp.status === 200) {
			await GetFilesCdn()
		}
	}

	const DeleteFiles = async() => {
		if (!nameCdn && deleted) { return }
		const data = {
			files:nameCdn
		}		
		const resp = await axios.delete(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/data/cdn`,{
			data,
			validateStatus:false
		})

		if (resp.status) { 
			setNameCdn('')
			setDeleted(!deleted)
			await GetFilesCdn() 

		}	
	}
	
	useEffect(() => {
		GetFilesCdn()
	},[])
	
    return (
        <div className="bg-white min-h-20 mx-20 mb-20 text-black px-10 py-5 hidden lg:block">
        	<div className="my-5 flex-row flex gap-5" >
        		<h2>Upload CDN</h2>
        		<div onClick={() => refUp.current.click()} className="text-lg hover:text-blue-400 cursor-pointer" >
        			<FaUpload  />
        			<input ref={refUp} type="file" className="hidden"
        			onChange={async(e) => {
        				await UploadFileCdn(e.target.files[0])
        			}}
        			/>
        		</div>
        	</div>
            <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Name File</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Change</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                	{files?.map((e,i) => (
                	<tr className="bg-gray-50" key={i}>
                		<td className="px-6 py-4 text-sm text-gray-800 flex flex-row items-center gap-5">
                			<FaFolderOpen /> {e.name}
                		</td>
                		<td className="px-6 py-4 text-sm text-gray-800">{e.created_at}</td>
                		<td className="px-6 py-4 text-sm text-gray-800 flex flex-row items-center gap-5 ">
                			<div className="hover:text-green-600 cursor-pointer" onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_HOSTCDN}${e.name}`}>
                				<FaLink /> 
                			</div>
                			<div onClick={() => DeleteCdn(e.name)} className="hover:text-red-600 cursor-pointer">
                				<FaTrash />
                			</div>
                		</td>
                	</tr>
                	))}
                </tbody>
            </table>
            <AlertsConfirm 
            show={deleted}
            butonConfirm={(
            	<button onClick={DeleteFiles}  className="bg-blue-200 px-10 py-2 rounded-lg cursor-pointer hover:bg-blue-500" >
            		Deleted
            	</button>
            )}
            buttonCancel={(
            	<button onClick={() => setDeleted(!deleted)} className="bg-red-200 px-10 py-2 rounded-lg cursor-pointer hover:bg-red-500" >
            		Cancel
            	</button>
            )}
            />
        </div>
    );
}
