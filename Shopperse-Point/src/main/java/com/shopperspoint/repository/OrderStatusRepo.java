package com.shopperspoint.repository;

import com.shopperspoint.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderStatusRepo extends JpaRepository<OrderStatus, Long> {

    List<OrderStatus> findByOrderProductIdOrderByTransitionDateDesc(Long orderProductId);

    Optional<OrderStatus> findTopByOrderProductIdOrderByTransitionDateDesc(Long orderProductId);
}
