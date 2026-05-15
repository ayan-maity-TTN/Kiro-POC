package com.shopperspoint.repository;

import com.shopperspoint.entity.Cart;
import com.shopperspoint.key.CartKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartRepo extends JpaRepository<Cart, CartKey> {

    @Query("select c from Cart c where c.customer.id = :customerId and c.isWishListItem = false")
    List<Cart> findCartItemsByCustomerId(@Param("customerId") Long customerId);

    @Query("select c from Cart c where c.customer.id = :customerId and c.isWishListItem = true")
    List<Cart> findWishlistItemsByCustomerId(@Param("customerId") Long customerId);

    @Query("select c from Cart c where c.customer.id = :customerId and c.productVariation.id = :variationId")
    Optional<Cart> findByCustomerIdAndVariationId(@Param("customerId") Long customerId,
                                                   @Param("variationId") Long variationId);

    @Query("select c from Cart c where c.customer.id = :customerId")
    List<Cart> findAllByCustomerId(@Param("customerId") Long customerId);

    @Modifying
    @Query("delete from Cart c where c.customer.id = :customerId and c.isWishListItem = false")
    void deleteCartItemsByCustomerId(@Param("customerId") Long customerId);
}
