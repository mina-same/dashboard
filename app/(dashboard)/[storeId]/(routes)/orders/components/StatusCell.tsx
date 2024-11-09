// File: StatusCell.tsx

'use client';

import { useEffect, useState } from 'react';

type StatusCellProps = {
  initialStatus: string;
  storeId: string;
  orderId: string;
};

export const StatusCell: React.FC<StatusCellProps> = ({
  initialStatus,
  storeId,
  orderId,
}) => {
  const [status, setStatus] = useState(initialStatus);

  const handleStatusUpdate = async (updatedStatus: string) => {

    console.log("order ID", orderId)
    console.log("store ID", storeId)

    const url = `/api/${storeId}/orders/${orderId}`;
    const payload = { status: updatedStatus }; // Adjust if the API expects something else
  
    console.log('Payload:', payload); // Log payload to verify
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const updatedOrder = await response.json();
        setStatus(updatedOrder.status);
      } else {
        console.error('Failed to update status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  return (
    <select
      value={status}
      onChange={(e) => handleStatusUpdate(e.target.value)}
      style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
    >
      <option value="ORDERED">Ordered</option>
      <option value="PROCESSING">Processing</option>
      <option value="DONE">Done</option>
    </select>
  );
};
