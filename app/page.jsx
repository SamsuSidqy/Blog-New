"use client"

import { motion, useScroll } from "motion/react"

import HeaderMain from './_utils/header'
import SectionMain from './_utils/section'
import ContentBlog from './_utils/contentBlog'

export default function Home() {
  const { scrollYProgress } = useScroll()	
  return (
    <>
    <motion.div
                id="scroll-indicator"
                style={{
                    scaleX: scrollYProgress,
                    position: "fixed",
                    zIndex:99,
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 10,
                    originX: 0,
                    backgroundColor: "#ff0088",
                }}
            />
    <HeaderMain />
    <SectionMain />
    <ContentBlog />
    </>
  );
}
