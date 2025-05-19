import React, { useState } from 'react';
import { API_BASE_URL } from '../../constants.ts';

type Order = {
  id: string;
  serviceId: string;
  authorId: string;
  customerId: string;
  status: string;
  createdAt: string;
  message?: string;
};

type OrdersSectionProps = {
  orders: Order[];
  token: string;
  userId: string;
  setOrders: (orders: Order[]) => void;
};

const OrdersSection: React.FC<OrdersSectionProps> = ({
  orders,
  token,
  userId,
  setOrders
}) => {
  const [orderActionStatus, setOrderActionStatus] = useState<string | null>(null);

  const handleOrderAction = async (orderId: string, action: 'accept' | 'refuse') => {
    if (!token) return;
    
    setOrderActionStatus(null);
    
    try {
      const res = await fetch(`${API_BASE_URL}/order/${orderId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error(`Failed to ${action} order`);
      
      setOrderActionStatus(`Order ${action}ed.`);
      
      // Refresh orders
      const refreshRes = await fetch(`${API_BASE_URL}/order/author/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!refreshRes.ok) throw new Error('Failed to refresh orders');
      
      const updatedOrders = await refreshRes.json();
      setOrders(updatedOrders);
    } catch (err: any) {
      setOrderActionStatus(`Failed to ${action} order: ${err.message}`);
    }
  };

  const handleConfirmOrder = async (orderId: string, role: 'author' | 'customer') => {
    if (!token) return;
    
    setOrderActionStatus(null);
    
    try {
      const res = await fetch(`${API_BASE_URL}/order/${orderId}/confirm`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(role)
      });
      
      if (!res.ok) throw new Error('Failed to confirm order');
      
      setOrderActionStatus('Order confirmed.');
      
      // Refresh orders
      const refreshRes = await fetch(`${API_BASE_URL}/order/author/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!refreshRes.ok) throw new Error('Failed to refresh orders');
      
      const updatedOrders = await refreshRes.json();
      setOrders(updatedOrders);
    } catch (err: any) {
      setOrderActionStatus(`Failed to confirm order: ${err.message}`);
    }
  };

  // Helper to get status color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f0ad4e';
      case 'accepted': return '#5cb85c';
      case 'refused': return '#d9534f';
      case 'completed': case 'finished': return '#5bc0de';
      default: return '#777';
    }
  };

  return (
    <div className="orders-section">
      <h3>Orders Management</h3>
      
      {orderActionStatus && (
        <div className="status-message">
          {orderActionStatus}
        </div>
      )}
      
      {orders.length === 0 ? (
        <p className="empty-state">You don't have any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span 
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="order-details">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Service ID:</strong> {order.serviceId}</p>
                <p><strong>Customer ID:</strong> {order.customerId}</p>
                {order.message && (
                  <p><strong>Message:</strong> {order.message}</p>
                )}
              </div>
              
              <div className="order-actions">
                {order.status.toLowerCase() === 'pending' && (
                  <>
                    <button
                      onClick={() => handleOrderAction(order.id, 'accept')}
                      className="accept-btn"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleOrderAction(order.id, 'refuse')}
                      className="refuse-btn"
                    >
                      Refuse
                    </button>
                  </>
                )}
                
                {order.status.toLowerCase() === 'accepted' && (
                  <button
                    onClick={() => handleConfirmOrder(order.id, 'author')}
                    className="confirm-btn"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersSection;
