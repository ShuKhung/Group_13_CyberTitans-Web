package com.Se2.CyberWebApp.controller;

// 1. Sửa lại import đúng của Spring UI
import org.springframework.ui.Model;
import com.Se2.CyberWebApp.entity.ServiceEntity;
import com.Se2.CyberWebApp.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping("/services")
    public String viewServices(Model model) {
        // Lấy danh sách từ Database thông qua Repository
        List<ServiceEntity> list = serviceRepository.findAll();

        // Gửi danh sách này sang HTML.
        // Lưu ý: Tên "services" này sẽ được dùng ở th:each="${services}" trong HTML
        model.addAttribute("services", list);

        // Trả về file services.html trong thư mục src/main/resources/templates
        return "pages/services";
    }
}