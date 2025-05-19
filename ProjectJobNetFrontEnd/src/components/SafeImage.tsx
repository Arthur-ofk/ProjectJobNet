import React, { useState } from 'react';

type SafeImageProps = {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
};

/**
 * A component that safely handles image loading with fallback
 * Prevents tracking prevention blocks and handles data URLs
 */
const SafeImage: React.FC<SafeImageProps> = ({ 
  src, 
  alt, 
  fallbackSrc = '/placeholder-image.png', 
  className = '',
  style = {},
  onLoad,
  onError
}) => {
  const [error, setError] = useState(false);
  
  // Handle image error
  const handleError = () => {
    setError(true);
    if (onError) onError();
  };
  
  // Handle image load success
  const handleLoad = () => {
    if (onLoad) onLoad();
  };
  
  // If the source is a data URL, use it directly
  if (src.startsWith('data:')) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        onLoad={handleLoad}
        onError={handleError}
      />
    );
  }
  
  // For external URLs, check if we have an error and use fallback if needed
  return (
    <img
      src={error ? fallbackSrc : src}
      alt={alt}
      className={className}
      style={style}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};

export default SafeImage;
