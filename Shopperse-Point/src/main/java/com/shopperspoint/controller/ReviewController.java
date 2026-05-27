package com.shopperspoint.controller;

import com.shopperspoint.dto.GenericResponse;
import com.shopperspoint.dto.ProductReviewRequestDTO;
import com.shopperspoint.dto.ProductReviewResponseDTO;
import com.shopperspoint.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/account")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/review")
    public ResponseEntity<GenericResponse> addReview(@Valid @RequestBody ProductReviewRequestDTO dto,
                                                     HttpServletRequest request) {
        return reviewService.addReview(dto, request);
    }

    @PutMapping("/review")
    public ResponseEntity<GenericResponse> updateReview(@Valid @RequestBody ProductReviewRequestDTO dto,
                                                        HttpServletRequest request) {
        return reviewService.updateReview(dto, request);
    }

    @DeleteMapping("/review")
    public ResponseEntity<GenericResponse> deleteReview(@RequestParam(value = "productId") Long productId,
                                                        HttpServletRequest request) {
        return reviewService.deleteReview(productId, request);
    }

    @GetMapping("/review")
    public List<ProductReviewResponseDTO> getProductReviews(@RequestParam(value = "productId") Long productId) {
        return reviewService.getProductReviews(productId);
    }
}
