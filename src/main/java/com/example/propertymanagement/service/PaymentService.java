package com.example.propertymanagement.service;

import com.example.propertymanagement.dto.PaymentDto;
import java.util.List;
import java.util.UUID;

public interface PaymentService {
    PaymentDto createPayment(PaymentDto paymentDto);
    List<PaymentDto> getAllPayments();
    PaymentDto getPaymentById(UUID id);
    PaymentDto updatePayment(UUID id, PaymentDto paymentDto);
    void deletePayment(UUID id);
}
