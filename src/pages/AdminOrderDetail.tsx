import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, RefreshCcw, Package, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
    productId: {
        _id: string;
        name: string;
        image: string;
    };
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    total: number;
    status: string;
    paymentDetails: {
        cardLast4: string;
        cardHolder: string;
    };
    paymentIntentId?: string;
    createdAt: string;
    refundedAt?: string;
}

const AdminOrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [refunding, setRefunding] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrder = async () => {
        try {
            const response = await api.get(`/admin/orders/${id}`);
            setOrder(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch order details');
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleRefund = async () => {
        if (!order) return;

        setRefunding(true);
        try {
            await api.patch(`/admin/orders/${id}/status`, { status: 'refunded' });
            toast.success('Order refunded successfully');
            await fetchOrder(); // Refresh data
        } catch (err: any) {
            toast.error(err.message || 'Refund failed');
        } finally {
            setRefunding(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container mx-auto py-8">
                <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200 mb-4">
                    Error: {error || 'Order not found'}
                </div>
                <Button onClick={() => navigate('/admin/orders')} variant="outline" className="text-sm text-white hover:text-gray-400 flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2 text-white" />
                    Back to Orders
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
                <Link to="/admin/orders" className="text-sm text-white hover:text-gray-400 flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1 text-white" />
                    Back to Orders
                </Link>
                <div className="flex gap-2">
                    {order.status === 'paid' && (
                        <Button
                            variant="destructive"
                            onClick={handleRefund}
                            disabled={refunding}
                            className="flex items-center"
                        >
                            {refunding ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
                            Refund Order
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 shadow-sm border rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Order #{order._id.slice(-8)}</h1>
                                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                            <StatusBadge status={order.status} />
                        </div>

                        <div className="border-t pt-4">
                            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                                <Package className="h-4 w-4 mr-2" />
                                Items
                            </h2>
                            <ul className="divide-y">
                                {order.items.map((item, index) => (
                                    <li key={index} className="py-3 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">
                                            ${(item.quantity * item.price).toFixed(2)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t mt-4 pt-4 flex justify-between items-center">
                                <span className="text-base font-bold text-gray-900">Total</span>
                                <span className="text-xl font-bold text-primary">${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 shadow-sm border rounded-lg">
                        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Payment Details
                        </h2>
                        <div className="space-y-3 text-sm ">
                            <div>
                                <p className="text-gray-500">Card Holder</p>
                                <p className="font-medium text-black">{order.paymentDetails.cardHolder}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Card Number</p>
                                <p className="font-medium text-black">**** **** **** {order.paymentDetails.cardLast4}</p>
                            </div>
                            {order.paymentIntentId && (
                                <div>
                                    <p className="text-gray-500">Transaction ID</p>
                                    <p className="font-mono text-xs break-all text-gray-700 bg-gray-50 p-2 rounded mt-1">
                                        {order.paymentIntentId}
                                    </p>
                                </div>
                            )}
                            {order.status === 'refunded' && order.refundedAt && (
                                <div className="pt-2 border-t mt-2">
                                    <p className="text-orange-600 font-semibold italic">Refunded on {new Date(order.refundedAt).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetail;
