import React from 'react';
import { Link } from 'react-router-dom';

type NotificationTabProps = {
  notifications: any[];
};

const NotificationsTab: React.FC<NotificationTabProps> = ({ notifications }) => {
  return (
    <div className="notifications-tab">
      <h3>Notifications</h3>
      
      {notifications.length === 0 ? (
        <p className="no-notifications">You don't have any notifications.</p>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div key={notification.id} className="notification-item">
              <div className="notification-content">
                {notification.type === 'order' && (
                  <p>
                    New order status: <span className="highlight">{notification.status}</span>
                    {notification.serviceId && (
                      <Link to={`/services/${notification.serviceId}`} className="notification-link">
                        View Service
                      </Link>
                    )}
                  </p>
                )}
                
                {notification.type === 'message' && (
                  <p>
                    New message from {notification.fromUserName}:
                    <span className="notification-message">{notification.content}</span>
                  </p>
                )}
                
                <span className="notification-time">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsTab;
