import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store.ts';
import { 
  fetchOrganizationRequest,
  uploadOrganizationPictureRequest
} from '../slices/organizationSlice.ts';
import { API_BASE_URL } from '../constants.ts';
import './OrganizationDetail.css';

// Import new components
import TabsContainer, { TabItem } from '../components/common/TabsContainer.tsx';
import OrganizationHeader from '../components/organization/OrganizationHeader.tsx';
import OrganizationInfoTab from '../components/organization/OrganizationInfoTab.tsx';
import OrganizationJobsTab from '../components/organization/OrganizationJobsTab.tsx';
import OrganizationServicesTab from '../components/organization/OrganizationServicesTab.tsx';
import OrganizationForm from '../components/organization/OrganizationForm.tsx';
import OrganizationMembers from '../components/organization/OrganizationMembers.tsx';
import OrganizationServicesSection from '../components/organization/OrganizationServicesSection.tsx';

// Correct import for Service type
import { Service } from '../components/organization/OrganizationServicesSection';

// Ensure userId is part of Organization type
interface Organization {
  id: string;
  name: string;
  userId: string; // Added userId property
  // ...other properties...
}

// Ensure services are properly typed in OrganizationServicesSectionProps
interface OrganizationServicesSectionProps {
  services: Service[]; // Ensure services is properly defined
  canEdit: boolean;
  isTabView?: boolean;
}

function OrganizationDetail() {
  const { id } = useParams<{id:string}>();
  const dispatch = useDispatch();
  const { currentOrganization: organization, loading, error } = 
    useSelector((state: RootState) => state.organization);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'members' | 'jobs' | 'services'>('info');
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrganizationRequest(id));
    }
  }, [id, dispatch]);

  // Check if user can edit this organization
  useEffect(() => {
    if (user && organization) {
      // Add userId to Organization type
      const organizationWithUserId = { ...organization, userId: organization.userId || '' };
      // Check if user is a member of this organization
      fetch(`${API_BASE_URL}/Organization/${organizationWithUserId.id}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(members => {
          const isUserMember = members.some((member: any) => member.userId === user.id);
          setCanEdit(isUserMember);
          setMembers(members);
        })
        .catch(err => {
          console.error("Failed to check organization membership:", err);
          setCanEdit(false);
        });
    }
  }, [user, organization, token]);

  // Load jobs and services when on those tabs
  useEffect(() => {
    if (!organization) return;
    
    if (activeTab === 'jobs') {
      fetch(`${API_BASE_URL}/jobs/organization/${organization.id}`)
        .then(res => res.json())
        .then(setJobs)
        .catch(err => {
          console.error("Failed to fetch jobs:", err);
          setJobs([]);
        });
    }
    
    if (activeTab === 'services') {
      fetch(`${API_BASE_URL}/services/organization/${organization.id}`)
        .then(res => res.json())
        .then(setServices)
        .catch(err => {
          console.error("Failed to fetch services:", err);
          setServices([]);
        });
    }
  }, [activeTab, organization]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !organization) return;
    
    dispatch(uploadOrganizationPictureRequest({ id: organization.id, file }));
  };

  // Handle removing the organization logo
  const handleRemovePhoto = () => {
    if (!organization) return;
    
    if (window.confirm('Are you sure you want to remove the organization logo?')) {
      dispatch(uploadOrganizationPictureRequest({ 
        id: organization.id, 
        file: new File([""], "empty.txt") // Empty file to remove logo
      }));
    }
  };

  const handleSubmitOrgUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Organization update logic would go here
    setIsEditing(false);
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;
  if (!organization) return <div className="not-found-container">Organization not found</div>;

  // Create tabs configuration
  const tabs: TabItem[] = [
    {
      id: 'info',
      label: 'Organization Info',
      component: <OrganizationInfoTab organization={organization} />
    },
    {
      id: 'members',
      label: 'Members',
      component: <OrganizationMembers orgId={organization.id} token={token} isOwner={user?.id === organization.userId} />
    },
    {
      id: 'jobs',
      label: 'Jobs',
      component: <OrganizationJobsTab jobs={jobs} canEdit={canEdit} />
    },
    {
      id: 'services',
      label: 'Services',
      component: <OrganizationServicesSection 
        services={services} 
        canEdit={canEdit} 
        isTabView={true}  // Use the tab view mode
      />
    }
  ];

  return (
    <div className="organization-container">
      <OrganizationHeader 
        organization={organization}
        isEditing={isEditing}
        canEdit={canEdit}
        handleFileChange={handleFileChange}
        handleRemovePhoto={handleRemovePhoto}
        setIsEditing={setIsEditing}
      />
      
      <TabsContainer 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as any)}
      />
      
      {isEditing && (
        <div className="organization-edit-form">
          <OrganizationForm 
            organization={organization}
            onSubmit={handleSubmitOrgUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  );
}

export default OrganizationDetail;
