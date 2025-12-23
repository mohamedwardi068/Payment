import React from 'react';

interface StatusBadgeProps {
    status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'created':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'refunded':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default StatusBadge;
