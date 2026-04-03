package com.Se2.CyberWebApp.repository;

import com.Se2.CyberWebApp.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Integer> {
    
    List<Announcement> findAllByOrderByCreatedAtDesc();

    List<Announcement> findByTypeOrderByCreatedAtDesc(String type);

    @Modifying
    @Query("UPDATE Announcement a SET a.isRead = true")
    void markAllAsRead();
    
    @Modifying
    @Query("UPDATE Announcement a SET a.isRead = true WHERE a.id = :id")
    void markAsReadById(@Param("id") Integer id);
}
