"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Vehicle } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Car, Mail, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { User, CreditCard, Globe, Phone } from 'lucide-react';

const NATIONALITIES = [
    'Switzerland', 'Germany', 'France', 'Italy', 'Austria', 'United Kingdom', 'USA', 'Canada', 'Other'
];

export default function BookingForm({ vehicles, locale }: { vehicles: Vehicle[], locale: string }) {
    const t = useTranslations('Booking');
    const router = useRouter();

    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [hours, setHours] = useState<number>(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [licence, setLicence] = useState('');
    const [nationality, setNationality] = useState('Switzerland');
    const [mobile, setMobile] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const totalPrice = selectedVehicle ? selectedVehicle.price_per_hour * hours : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVehicle || !date || !email) {
            toast.error("Please fill all fields");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vehicle_id: selectedVehicle.id,
                    customer_name: name,
                    customer_email: email,
                    licence_no: licence,
                    nationality: nationality,
                    mobile_no: mobile,
                    booking_date: format(date, 'yyyy-MM-dd'),
                    hours,
                    total_price: totalPrice,
                    vehicle_name: selectedVehicle.name
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
                toast.success(t('success'));
                setTimeout(() => router.push('/'), 5000);
            } else {
                toast.error(t('error'));
            }
        } catch (error) {
            toast.error(t('error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <Card className="border-none shadow-xl bg-white p-12 text-center space-y-6">
                <div className="flex justify-center">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold">{t('success')}</h2>
                <p className="text-slate-500">Redirecting you to the home page...</p>
                <Button variant="outline" onClick={() => router.push('/')}>Go Home Now</Button>
            </Card>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Vehicle Selection */}
            <div className={(() => {
                if (!vehicles) return 'grid gap-6';
                if (vehicles.length === 1) return 'grid grid-cols-1 justify-items-center gap-6';
                if (vehicles.length === 2) return 'grid grid-cols-1 md:grid-cols-2 justify-items-center gap-6';
                return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
            })()}>
                {vehicles.map((v) => (
                    <div key={v.id} className="w-full max-w-[380px]">
                        <div
                            onClick={() => setSelectedVehicle(v)}
                            className={cn(
                                "cursor-pointer transition-all duration-300 rounded-3xl overflow-hidden border-2",
                                selectedVehicle?.id === v.id ? "border-amber-500 ring-4 ring-amber-500/10" : "border-transparent bg-white shadow-md hover:shadow-xl"
                            )}
                        >
                            <div className="h-40 bg-slate-100 relative">
                                {v.image_url ? (
                                    <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">
                                        <Car className="w-12 h-12" />
                                    </div>
                                )}
                                {selectedVehicle?.id === v.id && (
                                    <div className="absolute top-2 right-2 bg-amber-500 text-white p-1 rounded-full shadow-lg">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                            <div className="p-4 space-y-2">
                                <h3 className="font-bold text-lg">{v.name}</h3>
                                <p className="text-xs text-slate-500 line-clamp-2">{v.description}</p>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-amber-600 font-black text-xl">{v.price_per_hour} <span className="text-sm">CHF / Std</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Booking Details */}
            <Card className="rounded-3xl border-none shadow-2xl bg-white overflow-hidden">
                <div className="bg-slate-900 px-8 py-6 text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Clock /> Booking Details</h2>
                    <div className="text-right">
                        <span className="text-slate-400 text-xs uppercase tracking-widest block">Total Amount</span>
                        <span className="text-3xl font-black">{totalPrice} CHF</span>
                    </div>
                </div>
                <CardContent className="p-8 space-y-10">
                    {/* Customer Info */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="space-y-2">
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-500">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-12 pl-10 rounded-xl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-500">Your Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 pl-10 rounded-xl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-500">License No</Label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="B1234567"
                                    value={licence}
                                    onChange={(e) => setLicence(e.target.value)}
                                    className="h-12 pl-10 rounded-xl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-500">Mobile No</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="+41 00 000 00 00"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    className="h-12 pl-10 rounded-xl"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Trip Details */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-500">Nationality</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                                <select
                                    value={nationality}
                                    onChange={(e) => setNationality(e.target.value)}
                                    className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                >
                                    {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-500">Pick Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-12 rounded-xl", !date && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-500">Duration (Hours)</Label>
                            <Input
                                type="number"
                                min="1"
                                max="24"
                                value={hours}
                                onChange={(e) => setHours(Number(e.target.value))}
                                className="h-12 rounded-xl"
                            />
                        </div>
                    </div>
                </CardContent>
                <div className="p-8 pt-0">
                    <Button
                        disabled={isSubmitting || !selectedVehicle}
                        className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white text-lg font-bold rounded-2xl shadow-lg transition-all hover:scale-[1.01]"
                    >
                        {isSubmitting ? "Processing..." : t('submit')}
                    </Button>
                </div>
            </Card>
        </form>
    );
}
