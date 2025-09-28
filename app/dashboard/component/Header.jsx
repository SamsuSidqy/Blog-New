import { logoutUsers } from "@/lib/@Cookies"
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TbLoader } from "react-icons/tb";
import { useState } from "react"

const BtnSkelton = () => {
  return (
    <motion.div
      className="w-full"
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
        <div className="text-white-600 text-2xl flex justify-center items-center px-10 py-2 rounded">
          <TbLoader className="animate-spin" />
        </div>
        
      </motion.div>
    </motion.div>
  );
};

export default function HeaderDashboard(){
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const handleLogout = async() => {
		setLoading(true)
		const results = await logoutUsers()		
		if (results) {
			router.replace("/login")
		}else{

		}
		setLoading(false)
	}

	return(
		<div className="flex flex-col mx-20 my-10">
			<h1 className="hidden lg:block text-4xl font-semibold text-black" >
				Hello Samsoe 👋
			</h1>
			<div className="flex justify-between items-center" >
				<h3 className="hidden lg:block text-black font-bold" >
					Mau Bercerita Apa Hari Ini ...?
				</h3>
				<div onClick={handleLogout} className="cursor-pointer text-white bg-black px-10 py-2 rounded-md " >
					{loading ? <BtnSkelton /> : "Logout"}
				</div>
				
			</div>
		</div>
	)
}