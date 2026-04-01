package com.Se2.CyberWebApp.repository;

import com.Se2.CyberWebApp.entity.Publication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, Integer> {
    // Có thể thêm hàm tìm theo userId nếu muốn: List<Publication> findByUserId(Integer userId);
}