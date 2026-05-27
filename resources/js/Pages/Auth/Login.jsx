import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import Swal from 'sweetalert2';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Đăng nhập thất bại',
                    text: 'Vui lòng kiểm tra lại thông tin đăng nhập.',
                    confirmButtonColor: '#ea580c'
                });
            }
        });
    };

    return (
        <UserLayout title="Đăng nhập - HandiSpace">
            <div className="flex justify-center items-center py-16 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                    
                    {/* Header Form */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Đăng Nhập</h2>
                        <p className="text-gray-500 text-sm mt-2">Chào mừng bạn trở lại với HandiSpace</p>
                    </div>

                    {status && <div className="mb-4 font-medium text-sm text-green-600 text-center">{status}</div>}

                    <form onSubmit={submit} className="space-y-5">
                        
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Tên đăng nhập</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                placeholder="Nhập username..."
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                autoFocus
                            />
                            {errors.username && <p className="text-red-500 text-xs mt-1 italic">{errors.username}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all pr-10"
                                    placeholder="Nhập mật khẩu..."
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-orange-600 transition"
                                >
                                    <i className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1 italic">{errors.password}</p>}
                        </div>

                        {/* Remember & Forgot Password
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-600 cursor-pointer hover:text-gray-800">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-orange-600 shadow-sm focus:ring-orange-500 mr-2 w-4 h-4"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span>Ghi nhớ đăng nhập</span>
                            </label>
                            {canResetPassword && (
                                <Link href={route('password.request')} className="text-orange-600 hover:underline font-medium">
                                    Quên mật khẩu?
                                </Link>
                            )}
                        </div> */}

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition duration-300 shadow-md active:scale-95 disabled:opacity-70"
                        >
                            {processing ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
                        </button>
                    </form>

                    {/* Footer Form */}
                    <div className="mt-8 text-center pt-6 border-t border-gray-100">
                        <p className="text-gray-600 text-sm">
                            Chưa có tài khoản?{' '}
                            <Link href={route('register')} className="text-blue-600 font-bold hover:underline hover:text-blue-800 transition">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}