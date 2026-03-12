import React from 'react';
import { Maximize } from 'lucide-react';
import styles from './StaycationPreviewCard.module.css';

export default function StaycationPreviewCard({
    title = "Staycation",
    price = "800.000đ / đêm",
    imageUrl = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"
}) {
    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={imageUrl} alt={title} className={styles.image} />
            </div>
            <div className={styles.details}>
                <h3 className={styles.title} title={title}>{title}</h3>
                <div className={styles.actionRow}>
                    <span className={styles.price}>{price}</span>
                    <Maximize size={16} strokeWidth={3} color="#E61E4D" style={{ cursor: 'pointer' }} />
                </div>
            </div>
        </div>
    );
}
