package com.shopperspoint.controller;

import com.shopperspoint.dto.GenericResponse;
import com.shopperspoint.dto.OrderResponseDTO;
import com.shopperspoint.dto.OrderStatusUpdateDTO;
import com.shopperspoint.dto.PlaceOrderRequestDTO;
import com.shopperspoint.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ── Customer Endpoints (/api/account) ─────────────────────────────────────

    @PostMapping("/api/account/orders")
    public ResponseEntity<GenericResponse> placeOrder(@Valid @RequestBody PlaceOrderRequestDTO dto,
                                                      HttpServletRequest request) {
        return orderService.placeOrder(dto, request);
    }

    @GetMapping("/api/account/orders")
    public List<OrderResponseDTO> getMyOrders(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            HttpServletRequest request) {
        return orderService.getCustomerOrders(page, size, request);
    }

    @GetMapping("/api/account/orders/{id}")
    public OrderResponseDTO getOrderDetail(@PathVariable(value = "id") Long id, HttpServletRequest request) {
        return orderService.getOrderDetail(id, request);
    }

    @PatchMapping("/api/account/orders/{id}/cancel")
    public ResponseEntity<GenericResponse> cancelOrderItem(@PathVariable(value = "id") Long id,
                                                           HttpServletRequest request) {
        return orderService.cancelOrderItem(id, request);
    }

    @PatchMapping("/api/account/orders/{id}/return")
    public ResponseEntity<GenericResponse> returnOrderItem(@PathVariable(value = "id") Long id,
                                                           HttpServletRequest request) {
        return orderService.returnOrderItem(id, request);
    }

    // ── Seller Endpoints (/api/vendor) ────────────────────────────────────────

    @GetMapping("/api/vendor/orders")
    public List<OrderResponseDTO> getSellerOrders(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            HttpServletRequest request) {
        return orderService.getSellerOrders(page, size, request);
    }

    @PatchMapping("/api/vendor/orders/status")
    public ResponseEntity<GenericResponse> updateOrderStatus(@Valid @RequestBody OrderStatusUpdateDTO dto,
                                                             HttpServletRequest request) {
        return orderService.updateOrderStatus(dto, request);
    }

    // ── Admin Endpoints (/api/management) ────────────────────────────────────

    @GetMapping("/api/management/orders")
    public List<OrderResponseDTO> getAllOrders(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "dateCreated") String sort,
            @RequestParam(value = "order", defaultValue = "desc") String order,
            @RequestParam(value = "filter", required = false) String filter) {
        return orderService.getAllOrders(page, size, sort, order, filter);
    }

    @PatchMapping("/api/management/orders/status")
    public ResponseEntity<GenericResponse> adminUpdateOrderStatus(@Valid @RequestBody OrderStatusUpdateDTO dto) {
        return orderService.adminUpdateOrderStatus(dto);
    }
}
