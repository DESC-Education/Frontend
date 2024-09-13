"use client";

import { motion } from "framer-motion";
import "./page.scss"

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            className="chatContainer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeInOut", duration: 0.2 }}
        >
            {children}
        </motion.div>
    );
}
