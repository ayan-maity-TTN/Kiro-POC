package com.shopperspoint.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderProductDTO {
    private Long orderProductId;
    private Long variationId;
    private String productName;
    private String brand;
    private Integer quantity;
    private Double price;
    private String imageUrl;
    private String currentStatus;
}
