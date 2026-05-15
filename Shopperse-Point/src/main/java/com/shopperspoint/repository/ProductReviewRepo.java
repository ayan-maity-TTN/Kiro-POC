package com.shopperspoint.repository;

import com.shopperspoint.entity.ProductReview;
import com.shopperspoint.key.ProductReviewKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductReviewRepo extends JpaRepository<ProductReview, ProductReviewKey> {

    List<ProductReview> findByProductId(Long productId);

    Optional<ProductReview> findByIdCustomerUserIdAndIdProductId(Long customerId, Long productId);

    @Query("select pr from ProductReview pr where pr.customer.id = :customerId")
    List<ProductReview> findByCustomerId(@Param("customerId") Long customerId);
}
