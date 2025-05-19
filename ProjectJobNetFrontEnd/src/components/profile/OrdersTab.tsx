import React from 'react';

type Order = {
  id: string;
  serviceId: string;
  authorId: string;
  customerId: string;
  status: string;
  createdAt: string;
  message?: string;
};

type OrdersTabProps = {
  orders: Order[];
  loading: boolean;
  actionStatus: string | null;
  onOrderAction: (orderId: string, action: 'accept' | 'refuse') => void;
  onConfirmOrder: (orderId: string, role: 'author' | 'customer') => void;
};

const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  loading,
  actionStatus,
  onOrderAction,
  onConfirmOrder
}) => {
  return (
    <div className="orders-tab">
      <h3>Orders</h3>
      
      {actionStatus && (
        <div className="action-status">{actionStatus}</div>
      )}
      
      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <p className="no-orders">You don't have any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h4>Order #{order.id.substring(0, 8)}...</h4>
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="order-details">
                <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
                {order.message && (
                  <p className="order-message">{order.message}</p>
                )}
              </div>
              
              <div className="order-actions">
                {order.status === 'Pending' && (
                  <>
                    <button 
                      onClick={() => onOrderAction(order.id, 'accept')}
                      className="accept-btn"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => onOrderAction(order.id, 'refuse')}
                      className="refuse-btn"
                    >
                      Refuse
                    </button>
                  </>
                )}
                
                {(order.status === 'Accepted' || order.status === 'InProgress') && (
                  <button 
                    onClick={() => onConfirmOrder(order.id, 'author')}
                    className="confirm-btn"
                  >
                    Mark as Complete
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

export default OrdersTab;
