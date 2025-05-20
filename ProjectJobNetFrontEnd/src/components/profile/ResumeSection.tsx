import React, { useState, useRef } from 'react';
import './ResumeSection.css';
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

type ResumeSectionProps = {
  resumes: Resume[];
  token: string;
  userId: string;
  setResumes: (resumes: Resume[]) => void;
};

const ResumeSection: React.FC<ResumeSectionProps> = ({
  resumes,
  token,
  userId,
  setResumes
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canUploadResume = resumes.length < 3;

  // Delete resume by id
  const handleDeleteResume = async (resumeId: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/resumes/${resumeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) throw new Error('Failed to delete resume');
      
      // Refresh resumes after delete
      const refreshRes = await fetch(`${API_BASE_URL}/resumes/byUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!refreshRes.ok) throw new Error('Failed to refresh resumes');
      
      const data = await refreshRes.json();
      setResumes(Array.isArray(data) ? data : [data]);
      setError(null);
    } catch (err: any) {
      setError('Delete failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Upload Resume (as file)
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const toBase64 = (file: File): Promise<string> =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });

      const base64Content = await toBase64(file);
      // Remove the data:*/*;base64, prefix
      const base64Data = base64Content.substring(base64Content.indexOf(',') + 1);

      const res = await fetch(`${API_BASE_URL}/resumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          content: '',
          fileContent: base64Data,
          fileName: file.name,
          contentType: file.type
        })
      });

      if (!res.ok) throw new Error('Upload failed: ' + res.statusText);
      
      // Refresh resumes after upload
      const refreshRes = await fetch(`${API_BASE_URL}/resumes/byUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });
      
      if (!refreshRes.ok) throw new Error('Failed to refresh resumes');
      
      const data = await refreshRes.json();
      setResumes(Array.isArray(data) ? data : [data]);
      setError(null);
    } catch (err: any) {
      setError('Upload failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resumes-section">
      <div className="section-header">
        <h3>Your Resumes</h3>
        {canUploadResume && (
          <button 
            className="action-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            Upload Resume
          </button>
        )}
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".pdf,.doc,.docx" 
          style={{ display: 'none' }} 
          onChange={handleResumeUpload}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading">Loading...</div>}

      {resumes.length === 0 ? (
        <p className="empty-state">You haven't uploaded any resumes yet.</p>
      ) : (
        <div className="resumes-list">
          {resumes.map(resume => (
            <div key={resume.id} className="resume-item">
              <div className="resume-info">
                <h4 title={resume.fileName || "Resume"}>{resume.fileName || "Resume"}</h4>
                <p>Uploaded: {new Date(resume.createdAt).toLocaleDateString()}</p>
                {resume.contentType && (
                  <p className="file-type">{resume.contentType}</p>
                )}
              </div>
              <div className="resume-actions">
                <a 
                  href={`${API_BASE_URL}/resumes/download/${resume.id}`}
                  className="view-btn"
                  onClick={(e) => {
                    // Prevent default action
                    e.preventDefault();
                    
                    // Create and open in a new window with auth header
                    const newWindow = window.open('', '_blank');
                    if (newWindow) {
                      // Fetch the file with authorization
                      fetch(`${API_BASE_URL}/resumes/download/${resume.id}`, {
                        headers: { 
                          'Authorization': `Bearer ${token}` 
                        }
                      })
                      .then(response => response.blob())
                      .then(blob => {
                        // Create object URL and navigate to it
                        const url = URL.createObjectURL(blob);
                        newWindow.location.href = url;
                      })
                      .catch(err => {
                        console.error("Error downloading resume:", err);
                        newWindow.close();
                        alert("Error downloading resume. Please try again.");
                      });
                    }
                  }}
                >
                  View
                </a>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteResume(resume.id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="resume-limit-note">
        <p>You can upload up to 3 resumes.</p>
      </div>
    </div>
  );
};

export default ResumeSection;
