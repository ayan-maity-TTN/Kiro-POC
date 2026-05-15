package com.shopperspoint.dto;

import com.shopperspoint.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderStatusUpdateDTO {

    @NotNull(message = "Order product id is required")
    private Long orderProductId;

    @NotNull(message = "New status is required")
    private OrderStatus newStatus;

    private String notes;
}
