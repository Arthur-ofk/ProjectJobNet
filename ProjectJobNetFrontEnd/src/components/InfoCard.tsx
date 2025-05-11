import React from 'react';
import './InfoCard.css';

interface InfoCardProps {
  title: string;
  subtitle?: React.ReactNode;
  description: string;
  tags?: string[];
  upvotes?: number;
  rating?: number;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, subtitle, description, tags, upvotes, rating }) => (
  <div className="card">
    <h4>{title}</h4>
    {subtitle && <div className="subtitle">{subtitle}</div>}
    {tags && tags.length > 0 && (
      <div className="tags">
        {tags.map(tag => (
          <span className="tag" key={tag}>{tag}</span>
        ))}
      </div>
    )}
    <div className="desc">{description}</div>
    {(upvotes !== undefined || rating !== undefined) && (
      <div className="meta">
        {upvotes !== undefined && <span>⬆ {upvotes}</span>}
        {rating !== undefined && <span style={{ marginLeft: 8 }}>⭐ {rating.toFixed(1)}</span>}
      </div>
    )}
  </div>
);

export default InfoCard;
