"use client"
import {useState, useEffect} from "react"

import { motion, useScroll } from "motion/react"

import axios from "axios"

import HeaderMain from './_utils/header'
import ContentBlog from './_utils/contentBlog'
import FooterComponent from "./_utils/footer"
import ContentBlogSkeleton from "./_utils/SkeletonBlog"




export default function Home() {
  const { scrollYProgress } = useScroll()	

  const [konten, setKonten] = useState(null)
  const [loading, setLoading] = useState(false)

  const GetKonten = async() => {
    setLoading(true)
    const resp = await axios.get(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/blog/list/konten`)
    if (resp.status === 200) {
        setKonten(resp.data.data)
    }else if(resp.status === 429){

    }else{

    }
    setLoading(false)
  }

  useEffect(() => {
    GetKonten()
  },[])

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
    {loading ? <ContentBlogSkeleton /> :<ContentBlog data={konten} />}
    <FooterComponent />
    </>
  );
}
