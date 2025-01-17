'use client'

import { delay, easeInOut } from "motion"
import { motion } from "motion/react"


export default function PageTransition({children}){

const animation=(variants)=>{

    return {
        initial: 'initial',
        animate: 'enter',
        exist: 'exist',
        variants
    }
}

const opacity = {
    initial: {
        opacity: 0,
        x: 10
    },
    enter:{
        opacity: 1, 
        transition: {
            duration: 1,
            ease: 'easeInOut',
        },
        x: 0
    },
    exist:{
        opacity: 1
    },
}

    return (
        <motion.div
            {...animation(opacity)}
        >
            {children}
        </motion.div>
    )
}