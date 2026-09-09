package com.example.propertymanagement.service;

import com.example.propertymanagement.dto.InvoiceDto;
import java.util.List;
import java.util.UUID;

public interface InvoiceService {
    InvoiceDto createInvoice(InvoiceDto invoiceDto);
    List<InvoiceDto> getAllInvoices();
    InvoiceDto getInvoiceById(UUID id);
    InvoiceDto updateInvoice(UUID id, InvoiceDto invoiceDto);
    void deleteInvoice(UUID id);
}
