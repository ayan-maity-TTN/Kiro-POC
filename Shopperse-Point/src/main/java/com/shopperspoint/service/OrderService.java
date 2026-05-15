package com.shopperspoint.service;

import com.shopperspoint.dto.*;
import com.shopperspoint.entity.*;
import com.shopperspoint.exceptionhandler.AccessDeniedException;
import com.shopperspoint.exceptionhandler.BadRequestException;
import com.shopperspoint.exceptionhandler.ResouceNotFound;
import com.shopperspoint.repository.*;
import com.shopperspoint.utill.ImageUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class OrderService {

    private final OrderRepo orderRepo;
    private final OrderProductRepo orderProductRepo;
    private final OrderStatusRepo orderStatusRepo;
    private final CartRepo cartRepo;
    private final AddressRepo addressRepo;
    private final ProductVariationRepo productVariationRepo;
    private final CartService cartService;
    private final SellerService sellerService;

    @Autowired
    public OrderService(OrderRepo orderRepo, OrderProductRepo orderProductRepo,
                        OrderStatusRepo orderStatusRepo, CartRepo cartRepo,
                        AddressRepo addressRepo, ProductVariationRepo productVariationRepo,
                        CartService cartService, SellerService sellerService) {
        this.orderRepo = orderRepo;
        this.orderProductRepo = orderProductRepo;
        this.orderStatusRepo = orderStatusRepo;
        this.cartRepo = cartRepo;
        this.addressRepo = addressRepo;
        this.productVariationRepo = productVariationRepo;
        this.cartService = cartService;
        this.sellerService = sellerService;
    }

    @Value("${image.product.variation}")
    private String imageType;

    @Value("${success.message}")
    private String message;

    // ── Customer: Place Order ─────────────────────────────────────────────────

    @Transactional
    public ResponseEntity<GenericResponse> placeOrder(PlaceOrderRequestDTO dto, HttpServletRequest request) {
        Customer customer = cartService.getCustomer(request);

        List<Cart> cartItems = cartRepo.findCartItemsByCustomerId(customer.getId());
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty. Add items before placing an order.");
        }

        Address address = addressRepo.findById(dto.getAddressId())
                .orElseThrow(() -> new ResouceNotFound("Address not found"));

        if (!address.getUser().getId().equals(customer.getId())) {
            throw new AccessDeniedException("Address does not belong to this customer");
        }

        // Calculate total
        double total = cartItems.stream()
                .mapToDouble(c -> c.getProductVariation().getPrice() *
                        Integer.parseInt(c.getQuality() != null ? c.getQuality() : "1"))
                .sum();

        Order order = new Order();
        order.setCustomer(customer);
        order.setDateCreated(LocalDateTime.now());
        order.setAmountPaid(total);
        order.setPaymentMethod(dto.getPaymentMethod());
        order.setCustomerAddressAddressLine(address.getAddressLine());
        order.setCustomerAddressCity(address.getCity());
        order.setCustomerAddressState(address.getState());
        order.setCustomerAddressCountry(address.getCountry());
        order.setCustomerAddressZipCode(address.getZipCode());
        order.setCustomerAddressLabel(address.getLabel());

        order = orderRepo.save(order);

        List<OrderProduct> orderProducts = new ArrayList<>();
        for (Cart cartItem : cartItems) {
            ProductVariation variation = cartItem.getProductVariation();
            int qty = Integer.parseInt(cartItem.getQuality() != null ? cartItem.getQuality() : "1");

            if (variation.getQuantityAvailable() < qty) {
                throw new BadRequestException("Insufficient stock for: " + variation.getProduct().getName());
            }

            // Deduct stock
            variation.setQuantityAvailable(variation.getQuantityAvailable() - qty);
            productVariationRepo.save(variation);

            OrderProduct op = new OrderProduct();
            op.setOrders(order);
            op.setProductVariation(variation);
            op.setQuantity(qty);
            op.setPrice((double) variation.getPrice());
            op = orderProductRepo.save(op);

            // Initial status
            OrderStatus status = new OrderStatus();
            status.setOrderProduct(op);
            status.setFromStatus(null);
            status.setToStatus(com.shopperspoint.enums.OrderStatus.ORDER_PLACED);
            status.setTransitionDate(LocalDateTime.now());
            status.setTransitionNotesComments("Order placed successfully");
            orderStatusRepo.save(status);

            orderProducts.add(op);
        }

        // Clear cart
        cartRepo.deleteAll(cartItems);

        log.info("Order placed successfully. orderId: {}, customerId: {}", order.getId(), customer.getId());
        return ResponseEntity.status(HttpStatus.OK)
                .body(new GenericResponse("Order placed successfully with id: " + order.getId(), message, LocalDateTime.now()));
    }

    // ── Customer: Get Orders ──────────────────────────────────────────────────

    public List<OrderResponseDTO> getCustomerOrders(int page, int size, HttpServletRequest request) {
        Customer customer = cartService.getCustomer(request);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dateCreated"));
        Page<Order> orders = orderRepo.findByCustomerId(customer.getId(), pageable);
        return orders.stream().map(this::toOrderResponseDTO).toList();
    }

    // ── Customer: Get Order Detail ────────────────────────────────────────────

    public OrderResponseDTO getOrderDetail(Long orderId, HttpServletRequest request) {
        Customer customer = cartService.getCustomer(request);
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResouceNotFound("Order not found"));

        if (!order.getCustomer().getId().equals(customer.getId())) {
            throw new AccessDeniedException("You are not allowed to view this order");
        }

        return toOrderResponseDTO(order);
    }

    // ── Customer: Cancel Order Item ───────────────────────────────────────────

    @Transactional
    public ResponseEntity<GenericResponse> cancelOrderItem(Long orderProductId, HttpServletRequest request) {
        Customer customer = cartService.getCustomer(request);
        OrderProduct op = orderProductRepo.findById(orderProductId)
                .orElseThrow(() -> new ResouceNotFound("Order item not found"));

        if (!op.getOrders().getCustomer().getId().equals(customer.getId())) {
            throw new AccessDeniedException("You are not allowed to cancel this order item");
        }

        String currentStatus = getCurrentStatus(op);
        if (!currentStatus.equals("ORDER_PLACED") && !currentStatus.equals("ORDER_CONFIRMED")) {
            throw new BadRequestException("Order cannot be cancelled at this stage: " + currentStatus);
        }

        if (!Boolean.TRUE.equals(op.getProductVariation().getProduct().getIsCancellable())) {
            throw new BadRequestException("This product is not cancellable");
        }

        addStatusTransition(op, com.shopperspoint.enums.OrderStatus.valueOf(currentStatus),
                com.shopperspoint.enums.OrderStatus.CANCELLED, "Cancelled by customer");

        // Restore stock
        ProductVariation variation = op.getProductVariation();
        variation.setQuantityAvailable(variation.getQuantityAvailable() + op.getQuantity());
        productVariationRepo.save(variation);

        log.info("Order item {} cancelled by customer {}", orderProductId, customer.getId());
        return ResponseEntity.ok(new GenericResponse("Order item cancelled successfully", message, LocalDateTime.now()));
    }

    // ── Customer: Return Order Item ───────────────────────────────────────────

    @Transactional
    public ResponseEntity<GenericResponse> returnOrderItem(Long orderProductId, HttpServletRequest request) {
        Customer customer = cartService.getCustomer(request);
        OrderProduct op = orderProductRepo.findById(orderProductId)
                .orElseThrow(() -> new ResouceNotFound("Order item not found"));

        if (!op.getOrders().getCustomer().getId().equals(customer.getId())) {
            throw new AccessDeniedException("You are not allowed to return this order item");
        }

        String currentStatus = getCurrentStatus(op);
        if (!currentStatus.equals("DELIVERED")) {
            throw new BadRequestException("Only delivered items can be returned");
        }

        if (!Boolean.TRUE.equals(op.getProductVariation().getProduct().getIsReturnable())) {
            throw new BadRequestException("This product is not returnable");
        }

        addStatusTransition(op, com.shopperspoint.enums.OrderStatus.DELIVERED,
                com.shopperspoint.enums.OrderStatus.RETURN_REQUESTED, "Return requested by customer");

        log.info("Return requested for order item {} by customer {}", orderProductId, customer.getId());
        return ResponseEntity.ok(new GenericResponse("Return request submitted", message, LocalDateTime.now()));
    }

    // ── Seller: Get Orders ────────────────────────────────────────────────────

    public List<OrderResponseDTO> getSellerOrders(int page, int size, HttpServletRequest request) {
        Seller seller = sellerService.getLoggedinSeller(request);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dateCreated"));
        Page<Order> orders = orderRepo.findOrdersBySellerId(seller.getId(), pageable);
        return orders.stream().map(this::toOrderResponseDTO).toList();
    }

    // ── Seller: Update Order Status ───────────────────────────────────────────

    @Transactional
    public ResponseEntity<GenericResponse> updateOrderStatus(OrderStatusUpdateDTO dto, HttpServletRequest request) {
        Seller seller = sellerService.getLoggedinSeller(request);
        OrderProduct op = orderProductRepo.findById(dto.getOrderProductId())
                .orElseThrow(() -> new ResouceNotFound("Order item not found"));

        if (!op.getProductVariation().getProduct().getSeller().getId().equals(seller.getId())) {
            throw new AccessDeniedException("You are not allowed to update this order item");
        }

        String currentStatus = getCurrentStatus(op);
        com.shopperspoint.enums.OrderStatus from = com.shopperspoint.enums.OrderStatus.valueOf(currentStatus);

        addStatusTransition(op, from, dto.getNewStatus(), dto.getNotes());

        // If return approved, restore stock
        if (dto.getNewStatus() == com.shopperspoint.enums.OrderStatus.RETURN_APPROVED) {
            ProductVariation variation = op.getProductVariation();
            variation.setQuantityAvailable(variation.getQuantityAvailable() + op.getQuantity());
            productVariationRepo.save(variation);
        }

        log.info("Order item {} status updated to {} by seller {}", dto.getOrderProductId(), dto.getNewStatus(), seller.getId());
        return ResponseEntity.ok(new GenericResponse("Order status updated to " + dto.getNewStatus(), message, LocalDateTime.now()));
    }

    // ── Admin: Get All Orders ─────────────────────────────────────────────────

    public List<OrderResponseDTO> getAllOrders(int page, int size, String sort, String order, String filter) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(order), sort));
        Page<Order> orders;
        if (filter != null && !filter.isBlank()) {
            orders = orderRepo.findAllWithFilter(filter, pageable);
        } else {
            orders = orderRepo.findAll(pageable);
        }
        return orders.stream().map(this::toOrderResponseDTO).toList();
    }

    // ── Admin: Update Order Status ────────────────────────────────────────────

    @Transactional
    public ResponseEntity<GenericResponse> adminUpdateOrderStatus(OrderStatusUpdateDTO dto) {
        OrderProduct op = orderProductRepo.findById(dto.getOrderProductId())
                .orElseThrow(() -> new ResouceNotFound("Order item not found"));

        String currentStatus = getCurrentStatus(op);
        com.shopperspoint.enums.OrderStatus from = com.shopperspoint.enums.OrderStatus.valueOf(currentStatus);

        addStatusTransition(op, from, dto.getNewStatus(), dto.getNotes());

        if (dto.getNewStatus() == com.shopperspoint.enums.OrderStatus.RETURN_APPROVED ||
                dto.getNewStatus() == com.shopperspoint.enums.OrderStatus.REFUND_COMPLETED) {
            ProductVariation variation = op.getProductVariation();
            variation.setQuantityAvailable(variation.getQuantityAvailable() + op.getQuantity());
            productVariationRepo.save(variation);
        }

        log.info("Admin updated order item {} status to {}", dto.getOrderProductId(), dto.getNewStatus());
        return ResponseEntity.ok(new GenericResponse("Order status updated to " + dto.getNewStatus(), message, LocalDateTime.now()));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String getCurrentStatus(OrderProduct op) {
        Optional<OrderStatus> latest = orderStatusRepo.findTopByOrderProductIdOrderByTransitionDateDesc(op.getId());
        return latest.map(s -> s.getToStatus().name()).orElse("ORDER_PLACED");
    }

    private void addStatusTransition(OrderProduct op,
                                     com.shopperspoint.enums.OrderStatus from,
                                     com.shopperspoint.enums.OrderStatus to,
                                     String notes) {
        OrderStatus status = new OrderStatus();
        status.setOrderProduct(op);
        status.setFromStatus(from);
        status.setToStatus(to);
        status.setTransitionDate(LocalDateTime.now());
        status.setTransitionNotesComments(notes);
        orderStatusRepo.save(status);
    }

    private OrderResponseDTO toOrderResponseDTO(Order order) {
        List<OrderProduct> ops = orderProductRepo.findByOrdersId(order.getId());

        List<OrderProductDTO> opDTOs = ops.stream().map(op -> {
            String currentStatus = getCurrentStatus(op);
            String imageUrl = ImageUtils.getImage(op.getProductVariation().getId(), imageType);
            return new OrderProductDTO(
                    op.getId(),
                    op.getProductVariation().getId(),
                    op.getProductVariation().getProduct().getName(),
                    op.getProductVariation().getProduct().getBrand(),
                    op.getQuantity(),
                    op.getPrice(),
                    imageUrl,
                    currentStatus
            );
        }).toList();

        return new OrderResponseDTO(
                order.getId(),
                order.getDateCreated(),
                order.getAmountPaid(),
                order.getPaymentMethod(),
                order.getCustomerAddressAddressLine(),
                order.getCustomerAddressCity(),
                order.getCustomerAddressState(),
                order.getCustomerAddressCountry(),
                order.getCustomerAddressZipCode(),
                order.getCustomerAddressLabel(),
                opDTOs
        );
    }
}
