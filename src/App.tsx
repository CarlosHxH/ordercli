import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
	Package2,
	Truck,
	CheckCircle2,
	XCircle,
	QrCode,
	Shield,
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from './lib/supabase';
import type { Order } from './types/Order';
import Modal from './Modal';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import SearchBar from './components/SearchBar'

function App() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
	const [loading, setLoading] = useState(true);
	const [selectedQR, setSelectedQR] = useState<string | null>(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [showAdminLogin, setShowAdminLogin] = useState(false);

	useEffect(() => {
		fetchOrders();
		checkSession();
	}, []);

	async function checkSession() {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		setIsAdmin(!!session);
	}

	async function fetchOrders() {
		try {
			const { data, error } = await supabase
				.from('orders')
				.select('*')
				.order('created_at', { ascending: false });

			if (error) throw error;
			setOrders(data || []);
			setFilteredOrders(data || []);
		} catch (error) {
			toast.error('Erro ao buscar pedidos');
		} finally {
			setLoading(false);
		}
	}

	async function toggleArrival(id: string, currentStatus: boolean) {
		try {
			const { error } = await supabase
				.from('orders')
				.update({ chegou_na_base: !currentStatus })
				.eq('id', id);

			if (error) throw error;

			toast.success('Status do pedido atualizado');
			fetchOrders();
		} catch (error) {
			toast.error('Erro ao atualizar pedido');
		}
	}

	const prev = (data: string) => {
		const d = new Date(data);
		const tz = d.toLocaleString('pt-BR', { timeZone: 'America/Cuiaba' });
		const dayIndex = d.getDay();
		const diasDaSemana = [
			'domingo',
			'segunda-feira',
			'terça-feira',
			'quarta-feira',
			'quinta-feira',
			'sexta-feira',
			'sábado',
		];
		const nomeDoDia = diasDaSemana[dayIndex];
		return `${d.toLocaleDateString('pt-BR')} - ${nomeDoDia}.`;
	};

	if (showAdminLogin) {
		return (
			<AdminLogin
				onLogin={() => {
					setIsAdmin(true);
					setShowAdminLogin(false);
				}}
			/>
		);
	}

	if (isAdmin) {
		return (
			<AdminPanel
				orders={orders}
				onLogout={() => {
					setIsAdmin(false);
					setShowAdminLogin(false);
				}}
				onOrdersUpdate={fetchOrders}
			/>
		);
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		);
	}
  
  const Footer = () => {
    return (
      <footer className="flex justify-center items-center p-4 bg-gray-200">
        <a target="_blank" rel="noopener" href="http://www.linkedin.com/in/carloshxh">
          <p className="text-center text-gray-700">© {new Date().getFullYear()} Carlos Dias. Todos os direitos reservados.</p>
        </a>
      </footer> );
    };

	return (
		<div className="min-h-screen bg-gray-50">
			<Toaster position="top-right" />

			{/* Header */}
			<header className="bg-white shadow sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center">
						<div className="flex items-center">
							<Truck className="h-8 w-8 text-indigo-600 mr-3" />
							<h1 className="text-3xl font-bold text-gray-900">QRcode</h1>
						</div>
						<div className="flex flex-row gap-2">
							<button
								onClick={() => setShowAdminLogin(true)}
								className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
							>
								<Shield className="h-5 w-5" />
							</button>
              {/*<Modal orders={orders} onFilter={setFilteredOrders} />*/}
						</div>
					</div>
				</div>
        <SearchBar onSearch={(e)=>{
            const data = orders.filter((order) =>
    				  order.ordercli.toLowerCase().includes(e.toLowerCase())
    			  );
          setFilteredOrders(data)
        }} />
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{selectedQR && (
					<div
						className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
						onClick={() => setSelectedQR(null)}
					>
						<div
							className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-4"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-start mb-4">
								<h3 className="text-lg font-semibold">QR Code do Pedido</h3>
								<button
									onClick={() => setSelectedQR(null)}
									className="text-gray-500 hover:text-gray-700"
								>
									<XCircle className="h-6 w-6" />
								</button>
							</div>
							<div className="flex flex-col items-center">
								<QRCodeSVG
									value={selectedQR}
									size={200}
									level="H"
									includeMargin
								/>
								<p className="mt-4 text-sm text-gray-600">{selectedQR}</p>
							</div>
						</div>
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredOrders.map((order) => (
						<div
							key={order.id}
							className="bg-white rounded-lg shadow overflow-hidden"
						>
							<div className="grid grid-flow-col grid-rows-1 gap-1">
								<div className="row-span-2 cursor-pointer" onClick={() => setSelectedQR(order.ordercli)}>
									<QRCodeSVG
										value={order.ordercli}
										size={100}
										level="H"
										includeMargin
									/>
								</div>
								<div className="col-span-10">
									<div className="flex justify-between items-start">
										<div>
											<h3 className="text-lg font-semibold text-gray-900">
												{order.ordercli}
											</h3>
											<p className="text-sm text-gray-500">{order.cliente}</p>
										</div>
										<div className="flex gap-2">
											<button
												onClick={() => setSelectedQR(order.ordercli)}
												className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200"
												title="Mostrar QR Code"
											>
												<QrCode className="h-6 w-6 text-indigo-600" />
											</button>
											<button
												onClick={() =>
													toggleArrival(order.id, order.chegou_na_base)
												}
												className={`p-2 rounded-full ${
													order.chegou_na_base ? 'bg-green-100' : 'bg-gray-100'
												}`}
											>
												{order.chegou_na_base ? (
													<CheckCircle2 className="h-6 w-6 text-green-600" />
												) : (
													<XCircle className="h-6 w-6 text-gray-400" />
												)}
											</button>
										</div>
									</div>
									<div className="mt-4 space-y-2">
										<div className="flex items-center text-sm">
											<Truck className="h-5 w-5 text-gray-400 mr-2" />
											<span>Previsto: {prev(order.previsao_chegada)}</span>
										</div>
										<div className="flex items-center text-sm">
											<Package2 className="h-5 w-5 text-gray-400 mr-2" />
											<span>
												{order.qtde_pedidos} pedidos / {order.qtde_volumes}{' '}
												volumes
											</span>
										</div>
									</div>
								</div>
							</div>
							<div
								onClick={() => toggleArrival(order.id, order.chegou_na_base)}
								className={`px-6 py-2 cursor-pointer ${
									order.chegou_na_base ? 'bg-green-50' : 'bg-gray-50'
								}`}
							>
								<p className="text-sm">
									{order.chegou_na_base ? 'Chegou na base' : 'Ainda não chegou'}
								</p>
							</div>
						</div>
					))}
				</div>
			</main>
      <Footer/>
		</div>
	);
}

export default App;
