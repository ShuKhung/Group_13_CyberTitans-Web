package com.Se2.CyberWebApp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "publications")
public class Publication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id")
    private Integer userId;

    private String title;
    
    @Column(name = "original_author")
    private String originalAuthor;

    private String category;

    @Column(name = "created_at")
    private LocalDate createdAt; 

    @Column(name = "journal_name")
    private String journalName;

    @Column(name = "abstract_text", columnDefinition = "LONGTEXT")
    private String abstractText;

    @Column(name = "publication_url")
    private String publicationUrl;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getOriginalAuthor() { return originalAuthor; }
    public void setOriginalAuthor(String originalAuthor) { this.originalAuthor = originalAuthor; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
    public String getJournalName() { return journalName; }
    public void setJournalName(String journalName) { this.journalName = journalName; }
    public String getAbstractText() { return abstractText; }
    public void setAbstractText(String abstractText) { this.abstractText = abstractText; }
    public String getPublicationUrl() { return publicationUrl; }
    public void setPublicationUrl(String publicationUrl) { this.publicationUrl = publicationUrl; }
}