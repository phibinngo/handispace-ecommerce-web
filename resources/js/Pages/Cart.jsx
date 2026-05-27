import React, { useState } from 'react';
import { useCart } from '@/Contexts/CartContext';
import { Link, router, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import axios from 'axios';
import Swal from 'sweetalert2';


export default function Cart() {
    const { cart, removeFromCart, updateQuantity, totalAmount } = useCart();
    const { auth } = usePage().props;
    const [processing, setProcessing] = useState(false);
    

    const formatPrice = (price) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);

    const handleChangeQty = (id, delta) => {
        updateQuantity(id, delta);
    };

    const handleCheckout = async () => {
        if (!auth?.user) {
            Swal.fire(
                'Vui lòng đăng nhập',
                'Bạn cần đăng nhập để thanh toán.',
                'info'
            );
            return;
        }

        setProcessing(true);
        try {
            await axios.post('/cart/sync', { cart });
            router.visit('/checkout');
        } catch (error) {
            console.error(error);
            Swal.fire(
                'Lỗi',
                'Có lỗi xảy ra khi đồng bộ giỏ hàng.',
                'error'
            );
            setProcessing(false);
        }
    };

    return (
        <UserLayout title="Giỏ hàng - HandiSpace">
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-4xl mx-auto px-4">
                    {cart.length === 0 ? (
                        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-dashed border-gray-300">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                                Giỏ hàng trống.
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Bạn chưa chọn món đồ handmade nào.
                            </p>
                            <Link
                                href="/shop"
                                className="inline-block bg-orange-600 text-white px-6 py-2 text-sm rounded-full font-bold hover:bg-orange-700 transition shadow-lg"
                            >
                                Quay lại mua sắm
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-black text-gray-900 mb-6 uppercase">
                                Giỏ hàng của bạn
                            </h1>

                            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col sm:flex-row items-center justify-between p-5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition"
                                    >
                                        {/* Ảnh & Tên */}
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-md border"
                                            />
                                            <div>
                                                <h3 className="font-bold text-base text-gray-800">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {formatPrice(item.price)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Điều khiển */}
                                        <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-6">
                                            {/* TĂNG / GIẢM */}
                                            <div className="flex items-center gap-1 bg-gray-100 rounded p-1 border">
                                                <button
                                                    onClick={() =>
                                                        handleChangeQty(
                                                            item.id,
                                                            -1
                                                        )
                                                    }
                                                    className="w-7 h-7 flex items-center justify-center bg-white rounded shadow font-bold"
                                                >
                                                    -
                                                </button>

                                                <span className="w-8 text-center font-bold text-gray-800">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        handleChangeQty(
                                                            item.id,
                                                            1
                                                        )
                                                    }
                                                    className="w-7 h-7 flex items-center justify-center bg-white rounded shadow font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Thành tiền */}
                                            <div className="text-right min-w-[100px]">
                                                <p className="font-bold text-indigo-600">
                                                    {formatPrice(
                                                        item.price *
                                                            item.quantity
                                                    )}
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        removeFromCart(item.id)
                                                    }
                                                    className="text-red-400 text-xs hover:text-red-600"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Tổng tiền */}
                                <div className="p-6 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 border-t">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600">
                                            Tổng cộng:
                                        </span>
                                        <span className="text-2xl font-black">
                                            {formatPrice(totalAmount)}
                                        </span>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        disabled={processing}
                                        className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition disabled:opacity-70"
                                    >
                                        {processing
                                            ? 'Đang xử lý...'
                                            : 'Thanh Toán Ngay'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
