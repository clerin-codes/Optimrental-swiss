"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Vehicle } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Image as ImageIcon, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Loader2, Car as CarIcon, Settings2 } from 'lucide-react';

const AVAILABLE_FEATURES = [
    'Premium Audio',
    'GPS Navigation',
    'AC',
    'Automatic'
];

export default function AdminVehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Partial<Vehicle> | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
        if (error) toast.error(error.message);
        else setVehicles(data || []);
        setLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newUrls: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append('image', files[i]);

                const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (data.success) {
                    newUrls.push(data.data.url);
                }
            }

            if (newUrls.length > 0) {
                setUploadedImages([...uploadedImages, ...newUrls]);
                toast.success(`Successfully uploaded ${newUrls.length} image(s)`);
            }
        } catch (error) {
            toast.error('Error uploading images');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const vehicleData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            price_per_hour: Number(formData.get('price')),
            image_url: uploadedImages[0] || '', // First image as thumbnail
            images: uploadedImages,
            is_available: formData.get('is_available') === 'on',
            features: selectedFeatures,
        };

        let error;
        if (editingVehicle?.id) {
            const { error: err } = await supabase.from('vehicles').update(vehicleData).eq('id', editingVehicle.id);
            error = err;
        } else {
            const { error: err } = await supabase.from('vehicles').insert([vehicleData]);
            error = err;
        }

        if (error) toast.error(error.message);
        else {
            toast.success('Vehicle saved successfully');
            setIsDialogOpen(false);
            setEditingVehicle(null);
            fetchVehicles();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this vehicle?')) return;
        const { error } = await supabase.from('vehicles').delete().eq('id', id);
        if (error) toast.error(error.message);
        else {
            toast.success('Vehicle deleted');
            fetchVehicles();
        }
    };

    const toggleAvailability = async (vehicle: Vehicle) => {
        const { error } = await supabase
            .from('vehicles')
            .update({ is_available: !vehicle.is_available })
            .eq('id', vehicle.id);

        if (error) toast.error(error.message);
        else fetchVehicles();
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Vehicles</h1>
                    <p className="text-slate-500">Manage your fleet and availability</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        setEditingVehicle(null);
                        setUploadedImages([]);
                        setSelectedFeatures([]);
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-amber-500 hover:bg-amber-600 rounded-xl gap-2 shadow-lg shadow-amber-500/20 px-6 h-12 text-black font-bold">
                            <Plus size={20} /> Add Vehicle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl max-w-lg p-0 border-none overflow-hidden sm:rounded-3xl">
                        <div className="bg-slate-900 p-8 text-white">
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight">
                                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                            </DialogTitle>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-6 bg-white">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 col-span-2">
                                    <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-500">Vehicle Name</Label>
                                    <Input name="name" defaultValue={editingVehicle?.name} required className="h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-500">Description</Label>
                                    <Input name="description" defaultValue={editingVehicle?.description} className="h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-500">Price (CHF/h)</Label>
                                    <Input name="price" type="number" step="0.01" defaultValue={editingVehicle?.price_per_hour} required className="h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-500">Vehicle Images</Label>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageUpload}
                                                className="h-12 rounded-xl flex-1 pt-2.5"
                                            />
                                            {isUploading && <Loader2 className="w-6 h-6 animate-spin text-amber-500" />}
                                        </div>

                                        {uploadedImages.length > 0 && (
                                            <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl">
                                                {uploadedImages.map((img, idx) => (
                                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                                                        <img src={img} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))}
                                                            className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4 col-span-2 bg-slate-50 p-6 rounded-2xl">
                                    <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-500 flex items-center gap-2">
                                        <Settings2 size={14} /> Features
                                    </Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {AVAILABLE_FEATURES.map((feature) => (
                                            <div key={feature} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id={`feature-${feature}`}
                                                    checked={!!(selectedFeatures.includes(feature) || (editingVehicle?.features?.includes(feature) && !selectedFeatures.length))}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedFeatures([...selectedFeatures, feature]);
                                                        else setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
                                                    }}
                                                    className="w-4 h-4 rounded accent-amber-500"
                                                />
                                                <Label htmlFor={`feature-${feature}`} className="text-sm cursor-pointer">{feature}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2 col-span-2">
                                    <input type="checkbox" name="is_available" id="is_available" defaultChecked={editingVehicle?.is_available ?? true} className="w-5 h-5 rounded accent-amber-500" />
                                    <Label htmlFor="is_available" className="font-bold">Available for Booking</Label>
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-12 bg-slate-900 rounded-xl font-bold">Save Vehicle</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-white">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="uppercase text-[10px] font-bold tracking-widest p-6">Vehicle</TableHead>
                            <TableHead className="uppercase text-[10px] font-bold tracking-widest">Pricing</TableHead>
                            <TableHead className="uppercase text-[10px] font-bold tracking-widest text-center">Status</TableHead>
                            <TableHead className="uppercase text-[10px] font-bold tracking-widest text-right p-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={4} className="text-center p-12 text-slate-400">Loading vehicles...</TableCell></TableRow>
                        ) : vehicles.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center p-12 text-slate-400">No vehicles found. Add your first car!</TableCell></TableRow>
                        ) : vehicles.map((v) => (
                            <TableRow key={v.id} className="hover:bg-slate-50 group">
                                <TableCell className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {v.image_url ? <img src={v.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="w-full h-full p-3 text-slate-300" />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{v.name}</div>
                                            <div className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">{v.description}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="font-black text-slate-700">{v.price_per_hour} CHF</span>
                                    <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">/ HR</span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <button
                                        onClick={() => toggleAvailability(v)}
                                        className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all",
                                            v.is_available ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"
                                        )}
                                    >
                                        {v.is_available ? 'Available' : 'Unavailable'}
                                    </button>
                                </TableCell>
                                <TableCell className="text-right p-6">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="outline" size="icon" className="rounded-xl border-slate-200" onClick={() => {
                                            setEditingVehicle(v);
                                            setUploadedImages(v.images || []);
                                            setSelectedFeatures(v.features || []);
                                            setIsDialogOpen(true);
                                        }}>
                                            <Edit size={16} />
                                        </Button>
                                        <Button variant="outline" size="icon" className="rounded-xl border-slate-200 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(v.id)}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
