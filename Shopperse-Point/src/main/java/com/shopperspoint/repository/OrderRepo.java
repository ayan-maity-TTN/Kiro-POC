package com.shopperspoint.repository;

import com.shopperspoint.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Long> {

    Page<Order> findByCustomerId(Long customerId, Pageable pageable);

    @Query("select o from Order o where o.customer.id = :customerId order by o.dateCreated desc")
    List<Order> findByCustomerIdOrderByDateCreatedDesc(@Param("customerId") Long customerId);

    @Query("""
            select o from Order o
            where (:query is null or
                   lower(o.customerAddressCity) like lower(concat('%', :query, '%')) or
                   str(o.id) like concat('%', :query, '%'))
            """)
    Page<Order> findAllWithFilter(@Param("query") String query, Pageable pageable);

    @Query("""
            select o from Order o
            join o.orderProducts op
            join op.productVariation pv
            join pv.product p
            where p.seller.id = :sellerId
            """)
    Page<Order> findOrdersBySellerId(@Param("sellerId") Long sellerId, Pageable pageable);
}
