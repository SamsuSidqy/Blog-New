// SkeletonBlog.tsx
import { motion } from "framer-motion";

export default function SkeletonKonten() {
	return (
		<div className="justify-center mx-5 items-center flex flex-col">
			<div className="w-full lg:w-[900px] flex flex-col gap-10 mb-10">

				{/* Image Skeleton */}
				<motion.div
					initial={{ opacity: 0.3 }}
					animate={{ opacity: 1 }}
					transition={{ repeat: Infinity, duration: 1.2, repeatType: "reverse" }}
					className="w-full lg:h-100 h-80 bg-gray-300 rounded-md animate-pulse"
				/>

				{/* Title Skeleton */}
				<motion.div
					initial={{ opacity: 0.3 }}
					animate={{ opacity: 1 }}
					transition={{ repeat: Infinity, duration: 1.2, repeatType: "reverse" }}
					className="h-8 w-3/4 bg-gray-300 rounded-md mx-auto"
				/>

				{/* Paragraph Skeleton */}
				<div className="flex flex-col gap-4 mt-5">
					{[1, 2, 3, 4].map((_, idx) => (
						<motion.div
							key={idx}
							initial={{ opacity: 0.3 }}
							animate={{ opacity: 1 }}
							transition={{ repeat: Infinity, duration: 1.2, repeatType: "reverse", delay: idx * 0.1 }}
							className="h-5 w-full bg-gray-300 rounded-md"
						/>
					))}

					{[1, 2, 3].map((_, idx) => (
						<motion.div
							key={idx + 4}
							initial={{ opacity: 0.3 }}
							animate={{ opacity: 1 }}
							transition={{ repeat: Infinity, duration: 1.2, repeatType: "reverse", delay: idx * 0.1 }}
							className="h-5 w-[90%] bg-gray-300 rounded-md"
						/>
					))}
				</div>

			</div>
		</div>
	);
}
