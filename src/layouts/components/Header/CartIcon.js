
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function CartIcon({ link }) {
    const [itemCount, setItemCount] = useState(0);  // Biến để lưu số lượng sách trong giỏ
    const userId = sessionStorage.getItem("userId");  // Lấy userId từ sessionStorage hoặc từ context nếu có

    useEffect(() => {
        if (userId) {
            // Gọi API để lấy số lượng sách trong giỏ hàng
            const fetchCartItemCount = async () => {
                try {
                    const response = await axios.get(`https://localhost:44315/api/Cart/GetCartItemCount/${userId}`);
                    setItemCount(response.data);  // Lưu số lượng sách vào state
                } catch (error) {
                    console.error("Lỗi khi lấy số sách trong giỏ:", error);
                }
            };

            fetchCartItemCount();
        }
    }, [userId]);

    return (
        <div className="cart-icon">
            <a href={link}>
                <FontAwesomeIcon icon={faShoppingCart} />
                {itemCount > 0 && <span className="cart-count">{itemCount}</span>}  {/* Hiển thị số lượng sách */}
            </a>
        </div>
    );
}

export default CartIcon;
