import React, { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const CartContext = createContext();

export function CartProvider({ children }) {
    // Khởi tạo state từ LocalStorage
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('shopping-cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Tự động lưu vào LocalStorage mỗi khi cart thay đổi
    useEffect(() => {
        localStorage.setItem('shopping-cart', JSON.stringify(cart));
    }, [cart]);

    // --- 1. HÀM THÊM VÀO GIỎ ---
    const addToCart = (product) => {
        setCart((prevCart) => {
            // Kiểm tra sản phẩm đã có trong giỏ chưa
            const existingItem = prevCart.find((item) => item.id === product.id);
            
            // Số lượng hiện tại trong giỏ (nếu chưa có thì là 0)
            const currentQtyInCart = existingItem ? existingItem.quantity : 0;
            const maxStock = product.max_stock; 

            // Tính tổng số lượng dự kiến sau khi thêm
            const totalQtyAfterAdd = currentQtyInCart + product.quantity;

            // CHECK KHO: Nếu tổng > tồn kho -> Báo lỗi & Không thêm
            if (totalQtyAfterAdd > maxStock) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Đã đạt giới hạn kho!',
                    text: `Sản phẩm này chỉ còn ${maxStock} món. Trong giỏ bạn đã có ${currentQtyInCart} món.`,
                    confirmButtonColor: '#ea580c'
                });
                return prevCart;
            }

            // Nếu hợp lệ:
            if (existingItem) {
                // Cập nhật số lượng
                const updatedCart = prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + product.quantity }
                        : item
                );
                // alert thêm thành công
                Swal.fire({
                    icon: 'success',
                    title: 'Đã thêm vào giỏ!',
                    toast: true, position: 'top-end', showConfirmButton: false, timer: 800
                });
                
                return updatedCart;
            } else {
                // Thêm mới
                Swal.fire({
                    icon: 'success',
                    title: 'Đã thêm vào giỏ!',
                    toast: true, position: 'top-end', showConfirmButton: false, timer: 1500
                });
                return [...prevCart, product];
            }
        });
    };

    // --- 2. HÀM CẬP NHẬT SỐ LƯỢNG ---
    const updateQuantity = (productId, amount) => {
        setCart((prevCart) => {
            return prevCart.map((item) => {
                if (item.id === productId) {
                    const newQuantity = item.quantity + amount;
                    const maxStock = item.max_stock; 

                    // a. Không cho giảm dưới 1
                    if (newQuantity < 1) return item;

                    // b. CHECK KHO: Không cho tăng quá tồn kho
                    if (newQuantity > maxStock) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Hết hàng!',
                            text: `Kho chỉ còn ${maxStock} sản phẩm. Không thể tăng thêm.`,
                            toast: true, position: 'center', timer: 1000, showConfirmButton: false
                        });
                        return { ...item, quantity: maxStock }; 
                    }

                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
        });
    };

    // --- 3. HÀM XÓA SẢN PHẨM ---
    const removeFromCart = (productId) => {
        Swal.fire({
            title: 'Xóa sản phẩm này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy bỏ',
            confirmButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
                Swal.fire({ icon: 'success', title: 'Đã xóa!', toast: true, position: 'top-end', showConfirmButton: false, timer: 1000 });
            }
        });
    };

    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);