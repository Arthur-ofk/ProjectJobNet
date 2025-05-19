/**
 * Resizes an image file to a maximum width/height while maintaining aspect ratio
 * @param file Original file
 * @param maxSize Maximum width/height in pixels
 * @returns Promise resolving to a resized File object
 */
export const resizeImage = (file: File, maxSize = 400, quality = 0.7): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height = Math.round(height * maxSize / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round(width * maxSize / height);
            height = maxSize;
          }
        }
        
        // Create canvas and resize
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to Blob/File with reduced quality
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas to Blob conversion failed'));
            return;
          }
          
          // Use a smaller file name to reduce header size
          const resizedFile = new File([blob], "profile.jpg", {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          
          resolve(resizedFile);
        }, 'image/jpeg', quality); // Reduced quality (0.7) for smaller file size
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};
