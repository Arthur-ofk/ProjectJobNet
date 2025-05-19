import React, { useRef } from 'react';
import { API_BASE_URL } from '../../constants.ts';

type Resume = {
  id: string;
  userId: string;
  content: string;
  fileContent?: string;
  fileName?: string;
  contentType?: string;
  createdAt: string;
  updatedAt: string;
};

type ResumesTabProps = {
  resumes: Resume[];
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
  canUploadResume: boolean;
  onDeleteResume: (id: string) => void;
  onUploadResume: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ResumesTab: React.FC<ResumesTabProps> = ({
  resumes,
  user,
  token,
  loading,
  error,
  canUploadResume,
  onDeleteResume,
  onUploadResume
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="resumes-tab">
      <h3>My Resumes</h3>
      {error && <div className="error-message">{error}</div>}
      
      <div className="resumes-container">
        {resumes.map(resume => (
          <div key={resume.id} className="resume-item">
            <div className="resume-info">
              <h4>{resume.fileName || 'Resume'}</h4>
              <p>{new Date(resume.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="resume-actions">
              <a 
                href={`${API_BASE_URL}/resumes/${resume.id}/download`}
                download={resume.fileName || 'resume'}
                className="download-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
              <button 
                onClick={() => onDeleteResume(resume.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {resumes.length === 0 && !loading && (
          <div className="no-resumes">
            You haven't uploaded any resumes yet.
          </div>
        )}
      </div>

      {canUploadResume && (
        <div className="upload-section">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="upload-btn"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Resume'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onUploadResume}
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx"
          />
          <p className="upload-note">
            You can upload up to 3 resumes in PDF or Word format.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumesTab;
