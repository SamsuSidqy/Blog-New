"use client";

import { motion } from "framer-motion";

export default function ContentBlogSkeleton() {
  return (
    <div className="mx-auto max-w-screen-xl px-5 my-10 min-h-screen">
      <div className="grid lg:grid-cols-3 gap-10">
        {[1, 2, 3].map((e, i) => (
          <motion.div
            key={i}
            className="w-full animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="h-80 rounded-lg overflow-hidden bg-gray-300 dark:bg-gray-700" />

            <div className="flex flex-col gap-3 mt-5">
              <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-4 w-4/6 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
