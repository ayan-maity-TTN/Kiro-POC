package com.shopperspoint.repository;

import com.shopperspoint.entity.OrderProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderProductRepo extends JpaRepository<OrderProduct, Long> {

    List<OrderProduct> findByOrdersId(Long orderId);

    @Query("""
            select op from OrderProduct op
            join op.productVariation pv
            join pv.product p
            where p.seller.id = :sellerId
            """)
    List<OrderProduct> findBySellerIdOrderProducts(@Param("sellerId") Long sellerId);
}
