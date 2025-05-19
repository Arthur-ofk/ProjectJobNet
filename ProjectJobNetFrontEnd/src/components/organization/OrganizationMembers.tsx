import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../constants.ts';
import { Link } from 'react-router-dom';
import SafeImage from '../SafeImage.tsx';

type Member = {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  joinedAt: string;
  user?: {
    id: string;
    userName: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
};

type OrganizationMembersProps = {
  orgId: string;
  token: string | null;
  isOwner?: boolean;
};

const OrganizationMembers: React.FC<OrganizationMembersProps> = ({ orgId, token, isOwner = false }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!orgId || !token) return;

    setLoading(true);
    setError(null);

    // Fetch organization members with user details
    fetch(`${API_BASE_URL}/organization/${orgId}/members`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch members: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // If we get an array of member IDs, fetch the details for each
        if (Array.isArray(data) && data.length > 0) {
          // If the members don't include user details, fetch them
          if (!data[0].user) {
            const memberPromises = data.map(async (member: any) => {
              try {
                const userRes = await fetch(`${API_BASE_URL}/users/${member.userId}`);
                if (!userRes.ok) return member;
                const user = await userRes.json();
                return { ...member, user };
              } catch (err) {
                console.error(`Failed to fetch user data for ${member.userId}:`, err);
                return member;
              }
            });
            
            return Promise.all(memberPromises);
          }
          return data;
        }
        return [];
      })
      .then(membersWithDetails => {
        setMembers(membersWithDetails);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading organization members:", err);
        setError(err.message || "Failed to load members");
        setMembers([]);
        setLoading(false);
      });
  }, [orgId, token]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newMemberEmail.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/organization/${orgId}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: newMemberEmail, role: 'Member' })
      });

      if (!res.ok) {
        throw new Error(`Failed to add member: ${res.status}`);
      }

      // Refresh members list
      const updatedMembersRes = await fetch(`${API_BASE_URL}/organization/${orgId}/members`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!updatedMembersRes.ok) {
        throw new Error('Failed to refresh members list');
      }
      
      const updatedMembers = await updatedMembersRes.json();
      setMembers(updatedMembers);
      setNewMemberEmail('');
      setShowAddForm(false);
    } catch (err: any) {
      setError(err.message || "Failed to add member");
    }
  };

  if (loading) return <div className="loading">Loading members...</div>;

  return (
    <div className="org-members-section">
      <div className="section-header">
        <h3>Organization Members</h3>
        
        {isOwner && (
          <button 
            className="btn btn--primary action-button"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add New Member'}
          </button>
        )}
      </div>
      
      {showAddForm && (
        <form onSubmit={handleAddMember} className="add-member-form">
          <div className="form-input-group">
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="Enter member's email"
              className="member-email-input"
              required
            />
            <button type="submit" className="btn btn--primary submit-button">Add Member</button>
          </div>
        </form>
      )}
      
      {error && <div className="error-message">{error}</div>}
      
      {members.length === 0 ? (
        <p className="empty-state">No members found for this organization.</p>
      ) : (
        <div className="member-list">
          {members.map(member => (
            <div key={member.id} className="member-card">
              <div className="member-avatar">
                <img
                  src={`https://i.pravatar.cc/48?u=${member.userId}`}
                  alt={member.user?.userName || 'Member'}
                  onError={(e) => { e.currentTarget.src = "/default-avatar.png" }}
                />
              </div>
              <div className="member-info">
                <Link to={`/users/${member.userId}`} className="member-name">
                  {member.user?.userName || 'User'}
                </Link>
                <div className="member-details">
                  <span className="member-role">{member.role || 'Member'}</span>
                  <span className="member-joined">
                    Joined: {new Date(member.joinedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {isOwner && member.role !== 'Owner' && (
                <div className="member-actions">
                  <button 
                    className="btn btn--danger remove-member-btn"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to remove ${member.user?.userName || 'this member'}?`)) {
                        fetch(`${API_BASE_URL}/organization/${orgId}/members/${member.userId}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}` }
                        }).then(res => {
                          if (res.ok) {
                            setMembers(members.filter(m => m.id !== member.id));
                          } else {
                            alert('Failed to remove member');
                          }
                        });
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationMembers;
