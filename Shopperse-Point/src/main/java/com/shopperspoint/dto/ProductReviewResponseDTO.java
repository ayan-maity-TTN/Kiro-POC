package com.shopperspoint.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductReviewResponseDTO {
    private Long customerId;
    private String customerName;
    private Long productId;
    private String review;
    private String rating;
}
