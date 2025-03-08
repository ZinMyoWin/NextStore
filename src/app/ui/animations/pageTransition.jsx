'use client'

import { motion } from "motion/react"

export default function PageTransition({children}){

const animation = (variants) => {
    return {
        initial: 'initial',
        animate: 'enter',
        exit: 'exit', // Fixed typo from 'exist' to 'exit'
        variants
    }
}

const pageTransition = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98
    },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.645, 0.045, 0.355, 1], // Custom cubic bezier for smooth motion
            staggerChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.98,
        transition: {
            duration: 0.3,
            ease: [0.645, 0.045, 0.355, 1]
        }
    }
}

    return (
        <motion.div
            {...animation(pageTransition)}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative'
            }}
        >
            {children}
        </motion.div>
    )
}