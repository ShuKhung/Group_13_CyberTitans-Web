package com.Se2.CyberWebApp.repository;

import com.Se2.CyberWebApp.entity.ClubEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubEventRepository extends JpaRepository<ClubEvent, Integer> {
}
