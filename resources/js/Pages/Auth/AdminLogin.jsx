import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function AdminLogin() {
    // đăng nhập bằng username vs pass
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '', 
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        // Gọi đến đường dẫn xử lý đăng nhập
        post('/admin/login');
    };

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-slate-900">
            <Head title="Admin Portal" />

            <div className="w-full sm:max-w-md mt-6 px-6 py-10 bg-slate-800 shadow-2xl overflow-hidden sm:rounded-lg border border-slate-700">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-orange-500">QUẢN TRỊ VIÊN</h2>
                    <p className="text-slate-400 mt-2 text-sm">Cổng đăng nhập hệ thống nội bộ</p>
                </div>

                <form onSubmit={submit}>
                    <div>
                        <label className="block font-medium text-sm text-slate-300">Tên đăng nhập (Username)</label>
                        <input
                            type="text" 
                            className="mt-1 block w-full bg-slate-700 border-slate-600 text-white rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            value={data.username} // Binding vào data.username
                            onChange={(e) => setData('username', e.target.value)}
                            autoFocus
                        />
                        {/* 3. Hiển thị lỗi của username */}
                        <span className="text-red-500 text-sm mt-1">{errors.username}</span>
                    </div>

                    <div className="mt-4">
                        <label className="block font-medium text-sm text-slate-300">Mật khẩu</label>
                        <input
                            type="password"
                            className="mt-1 block w-full bg-slate-700 border-slate-600 text-white rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <span className="text-red-500 text-sm mt-1">{errors.password}</span>
                    </div>

                    <div className="flex items-center justify-end mt-8">
                        <button 
                            className="ml-4 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded transition duration-200" 
                            disabled={processing}
                        >
                            {processing ? 'Đang xử lý...' : 'Đăng Nhập'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}