package com.shopperspoint.service;

import com.shopperspoint.dto.GenericResponse;
import com.shopperspoint.dto.ProductReviewRequestDTO;
import com.shopperspoint.dto.ProductReviewResponseDTO;
import com.shopperspoint.entity.Customer;
import com.shopperspoint.entity.Product;
import com.shopperspoint.entity.ProductReview;
import com.shopperspoint.exceptionhandler.BadRequestException;
import com.shopperspoint.exceptionhandler.ResouceNotFound;
import com.shopperspoint.key.ProductReviewKey;
import com.shopperspoint.repository.OrderProductRepo;
import com.shopperspoint.repository.ProductRepo;
import com.shopperspoint.repository.ProductReviewRepo;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class ReviewService {

    private final ProductReviewRepo reviewRepo;
    private final ProductRepo productRepo;
    private final CartService cartService;
    private final OrderProductRepo orderProductRepo;

    @Autowired
    public ReviewService(ProductReviewRepo reviewRepo, ProductRepo productRepo,
                         CartService cartService, OrderProductRepo orderProductRepo) {
        this.reviewRepo = reviewRepo;
        this.productRepo = productRepo;
        this.cartService = cartService;
        this.orderProductRepo = orderProductRepo;
    }

    @Value("${success.message}")
    private String message;

    @Transactional
    public ResponseEntity<GenericResponse> addReview(ProductReviewRequestDTO dto, HttpServletRequest request) {
        Customer customer = cartService.getCustomer(request);

        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new ResouceNotFound("Product not found"));

        // Check if customer has already reviewed this product
        Optional<ProductReview> existing = reviewRepo.findByIdCustomerUserIdAndIdProductId(
                customer.getId(), product.getId());

        if (existing.isPresent()) {
            throw new BadRequestException("You have already reviewed this product");
        }

        // Check if customer has purchased this product
        boolean hasPurchased = orderProductRepo.findBySellerIdOrderProducts(
                product.getSeller().getId()
        ).stream().anyMatch(op ->
                op.getProductVariation().getProduct().getId().equals(product.getId()) &&
                        op.getOrders().getCustomer().getId().equals(customer.getId())
        );

        if (!hasPurchased) {
            throw new BadRequestException("You can only review products you have purchased");
        }

        ProductReview review = new ProductReview();
        review.setId(new ProductReviewKey(customer.getId(), product.getId()));
        review.setCustomer(customer);
        review.setProduct(product);
        review.setReview(dto.getReview());
        review.setRating(String.valueOf(dto.getRating()));

        reviewRepo.save(review);
        log.info("Review added for product {} by customer {}", product.getId(), customer.getId());

        return ResponseEntity.status(HttpStatus.OK)
                .body(new GenericResponse("Review added successfully", message, LocalDateTime.now()));
    }

    @Transactional
    public ResponseEntity<GenericResponse> updateReview(ProductReviewRequestDTO dto, HttpServletRequest request) {
        Customer customer = cartService.getCustomer(request);

        ProductReview review = reviewRepo.findByIdCustomerUserIdAndIdProductId(
                customer.getId(), dto.getProductId())
                .orElseThrow(() -> new ResouceNotFound("Review not found"));

        if (dto.getReview() != null) review.setReview(dto.getReview());
        if (dto.getRating() != null) review.setRating(String.valueOf(dto.getRating()));

        reviewRepo.save(review);
        log.info("Review updated for product {} by customer {}", dto.getProductId(), customer.getId());

        return ResponseEntity.ok(new GenericResponse("Review updated successfully", message, LocalDateTime.now()));
    }

    @Transactional
    public ResponseEntity<GenericResponse> deleteReview(Long productId, HttpServletRequest request) {
        Customer customer = cartService.getCustomer(request);

        ProductReview review = reviewRepo.findByIdCustomerUserIdAndIdProductId(customer.getId(), productId)
                .orElseThrow(() -> new ResouceNotFound("Review not found"));

        reviewRepo.delete(review);
        log.info("Review deleted for product {} by customer {}", productId, customer.getId());

        return ResponseEntity.ok(new GenericResponse("Review deleted successfully", message, LocalDateTime.now()));
    }

    public List<ProductReviewResponseDTO> getProductReviews(Long productId) {
        productRepo.findById(productId).orElseThrow(() -> new ResouceNotFound("Product not found"));
        List<ProductReview> reviews = reviewRepo.findByProductId(productId);
        return reviews.stream().map(this::toDTO).toList();
    }

    private ProductReviewResponseDTO toDTO(ProductReview review) {
        String name = review.getCustomer().getFirstName() + " " + review.getCustomer().getLastName();
        return new ProductReviewResponseDTO(
                review.getCustomer().getId(),
                name,
                review.getProduct().getId(),
                review.getReview(),
                review.getRating()
        );
    }
}
