"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, CalendarDays, Wallet, Clock, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalVehicles: 0,
        totalBookings: 0,
        pendingBookings: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const { data: v } = await supabase.from('vehicles').select('id');
        const { data: b } = await supabase.from('bookings').select('status, total_price');

        const totalRevenue = b?.reduce((acc, curr) => acc + (curr.status === 'confirmed' ? Number(curr.total_price) : 0), 0) || 0;

        setStats({
            totalVehicles: v?.length || 0,
            totalBookings: b?.length || 0,
            pendingBookings: b?.filter(x => x.status === 'pending').length || 0,
            totalRevenue
        });
    };

    const cards = [
        { title: 'Total Vehicles', value: stats.totalVehicles, icon: <Car className="text-amber-500" />, color: 'bg-amber-50' },
        { title: 'Total Bookings', value: stats.totalBookings, icon: <CalendarDays className="text-blue-500" />, color: 'bg-blue-50' },
        { title: 'Pending Actions', value: stats.pendingBookings, icon: <Clock className="text-rose-500" />, color: 'bg-rose-50' },
        { title: 'Confirmed Revenue', value: `${stats.totalRevenue.toFixed(2)} CHF`, icon: <Wallet className="text-green-500" />, color: 'bg-green-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Overview</h1>
                <p className="text-slate-500 font-medium">Welcome back! Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <Card key={i} className="rounded-3xl border-none shadow-xl hover:shadow-2xl transition-all duration-300 group">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start">
                                <div className={cn("p-4 rounded-2xl", card.color)}>
                                    {card.icon}
                                </div>
                                <div className="bg-slate-50 px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-black uppercase text-slate-400">
                                    <TrendingUp size={10} /> +2.5%
                                </div>
                            </div>
                            <div className="mt-6 space-y-1">
                                <div className="text-3xl font-black text-slate-900">{card.value}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.title}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions removed */}
                {/* Business Health section removed */}
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
