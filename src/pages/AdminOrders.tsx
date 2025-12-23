import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Loader2, Eye } from 'lucide-react';

interface Order {
    _id: string;
    total: number;
    status: string;
    createdAt: string;
}

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/admin/orders');
                setOrders(response.data);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Admin Orders</h1>
                <Link to="/">
                    <Button variant="outline">Back to Shop</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white p-6 shadow-sm border rounded-xl hover:shadow-md transition-shadow flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    #{order._id.slice(-8)}
                                </span>
                                <StatusBadge status={order.status} />
                            </div>

                            <div className="mb-4">
                                <p className="text-2xl font-bold text-gray-900">
                                    ${order.total.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <Link to={`/admin/orders/${order._id}`} className="w-full">
                            <Button variant="outline" className="w-full flex items-center justify-center gap-2 group">
                                View Details
                                <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                ))}
                {orders.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed">
                        No orders found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
