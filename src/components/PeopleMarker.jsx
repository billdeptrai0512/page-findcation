import React from 'react';
import { motion } from 'framer-motion';

export default function PeopleMarker() {
    return (
        <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
                width: 41,
                height: 50,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <img src="/people.webp" alt="You are here" style={{ width: '100%', height: '100%', pointerEvents: 'none' }} />
        </motion.div>
    );
}
