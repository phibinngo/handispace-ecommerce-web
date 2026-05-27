import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend
} from 'chart.js'; // thư viện vẽ biểu đồ
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend); 

export default function Dashboard({ stats }) {
    
    const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    const currentMonth = new Date().getMonth() + 1;

    const StatCard = ({ title, value, color, icon, subText }) => (
        <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${color} transition hover:shadow-md`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{title}</p>
                    <h3 className="text-2xl font-black text-gray-800 mt-1">{value}</h3>
                    {subText && <p className="text-xs text-gray-400 mt-1">{subText}</p>}
                </div>
                <div className="text-3xl opacity-80 p-2 bg-gray-50 rounded-lg">{icon}</div>
            </div>
        </div>
    );

    // 
    const revenueChartData = {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4'],
        datasets: [{
            label: 'Doanh thu (VNĐ)',
            data: stats.chart_revenue,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
            tension: 0.3,
            fill: true,
        }],
    };

    const salesChartData = {
        labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
        datasets: [{
            label: `Đơn hàng Tháng ${currentMonth}`,
            data: stats.chart_sales,
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderRadius: 5,
        }],
    };

    const orderStatusData = {
        labels: ['Hoàn thành', 'Đang xử lý', 'Hủy/Trả'],
        datasets: [{
            data: stats.chart_status,
            backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(234, 179, 8, 0.8)', 'rgba(239, 68, 68, 0.8)'],
            borderWidth: 0,
        }],
    };

    const topProductsData = {
        labels: stats.chart_top_names,
        datasets: [{
            label: 'Đã bán',
            data: stats.chart_top_data,
            backgroundColor: 'rgba(168, 85, 247, 0.8)',
            borderRadius: 4,
        }],
    };

    return (
        <AdminLayout title="Tổng Quan Hệ Thống">
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                {/* Dòng 1: Thống kê */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Tổng Doanh thu" value={formatMoney(stats.revenue)} color="border-green-500"   />
                    <StatCard title="Sản phẩm" value={stats.totalProducts} color="border-blue-500"  />
                    <StatCard title="Danh mục" value={stats.totalCategories} color="border-indigo-500"   />
                    <StatCard title="Khách hàng" value={stats.totalUsers} color="border-purple-500"   />
                </div>

                {/* Dòng 2: Cần xử lý */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard title="Đơn chờ xử lý" value={stats.pendingOrders} color="border-yellow-500" />
                    
                    <StatCard 
                        title="Yêu cầu trả hàng" 
                        value={stats.returnRequests} 
                        color="border-red-500" 
                    />
                </div>

                {/* Dòng 3: Biểu đồ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2"> Doanh thu Quý 1</h3>
                        <div className="h-64 flex items-center justify-center">
                            <Line data={revenueChartData} options={{ maintainAspectRatio: false, responsive: true }} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2"> Số lượng đơn  theo tháng (tháng     {currentMonth})</h3>
                        <div className="h-64 flex items-center justify-center">
                            <Bar data={salesChartData} options={{ maintainAspectRatio: false, responsive: true }} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2"> Tỷ lệ đơn hàng</h3>
                        <div className="h-64 flex items-center justify-center relative">
                            <div className="w-full max-w-[300px]">
                                <Doughnut data={orderStatusData} options={{ maintainAspectRatio: false, responsive: true }} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2"> Top 5 Sản phẩm bán chạy</h3>
                        <div className="h-64 flex items-center justify-center">
                            <Bar 
                                data={topProductsData} 
                                options={{ 
                                    indexAxis: 'y',
                                    maintainAspectRatio: false, 
                                    responsive: true 
                                }} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}