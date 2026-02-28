import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { ArrowRight, Star, Shield, Clock, MapPin, Car, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import VehicleCard from '@/components/VehicleCard';

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations('Index');

    const { data: dbVehicles } = await supabase
        .from('vehicles')
        .select('*')
        .eq('is_available', true);

    const defaultVehicles = [
        {
            id: '1',
            name: 'Mercedes S-Class',
            description: 'The pinnacle of luxury and comfort for your Swiss journeys.',
            price_per_hour: 120,
            image_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2070&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2070&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop'
            ],
            features: ['Premium Audio', 'AC', 'Automatic'],
            is_available: true
        },
        {
            id: '2',
            name: 'BMW 7 Series',
            description: 'Dynamic performance combined with executive-level luxury.',
            price_per_hour: 110,
            image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?q=80&w=2070&auto=format&fit=crop'
            ],
            features: ['GPS Navigation', 'AC', 'Automatic'],
            is_available: true
        },
        {
            id: '3',
            name: 'Audi A8',
            description: 'Advanced technology and sophisticated design for every occasion.',
            price_per_hour: 105,
            image_url: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1974&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1974&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop'
            ],
            features: ['Premium Audio', 'GPS Navigation', 'Automatic'],
            is_available: true
        }
    ];

    const vehicles = dbVehicles && dbVehicles.length > 0 ? dbVehicles : defaultVehicles;

    return (
        <main className="relative overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center pt-20 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* Multi-layered overlay for better contrast and depth */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
                        alt="Premium Rental Car"
                        className="w-full h-full object-cover scale-105"
                    />
                </div>

                <div className="relative z-20 max-w-7xl mx-auto w-full text-center lg:text-left lg:px-12 space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
                    <div className="inline-flex items-center gap-2 bg-amber-500/90 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 text-slate-900 text-xs font-black uppercase tracking-[0.2em] sm:mx-0 lg:ml-8 lg:mt-2">
                        <Star className="w-3.5 h-3.5 fill-slate-900" />
                        <span>Swiss Premium Service</span>
                    </div>

                    <h1 className="text-6xl md:text-[clamp(4rem,10vw,10rem)] font-extrabold text-white tracking-tighter leading-[0.85] drop-shadow-2xl">
                        OPTIM<br /><span className="text-amber-500">RENTAL</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/80 font-medium max-w-xl leading-relaxed">
                        Experience precision and luxury. {t('hero.subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
                        <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-amber-500 hover:text-white rounded-full px-10 py-8 text-lg font-black transition-all hover:scale-105 active:scale-95 shadow-2xl">
                            <Link href="/book" className="flex items-center gap-2 uppercase tracking-widest">
                                {t('hero.cta')} <ArrowRight className="w-5 h-5" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" className="bg-slate-900/20 backdrop-blur-md text-white border-white/30 hover:bg-white/10 rounded-full px-10 py-8 text-lg font-bold transition-all uppercase tracking-widest text-center">
                            <Link href="#services">Our Services</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Company Details Section */}
            <section className="py-24 px-6 bg-white" id="intro">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-black tracking-tighter text-slate-900 leading-tight">
                                Carrental & Shuttle <br />
                                <span className="text-amber-500">Service for every journey</span>
                            </h2>
                            <div className="h-2 w-20 bg-amber-500 rounded-full" />
                        </div>
                        <p className="text-xl text-slate-600 leading-relaxed font-medium">
                            {t('intro')}
                        </p>
                        <div className="grid grid-cols-2 gap-8 pt-4">
                            <div className="space-y-3 p-6 bg-slate-50 rounded-3xl transition-transform hover:-translate-y-1">
                                <Shield className="text-amber-600 w-10 h-10" />
                                <h4 className="font-bold text-lg">Safe & Reliable</h4>
                                <p className="text-sm text-slate-500">Fully insured premium fleet for your Swiss travel.</p>
                            </div>
                            <div className="space-y-3 p-6 bg-slate-50 rounded-3xl transition-transform hover:-translate-y-1">
                                <Clock className="text-amber-600 w-10 h-10" />
                                <h4 className="font-bold text-lg">24/7 Excellence</h4>
                                <p className="text-sm text-slate-500">Luxury booking available anytime, anywhere.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-6 bg-slate-950 rounded-[3rem] rotate-3" />
                        <img
                            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
                            alt="Luxury Car"
                            className="relative w-full rounded-[2.5rem] shadow-2xl object-cover aspect-[4/5]"
                        />
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-24 px-6 bg-slate-50" id="services">
                <div className="max-w-7xl mx-auto text-center space-y-4 mb-20">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">{t('services').split(' ')[0]}</h2>
                    <div className="h-1.5 w-24 bg-amber-500 mx-auto rounded-full" />
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg pt-4">{t('services')}</p>
                </div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
                    {[
                        { title: "Standard Rental", price: "45 CHF/h", desc: "Reliable and high-quality vehicles for daily use.", icon: <Car className="w-8 h-8" /> },
                        { title: "Airport Shuttle", price: "80 CHF/h", desc: "Punctual and comfortable transport to all Swiss airports.", icon: <MapPin className="w-8 h-8" /> },
                        { title: "Premium Chauffeur", price: "120 CHF/h", desc: "First-class chauffeur service for your business meetings.", icon: <Shield className="w-8 h-8" /> }
                    ].map((service, i) => (
                        <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-3xl transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 group-hover:bg-amber-100 transition-colors" />
                            <div className="bg-slate-900 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 text-white shadow-xl group-hover:scale-110 transition-transform relative z-10">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-black mb-4 relative z-10">{service.title}</h3>
                            <p className="text-slate-500 mb-8 font-medium leading-relaxed relative z-10">{service.desc}</p>
                            <div className="flex items-baseline gap-2 relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Starting from</span>
                                <div className="text-3xl font-black text-slate-900">{service.price}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Vehicles Showcase Section */}
            <section className="py-24 px-6 bg-white" id="vehicles">
                <div className="max-w-7xl mx-auto text-center space-y-4 mb-20">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">{t('vehicles')}</h2>
                    <div className="h-1.5 w-24 bg-amber-500 mx-auto rounded-full" />
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg pt-4">Select from our premium fleet of meticulously maintained vehicles.</p>
                </div>

                {/**
                 * Layout behavior:
                 * - 1 vehicle: center it
                 * - 2 vehicles: center the two items on larger screens
                 * - 3+ vehicles: use the original 2/3 column grid
                 * We keep the card size stable by wrapping each card with a max width.
                 */}
                <div className={(() => {
                    if (!vehicles) return 'max-w-7xl mx-auto grid gap-10';
                    if (vehicles.length === 1) return 'max-w-7xl mx-auto grid grid-cols-1 justify-items-center gap-10';
                    if (vehicles.length === 2) return 'max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 justify-items-center gap-10';
                    return 'max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10';
                })()}>
                    {vehicles?.map((vehicle) => (
                        <div key={vehicle.id} className="w-full max-w-[380px]">
                            <VehicleCard vehicle={vehicle} />
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/book" className="inline-flex items-center gap-2 text-slate-900 font-black uppercase tracking-[0.2em] text-sm group">
                        View Complete Fleet <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="pt-24 pb-12 px-6 bg-slate-950 text-white" id="contact">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
                    <div className="col-span-2 space-y-8">
                        <Link href="/" className="flex items-center gap-3">
                            <img src="/optimrental-logo.png" alt="Optimrental Logo" className="h-16 md:h-24 w-auto object-contain" />
                        </Link>
                        <p className="text-slate-400 max-w-sm text-lg leading-relaxed font-medium">
                            Premium vehicle rentals and professional shuttle services across Switzerland. Quality you can trust, service you can depend on.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-[0.2em] text-xs text-amber-500">Contact Details</h4>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-500 mb-1 tracking-widest">Email Us</p>
                                <p className="text-white font-bold text-lg hover:text-amber-500 cursor-pointer transition-colors">info@optimrental.ch</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-500 mb-1 tracking-widest">Call Us</p>
                                <p className="text-white font-bold text-lg hover:text-amber-500 cursor-pointer transition-colors">+44791226646</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-[0.2em] text-xs text-amber-500">Our Network</h4>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-500 mb-1 tracking-widest">Coverage</p>
                                <p className="text-white font-bold opacity-80 leading-loose">
                                    Zürich • Basel • Geneva • Bern • Lugano • St. Moritz
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            © {new Date().getFullYear()} Optimrental Switzerland. All rights reserved.
                        </div>
                        <div className="hidden md:block w-1 h-1 bg-slate-700 rounded-full" />
                        <a
                            href="https://www.habb.uk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-600 text-[10px] font-black uppercase tracking-widest hover:text-amber-500 transition-colors"
                        >
                            Developed by HABB
                        </a>
                    </div>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-amber-500 transition-colors">Impressum</a>
                    </div>
                </div>
            </footer>
        </main>
    );
}
